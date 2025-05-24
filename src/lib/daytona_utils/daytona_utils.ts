import { Daytona, type Sandbox } from "@daytonaio/sdk";

// const defaultImage = "gitgit188/gomtm";
const defaultImage = "gitgit188/gomtm:latest";
const defaultSandboxLabel = "mtmai-sandbox";

function getDaytona() {
  return new Daytona({
    apiKey: process.env.DAYTONA_API_KEY,
    apiUrl: process.env.DAYTONA_API_URL,
  });
}

export const getDefaultSandbox = async () => {
  // Create a new sandbox
  const daytona = getDaytona();
  // find by label
  // list(labels?: Record<string, string>): Promise<Sandbox[]>
  let sandbox: Sandbox;
  const sandboxies = await daytona.list({ mtm_is_global: "true" });
  if (sandboxies.length > 0) {
    sandbox = sandboxies[0];
  } else {
    sandbox = await daytona.create({
      // image: defaultImage,
      // language: "typescript",
      language: "python",
      autoStopInterval: 10, // n 分钟后自动停止
      envVars: { NODE_ENV: "development" },
      labels: { mtm_is_global: "true" },
      resources: {
        cpu: 1,
        memory: 1, // 4GB RAM
        disk: 1,
      },
    });
  }
  if (!sandbox) {
    throw new Error("Failed to create sandbox");
  }
  return sandbox;
};

export const runPython = async (task: string) => {
  const files = [
    {
      path: "smolagent.py",
      content: new File([task], "task.py", { type: "text/plain" }),
    },
  ];

  const sandbox = await getDefaultSandbox();

  const uploadResponse = await sandbox.fs.uploadFiles(files);

  console.log(uploadResponse);

  // 执行代码
  const response = await sandbox.process.executeCommand("python smolagent.py");

  return response;
};
