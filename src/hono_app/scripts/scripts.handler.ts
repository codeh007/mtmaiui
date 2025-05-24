import { createRouter } from "../agent_api/lib/createApp";

export const scriptRouter = createRouter()
  .get("/coleb", async (c) => {
    // 快速运行: ! curl -sSL https://mtmag.yuepa8.com/api/scripts/coleb | bash
    const bashScript = `#!/usr/bin/env bash
echo "Hello, run at coleb"
`;
    return c.text(bashScript, 200);
  })
  .get("/fooocus", async (c) => {
    // 参考: https://github.com/lllyasviel/Fooocus/blob/main/fooocus_colab.ipynb
    // 快速运行: ! curl -sSL https://mtmag.yuepa8.com/api/scripts/fooocus | bash
    const scriptRunFooocus = `#!/usr/bin/env bash
pip install pygit2==1.15.1
cd /content
git clone https://github.com/lllyasviel/Fooocus.git
cd Fooocus
python entry_with_update.py --share --always-high-vram


`;
    return c.text(scriptRunFooocus, 200);
  });
