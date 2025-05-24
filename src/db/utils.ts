import { generateId } from "ai";

// 使用 Web Crypto API 实现密码哈希
export async function generateHashedPassword(password: string) {
  // 生成随机盐值
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // 将密码和盐值转换为 ArrayBuffer
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // 合并密码和盐值
  const combinedBuffer = new Uint8Array(passwordBuffer.length + salt.length);
  combinedBuffer.set(passwordBuffer);
  combinedBuffer.set(salt, passwordBuffer.length);

  // 使用 SHA-256 进行哈希
  const hashBuffer = await crypto.subtle.digest("SHA-256", combinedBuffer);

  // 将哈希结果和盐值转换为 base64 字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
  const saltBase64 = btoa(String.fromCharCode.apply(null, Array.from(salt)));

  // 返回格式: "salt:hash"
  return `${saltBase64}:${hashBase64}`;
}

export async function generateDummyPassword() {
  const password = generateId(12);
  const hashedPassword = await generateHashedPassword(password);
  return hashedPassword;
}
