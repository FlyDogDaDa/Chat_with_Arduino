// LLM的對話訊息生成
let chatHistory = [];

const { GoogleGenerativeAI } = await import("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyDpGRXVqMS8NH-izfhVJ4K08yReX142EE8");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

const opencc = await import(
  "https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/cn2t.js"
);

const chat = model.startChat({ history: chatHistory });

export async function sendMessage(message) {
  chatHistory.push({ role: "user", parts: [{ text: message }] });
  const result = await chat.sendMessage(message);
  chatHistory.push({
    role: "model",
    parts: [{ text: result.response.text() }],
  });
  return result.response.text();
}

export async function convertToTraditionalChinese(text) {
  const converter = opencc.Converter({ from: "cn", to: "twp" });
  return converter(text);
}
