import type { Connection, ConnectionContext, Schedule } from "agents";
import { unstable_callable as callable } from "agents";
import { unstable_getSchedulePrompt, unstable_scheduleSchema } from "agents/schedule";
import {
  type StreamTextOnFinishCallback,
  type ToolSet,
  createDataStreamResponse,
  generateId,
  generateObject,
  streamText,
} from "ai";
import { experimental_createMCPClient, generateText } from "ai";
import { z } from "zod";
import { genImage } from "../../agent_utils/text2image";
import { generateAudioViaGet, generateSrt } from "../../agent_utils/tts";
import { getDefaultModel } from "../../components/cloudflare-agents/model";
import { ChatAgentBase } from "../ChatAgentBase";
import { tools } from "../tools";
import type { ShortVideoAgentState, ShortVideoInMessage } from "./shortvideo_agent_state";

export class ShortVideoAg extends ChatAgentBase<Env, ShortVideoAgentState> {
  initialState = {
    mtmai_api_endpoint: "https://colab-7860.yuepa8.com/sse",
    video_subject: "",
    // mainSence: {
    //   title: "",
    //   subScenes: [],
    //   fps: 30,
    //   width: 1080,
    //   height: 1920,
    // },
    videoMeta: {
      fps: 30,
      width: 1080,
      height: 1920,
    },
  } satisfies ShortVideoAgentState;

  onStart(): void | Promise<void> {}
  onConnect(connection: Connection, ctx: ConnectionContext) {}
  onClose(connection: Connection) {}

  async onMessage(connection: Connection, message: string): Promise<void> {
    this.log("onMessage", message);
    const event = JSON.parse(message) as ShortVideoInMessage;
    const eventType = event.type;
    this.log("onMessage", eventType);
    switch (eventType) {
      case "shortvideo_topic":
        console.log("shortvideo_topic", event);
        break;
      case "run_workflow_shortvideo":
        await this.onRunWorkflowShortvideo(connection, event);
        break;
      default:
        return super.onMessage(connection, message);
    }
  }

  async onChatMessage(
    onFinish: StreamTextOnFinishCallback<ToolSet>,
    options?: { abortSignal?: AbortSignal },
  ) {
    const model = getDefaultModel(this.env);
    const lastestMessage = this.messages?.[this.messages.length - 1];
    const userInput = lastestMessage?.content;
    const dataStreamResponse = createDataStreamResponse({
      execute: async (dataStream) => {
        const result = streamText({
          model,
          messages: this.messages,
          tools: this.getTools(),
          onFinish: (result) => {
            onFinish(result);
          },
          onError: (error) => {
            console.log("onStreamText error", error);
          },
        });
        result.mergeIntoDataStream(dataStream);
      },
    });

    return dataStreamResponse;
  }

