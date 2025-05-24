import { Hono } from "hono";

const guidRoute = new Hono<{ Bindings: Env }>();

/**
 * 自动化操作指引, agent 启动后,应该先访问这个网址,获取指引后进行一系列操作
 */
guidRoute.all("/automate", (c) => {
  return c.text(`
***提示*
- 当编写html文件时,必须添加css 样式, 系统已经内置支持 tailwindcss ^4.0.0 的语法

""NOW BEGIN""


If LLM training continues to scale up at the current rhythm until 2030, 
what would be the electric power in GW required to power the biggest training runs by 2030? 
What would that correspond to, compared to some countries? Please provide a source for any numbers used. 
finnal report show in html format
`);
});

export default guidRoute;
