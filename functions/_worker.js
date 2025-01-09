export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 如果请求的是静态资源，直接返回
    if (url.pathname.startsWith("/assets/")) {
      return env.ASSETS.fetch(request);
    }

    try {
      //   // 创建一个模拟的response对象
      //   const responseData = {
      //     statusCode: 200,
      //     headers: new Headers({
      //       "Content-Type": "text/html",
      //     }),
      //     body: "",
      //     end(html) {
      //       this.body = html;
      //     },
      //     setHeader(name, value) {
      //       this.headers.set(name, value);
      //     },
      //   };

      //   // 调用SSR渲染函数
      //   await render(url.pathname, responseData);

      //   // 返回渲染结果
      //   return new Response(responseData.body, {
      //     status: responseData.statusCode,
      //     headers: responseData.headers,
      //   });
      return new Response("xxxxxxxxxxxx98");
    } catch (error) {
      console.error("SSR Error:", error);
      return new Response("Server Error", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};