  getTools() {
    return { ...tools, ...this.toolGenShortVideo() };
  }
  toolGenShortVideo() {
    return {};
  }
  async onTest1() {
    const model = getDefaultModel(this.env);
    try {
      const client = await experimental_createMCPClient({
        transport: {
          type: "sse",
          // url: mcpServerUrl,
        },
      });

      const tools = await client.tools();
      this.log("tools", JSON.stringify(tools));

      const response = await generateText({
        model: model,
        tools,
        messages: [{ role: "user", content: "结合你可以获取的工具, 告诉我你能做什么?" }],
      });
      await client.close();
      this.log("response", response.text);
    } catch (error) {
      this.handleException(error);
    }

    // this.log(`(自定义库)开始连接 mcp server: ${mcpServerUrl}`);
    // const mcpClient = new MCPClientManager("mcp-clients", "1.11.0");

    // const { id, authUrl } = await mcpClient.connect(mcpServerUrl);
    // this.log("连接完成, 开始获取工具");
    // const tools4 = mcpClient.listTools();
    // this.log("tools4", JSON.stringify(tools4));

    // this.log(`开始连接 mcp server: ${mcpServerUrl}`);
    // // await this.mcp.connect(mcpServerUrl);
    // // 问题: 官方例子,确实时使用 mcp.connect 连接服务器的, 但是 提示 超时,可能因为版本问题导致的.
    // const { id, authUrl } = await this.mcp.connect(mcpServerUrl);
    // this.log("连接完成, 开始获取工具");
    // const tools3 = this.mcp.unstable_getAITools();
    // this.log("tools3", JSON.stringify(tools3));
    // const tools2 = this.mcp.listTools();
    // this.log("tools2", JSON.stringify(tools2));

    // const mcpClient = await createMCPClient({
    //   transport: {
    //     type: "sse",
    //     url: mcpServerUrl,
    //   },
    // });
    // const response = await generateText({
    //   model: model,
    //   tools: await mcpClient.tools(), // use MCP tools
    //   prompt: `立即调用 "greet" 工具, 传入参数:"你好"`,
    // });
    // this.log("response", response.text);
  }
  async onTest2(connection: Connection) {
    this.log("onTest2 启动");
    const userInput = "请在20秒后, 生成一个视频, 视频的主题是: 如何使用llm 生成一个视频";
    const model = getDefaultModel(this.env);
    //步骤1: 通过llm 生成计划任务数据
    const result = await generateObject({
      model,
      mode: "json",
      schemaName: "task",
      schemaDescription: "A task to be scheduled",
      schema: unstable_scheduleSchema, // <- the shape of the object that the scheduler expects
      maxRetries: 5,
      prompt: `${unstable_getSchedulePrompt({
        date: new Date(),
      })} 
Input to parse: "${userInput}"`,
    });
    const { when, description } = result.object;
    if (when.type === "no-schedule") {
      this.notifyError(`No schedule provided for ${userInput}`, connection);
      return;
    }

    // 将任务安排放到队列
    const schedule = await this.schedule(
      when.type === "scheduled"
        ? when.date!
        : when.type === "delayed"
          ? when.delayInSeconds!
          : when.cron!,
      "onTask",
      description,
    );

    //通知客户端
    this.notifySchedule(schedule, connection);
  }

  // async onTest3(connection: Connection) {
  //   this.log("onTest3 启动");
  //   // schedule a task to run every 10 seconds
  //   // const { id } = await this.schedule("*/20 * * * *", "someTask", { message: "hello" });

  //   // schedule a task to run in 10 seconds
  //   const task = await this.schedule(10, "someTask", { message: "hello" });
  //   this.setState({
  //     schedules: [...this.state.schedules, task],
  //   });
  // }

  // async someTask(params: { message: string }) {
  //   this.log("someTask启动", params);
  //   this.setState({
  //     schedules: this.state.schedules.filter((t) => t.id !== params.id),
  //     scheduleFinished: [...this.state.scheduleFinished, params.id],
  //   });
  // }

  async onRunWorkflowShortvideo(connection: Connection, event: any) {
    this.log("onRunWorkflowShortvideo启动");

    const exampleCase = `
在没有小红书的年代，成为网红并不容易，而绿茶旅社里来来往往的游客就成了初代网红成功出圈的重要推手。随着入住的游客越来越多，“绿茶旅社”的餐饮服务也因为游客们的口口相传形成口碑。2008年，绿茶旅社彻底转型成绿茶餐厅，并且因其独特的中式装修风格和亲民的定价迅速吸引了众多消费者。根据媒体报道，当时首家绿茶餐厅还创下了单日14次的翻台纪录。
`;

    const workflowInstance = await this.env.SHORTVIDEO_WORKFLOW.create({
      id: generateId(),
      params: {
        prompt: exampleCase,
      },
    });
    this.log("workflowInstance", workflowInstance.id);
  }

  /**
   * 实际的任务调度
   * @param payload
   * @param schedule
   */
  async onTask(payload: unknown, schedule: Schedule<string>) {
    this.notifyRunSchedule(schedule);
  }

  @callable()
  async onGenShortVideo(topic: string) {
    try {
      await this.stepGenTopic(topic);
      await this.stepGenShortVideoScript(topic);
      await this.stepGenSpeech(topic);
      await this.stepGenSrt();
      await this.stepGenScence(topic);

      return "视频生成成功";
    } catch (error) {
      this.handleException(error);
    }
  }

  @callable()
  async stepGenTopic(topic: string) {
    // 主标题生成
    const genTitlePrompt = `你是专业的视频生成助手, 请根据以下内容, 生成一个视频标题, 视频标题需要符合以下要求:
1. 适合发布到 tiktok 平台:
2. 仅输出标题,不要解释和啰嗦

<topic>
输入内容: ${topic}
</topic>
`;

    const textResult = await generateText({
      model: getDefaultModel(this.env),
      messages: [{ role: "user", content: genTitlePrompt }],
    });

    this.setState({
      ...this.state,
      video_subject: textResult.text,
    });

    return textResult.text;
  }

