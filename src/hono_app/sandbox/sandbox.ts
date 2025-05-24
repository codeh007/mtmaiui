import { getDefaultSandbox } from "@mtmaiui/lib/daytona_utils/daytona_utils";
import { createRouter } from "../agent_api/lib/createApp";

export const sandboxRouter = createRouter();

/**
 * 简单执行 bash 命令
 */
sandboxRouter.post("/run/agent", async (c) => {
  const sandbox = await getDefaultSandbox();
  try {
    // Create a new sandbox

    const smolagentTask = "请自我介绍, 告诉我你的能力.";

    const files = [
      {
        path: "smolagent.py",
        content: new File([smolagentTask], "smolagent.py", { type: "text/plain" }),
      },
    ];

    const uploadResponse = await sandbox.fs.uploadFiles(files);

    console.log(uploadResponse);
    const installMtmai =
      "curl -LsSf https://astral.sh/uv/install.sh | sh && sudo apt update && sudo apt install -yqq ffmpeg libavformat-dev libavcodec-dev libavdevice-dev libavutil-dev libavfilter-dev libswscale-dev libswresample-dev";

    // Execute a command
    const response = await sandbox.process.executeCommand(installMtmai);
    const installMtmaiResponse = await sandbox.process.executeCommand(
      "export PATH=$HOME/.local/bin:$PATH && uv pip install mtmai --system",
    );

    const fullResponseText = response.result;
    const pythonCode = `
print ("Hello, World!")
`;
    const response2 = await sandbox.process.codeRun(pythonCode, {});
    return c.json({
      result: response2.result,
      fullResponseText: fullResponseText,
      uploadResponse: uploadResponse,
      installMtmaiResponse,
    });
  } catch (error: any) {
    return c.text(error);
  } finally {
    await sandbox.stop();
    await sandbox.delete();
  }
});
