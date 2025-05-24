/**
 * 调用文生图模型
 * return image url
 */
export async function genImage(prompt: string) {
  // 免费的文生图 api: https://github.com/pollinations/pollinations

  const _prompt = encodeURIComponent(prompt);

  const getParams = {
    model: "flux",
    width: "1024",
    height: "1024",
    nologo: "true",
    safe: "false", //这个参数还需要斟酌
    enhance: "false",
    seed: "2216940475",
  };
  const apiUrl = `https://image.pollinations.ai/prompt/${_prompt}?${new URLSearchParams(getParams).toString()}`;
  await fetch(apiUrl);
  return apiUrl;
}
