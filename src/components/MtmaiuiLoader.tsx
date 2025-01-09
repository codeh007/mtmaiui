import Script from "next/script";

type MtmaiDevSrcProps = {
  uiUrl?: string;
};

/**
 * 加载后端脚本,(开发版或生产版)
 * @param props
 * @returns
 */
export function MtmaiuiLoaderScript(props: MtmaiDevSrcProps) {
  const uiUrl = props.uiUrl || "http://localhost:6111";
  const scriptSrc =
    process.env?.NODE_ENV === "production"
      ? `${uiUrl}/mtmaiui_load.js`
      : `${uiUrl}/mtmaiui_load.js`;
  return (
    <>
      <Script type="module" crossOrigin="anonymous" src={`${scriptSrc}`} />
    </>
  );
}
