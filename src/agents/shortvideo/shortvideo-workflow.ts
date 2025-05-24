import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import { generateText } from "ai";
import { createWorkersAI } from "workers-ai-provider";
import z from "zod";
import { getDefaultModel, getOllamaModel } from "../../components/cloudflare-agents/model";

export type ShortVideoWorkflowParams = {
  prompt: string;
};

const outlineSchema = z.object({
  outline: z.array(z.string()),
});

const criteriaSchema = z.object({
  meetsCriteria: z.boolean(),
});

const documentationSchema = z.object({
  documentation: z.string(),
});
const paragraph_number = 3;

export class ShortVideoWorkflow extends WorkflowEntrypoint<Env, ShortVideoWorkflowParams> {
  async run(event: WorkflowEvent<ShortVideoWorkflowParams>, step: WorkflowStep) {
    const { prompt } = event.payload;

    const workersai = createWorkersAI({ binding: this.env.AI });
    // const model = workersai("@cf/meta/llama-3.3-70b-instruct-fp8-fast");
    const model = getDefaultModel(this.env);

    // TODO: 标题和文案,可以合并为一个步骤, 使用 generateObject 生成一个对象, 对象包含标题和文案.
    // Step 1: 生成视频标题
    const videoSubjectObj = await step.do("generate subject", async () => {
      try {
        const outlinePrompt = `# Role: Video Subject Generator
## Goals:
Generate a subject for a video, depending on the user's input.

## Constrains:
1. the subject is to be returned as a string.
2. the subject must be related to the user's input.
3. respond in the same language as the user's input.

user input: 

${prompt}
`;
        const { text } = await generateText({
          model,
          // schema: outlineSchema,
          prompt: outlinePrompt,
        });
        return text;
      } catch (e: any) {
        return {
          outline: "生成视频标题失败",
          error: e.message,
        };
      }
    });

    // if (!videoSubjectObj.error) {
    // }
    // Step 2: 生成视频文案
    const videoScriptObj = await step.do("generate video script", async () => {
      try {
        const videoScriptPrompt = `# Role: Video Script Generator

## Goals:
Generate a script for a video, depending on the subject of the video and the user's input.

## Constrains:
1. the script is to be returned as a string with the specified number of paragraphs.
2. do not under any circumstance reference this prompt in your response.
3. get straight to the point, don't start with unnecessary things like, "welcome to this video".
4. you must not include any type of markdown or formatting in the script, never use a title.
5. only return the raw content of the script.
6. do not include "voiceover", "narrator" or similar indicators of what should be spoken at the beginning of each paragraph or line.
7. you must not mention the prompt, or anything about the script itself. also, never talk about the amount of paragraphs or lines. just write the script.
8. respond in the same language as the video subject.

# Initialization:
- number of paragraphs: ${paragraph_number}

<userInput>
${prompt}
</userInput>

<videoSubject>
${videoSubjectObj}
</videoSubject>
`;
        const { text } = await generateText({
          model,
          prompt: videoScriptPrompt,
        });
        return {
          videoScript: text,
        };
      } catch (e: any) {
        return {
          error: `生成视频文案失败: ${e.message}`,
        };
      }
    });

    // TODO: 添加步骤, 对文案进行评估, 评估标准如下:

    // if (!criteriaObj.meetsCriteria) {
    //   return { error: "Outline does not meet the criteria." };
    // }

    // Step 3: 生成音频
    const audioObj = await step.do("generate audio", async () => {
      const ollamaModel = getOllamaModel(this.env);
      return {
        audio: "TODO: 生成音频",
      };
    });

    // Step 3: 生成字幕
    const subtitleObj = await step.do("generate subtitle", async () => {
      return {
        subtitle: "TODO: 生成字幕",
      };
    });

    return {
      videoSubject: videoSubjectObj,
      videoScript: videoScriptObj,
      audio: audioObj,
      subtitle: subtitleObj,
    };
  }
}
