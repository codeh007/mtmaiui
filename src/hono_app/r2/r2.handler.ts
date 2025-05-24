import type { ContentfulStatusCode } from "hono/utils/http-status";
import { createRouter } from "../agent_api/lib/createApp";

const pathPrefix = "/api/r2";
const defaultDelimiter = "/";
// const bucketRoot = "short_videos/";
export const r2Router = createRouter();

r2Router.get("/list/*", async (c) => {
  let path = c.req.path;
  if (path.startsWith(pathPrefix)) {
    path = path.slice(`${pathPrefix}/list`.length);
  }
  if (path.startsWith("/")) {
    path = path.slice(1);
  }
  const options: R2ListOptions = {
    prefix: `${path}/`,
    delimiter: c.req.query("delimiter") ?? defaultDelimiter,
    cursor: c.req.query("cursor") ?? undefined,
    // include: ["customMetadata", "httpMetadata"],
  };
  const listing = await c.env.MY_BUCKET.list(options);
  const html = `
    <h1>R2 List</h1>
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        ${listing.objects
          .map(
            (obj) => `
          <tr>
            <td><a href="${pathPrefix}/${obj.key}">${obj.key}</a></td>
            <td>${obj.size}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
    `;

  return c.html(html, 200);
});

//下载
r2Router.get("*", async (c) => {
  let path = c.req.path;
  if (path.startsWith(pathPrefix)) {
    path = path.slice(`${pathPrefix}`.length);
  }
  if (path.startsWith("/")) {
    path = path.slice(1);
  }

  if (!path) {
    return c.text(`file not found:${path}, c.req.path ${c.req.path}`, 404);
  }

  const object = await c.env.MY_BUCKET.get(path, {
    range: c.req.raw.headers,
    onlyIf: c.req.raw.headers, // 传递请求头以处理 If-None-Match 等条件请求
  });

  if (object === null) {
    return c.text(`object not found:${path}, c.req.path ${c.req.path}`, 404);
  }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  // 处理范围请求 (部分内容)
  if (object.range) {
    let rangeStart: number | undefined;
    let rangeEnd: number | undefined;
    if ("offset" in object.range) {
      rangeStart = object.range.offset;
      rangeEnd =
        object.range.length !== undefined
          ? object.range.offset! + object.range.length - 1
          : object.size - 1;
    } else if ("suffix" in object.range) {
      rangeStart = object.size - object.range.suffix;
      rangeEnd = object.size - 1;
    }

    if (
      rangeStart !== undefined &&
      rangeEnd !== undefined &&
      rangeStart >= 0 &&
      rangeEnd >= rangeStart &&
      rangeEnd < object.size
    ) {
      headers.set("content-range", `bytes ${rangeStart}-${rangeEnd}/${object.size}`);
    } else {
      console.warn(`为 key ${object.key} 计算出无效的范围:`, object.range);
    }
  }
  let status: number;
  let responseBody: ReadableStream | null = null;
  if ("body" in object && object.body instanceof ReadableStream) {
    responseBody = object.body;
    status = c.req.header("range") ? 206 : 200;
  } else {
    status = 304;
    responseBody = null;
    headers.delete("content-range");
  }

  const responseHeaders: Record<string, string> = {};
  headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });
  return c.body(responseBody!, status as ContentfulStatusCode, responseHeaders!);
});
