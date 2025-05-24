/**
 * 生成音频
 * 提示: 使用post 虽然可以提交更长的上下文, 但是返回音频文件需要自己保存
 * @param text 文本
 * @param voice 声音
 * @returns 音频
 */
export async function generateAudioViaPost(text, voice = "alloy") {
  const url = "https://text.pollinations.ai/openai";
  const payload = {
    model: "openai-audio",
    messages: [{ role: "user", content: text }],
    voice: voice,
  };
  //   console.log("Generating audio via POST:", payload);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    if (response.headers.get("Content-Type")?.includes("audio/mpeg")) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      //   console.log("Audio generated and playing.");
    } else {
      const errorText = await response.text();
      console.error("Expected audio, received:", response.headers.get("Content-Type"), errorText);
      throw new Error("API did not return audio content.");
    }
  } catch (error) {
    console.error("Error generating audio via POST:", error);
  }
}

/**
 * 生成音频
 * 提示: 使用 get
 * @param text 文本
 * @param voice 声音
 * @returns 音频
 */
export async function generateAudioViaGet(text, voice = "alloy") {
  const encodedText = encodeURIComponent(text);
  const params = new URLSearchParams({
    model: "openai-audio",
    voice: voice,
  });
  const url = `https://text.pollinations.ai/${encodedText}?${params.toString()}`;
  // 仅返回网址即可, 因为使用相同网址可以直接下载这个音频文件
  return url;
}

/**
 * 生成字幕(srt格式)
 * @param base64AudioData 音频数据
 * @param audioFormat 音频格式: mp3, m4a, wav, webm
 * @returns 字幕
 */
export async function generateSrt(base64AudioData: string, audioFormat: string) {
  const url = "https://text.pollinations.ai/openai";
  const payload = {
    model: "openai-audio",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "请根据音频生成字幕, 返回srt格式" },
          {
            type: "input_audio",
            input_audio: {
              data: base64AudioData,
              format: audioFormat,
            },
          },
        ],
      },
    ],
    // Optional: Add parameters like 'language'
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  const result: any = await response.json();
  const transcription = result?.choices?.[0]?.message?.content;
  // console.log("Transcription:", transcription);
  return transcription;
}