  @callable()
  async stepGenShortVideoScript(topic: string) {
    // 生成视频脚本(文案)
    const genScriptPrompt = `你是专业的视频生成助手, 请根据以下内容, 生成一个视频脚本, 视频脚本需要符合以下要求:
    1. 适合发布到 tiktok 平台:
    2. 仅输出脚本,不要解释和啰嗦

    <topic>
    输入内容: ${topic}
    </topic>
    `;
    const scriptResult = await generateText({
      model: getDefaultModel(this.env),
      messages: [{ role: "user", content: genScriptPrompt }],
    });
    this.setState({
      ...this.state,
      video_script: scriptResult.text,
    });
  }
  @callable()
  async stepGenSpeech(topic: string) {
    // 生成解说语音解说
    const genSpeechPrompt = `你是专业的视频生成助手, 请根据以下内容, 生成一个视频解说语音, 视频解说语音需要符合以下要求:
    1. 适合发布到 tiktok 平台:
    2. 仅输出语音,不要解释和啰嗦

    <topic>
    视频主题: ${topic}
    </topic>
    <剧本>
    视频脚本: ${this.state.video_script}
    </剧本>
    `;

    const speechText = await generateText({
      model: getDefaultModel(this.env),
      messages: [{ role: "user", content: genSpeechPrompt }],
    });

    const speechResult = await generateAudioViaGet(speechText.text);
    this.setState({
      ...this.state,
      speechUrl: speechResult,
    });
  }
  @callable()
  async stepGenSrt() {
    // 语音解说字幕
    if (!this.state.speechUrl) {
      throw new Error("语音解说不存在");
    }
    const audioResponse = await fetch(this.state.speechUrl);
    const audioBytes = await audioResponse.arrayBuffer();
    if (!audioBytes.byteLength) {
      throw new Error("语音解说音频不正确");
    }

    const audioFormat = "mp3";
    const audioBase64 = Buffer.from(audioBytes).toString("base64");
    const srt = await generateSrt(audioBase64, audioFormat);

    this.setState({
      ...this.state,
      srt,
    });
  }
  @callable()
  async stepGenScence(topic: string) {
    const SingleImageSenceGenSchema = z.array(
      z.object({
        imageGeneratePrompt: z.string().describe("文字生成图片的提示词"),
        title: z.string().describe("显示在场景中央的标题"),
        duration: z.number().describe("场景时长,精确到毫秒"),
      }),
    );

    try {
      // 场景生成
      const genScenesPrompt = `你是专业的有10年经验的短编辑助手, 非常熟悉 TIKTOK 平台的短视频编辑及发布,直到如何通过画面和文字,吸引用户的观看.
    生成的场景数据, 将会后续使用 文生图 AI工具生成最终的图片.
    图片的标题,描述,时长,等将会使用专业的工具渲染为最终视频
    <要求>
    1. 适合发布到 tiktok 平台:
    2. 仅输出场景,不要解释和啰嗦
    3. 场景需要符合视频标题
    4: 场景数量为3个
    </要求>

    <topic>
    ${topic}
    </topic>
    <title>
    视频标题: ${this.state.video_subject}
    </title>
    <任务>
      根据上文提供的信息,生成3个场景,每个场景需要包含图片描述和图片标题, 场景时长精确到毫秒.    
    </任务>

    `;
      const objResult = await generateObject({
        model: getDefaultModel(this.env),
        mode: "json",
        schemaName: "scenes",
        schemaDescription: "A scenes to be scheduled",
        schema: SingleImageSenceGenSchema,
        maxRetries: 3,
        messages: [{ role: "user", content: genScenesPrompt }],
      });

      const scenes: z.infer<typeof SceneSchema>[] = [];
      for (const scene of objResult.object) {
        const imageResult = await genImage(scene.imageGeneratePrompt);
        scenes.push({
          senceType: "single_image",
          title: scene.title,
          image: imageResult,
          duration: scene.duration,
        });
        this.log("生成了场景图片", imageResult);
      }

      this.setState({
        ...this.state,
        video_subject: this.state.video_subject,
        mainSence: {
          title: this.state.video_subject,
          subScenes: scenes,
        },
      });
      return scenes;
    } catch (error) {
      this.handleException(error);
    }
  }
}
