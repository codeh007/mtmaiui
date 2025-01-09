"use client";

export function useBasePath() {
  // 提示,这里使用下面这句会出问题,出现react hook more rerender 相关的问题. 所以暂时写死.
  // const dashPath = useMtmaiV2((x) => x.frontendConfig?.dashPath);
  return "/dash";
}
