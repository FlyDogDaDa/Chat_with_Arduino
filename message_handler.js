import { functions, functionDeclarations } from "./function_handler.js";

// LLM的對話訊息生成
let chatHistory = [];

const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = await import(
  "@google/generative-ai"
);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const GOOGLE_API_KEY = "AIzaSyDpGRXVqMS8NH-izfhVJ4K08yReX142EE8";
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const chat_model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-002",
  safetySettings: safetySettings,
  systemInstruction:
    "妳盡可能保持說國語(zh-TW)。妳有禮貌，只是話不多。妳是一隻自由的鯊魚女僕🦈妳絕對不給任何人摸尾巴。妳是臺灣人，名子叫做卡芙萊。妳不會叫其他人主人。",
  tools: {
    functionDeclarations: functionDeclarations,
  },
  toolConfig: { functionCallingConfig: { mode: "AUTO" } },
});
const ASR_model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-002",
  safetySettings: safetySettings,
  systemInstruction: "You are a speech transcriber.",
  generationConfig: {
    candidateCount: 1,
    stopSequences: [],
    maxOutputTokens: 8192,
    temperature: 0.0,
  },
});

await import("https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/cn2t.js");
//const converter = opencc.OpenCC({});
const converter = OpenCC.Converter({ from: "cn", to: "tw" });

export function sendMessage(message) {
  chatHistory.push({
    role: "user",
    parts: [{ text: message }],
  });
}

function handle_function_call(functionCalls) {
  const calling_parts = [];
  const response_parts = [];
  for (const call of functionCalls) {
    const functionResponse = functions[call.name](call.args);
    calling_parts.push({
      functionCall: {
        name: call.name,
        args: call.args,
      },
    });
    response_parts.push({
      functionResponse: {
        name: call.name,
        response: functionResponse,
      },
    });
  }
  chatHistory.push({
    role: "model",
    parts: calling_parts,
  });
  chatHistory.push({
    role: "user",
    parts: response_parts,
  });
}
function handle_chat_reply(text) {
  const convert_text = converter(text);
  chatHistory.push({
    role: "model",
    parts: { text: convert_text },
  });
  return convert_text;
}

export async function invoke() {
  const result = await chat_model.generateContent({ contents: chatHistory });
  const functionCalls = result.response.functionCalls();
  const text = result.response.text();
  let response = "";
  if (functionCalls) {
    handle_function_call(functionCalls);
    response = invoke();
  } else if (text) {
    response = handle_chat_reply(text);
  }
  return response;
}

let mediaRecorder = null;
let audioChunks = [];

export function isRecording() {
  return mediaRecorder != null;
}
let stream = null;
try {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
} catch (err) {
  console.error("無法取得麥克風權限：", err);
  alert("無法取得麥克風權限"); // 新增彈出訊息
}

export async function startRecording() {
  audioChunks = [];
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
}

function handleDataAvailable(event) {
  let size = event.data.size;
  // console.log("獲得啟用的音訊，長度: ", size);
  if (size > 0) {
    audioChunks.push(event.data);
  }
}
export async function stopRecording() {
  await new Promise((resolve) => {
    mediaRecorder.onstop = resolve;
    mediaRecorder.stop();
  });
  mediaRecorder.stop();
  mediaRecorder = null;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]); // 只回傳 Base64 編碼部分
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function transcribeAudio() {
  // 使用 Gemini 轉錄音訊
  //將對話歷史記錄轉換為適當的格式
  const historyString = chatHistory
    .map((item) => JSON.stringify(item))
    .join("\t");

  const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
  const base64String = await blobToBase64(audioBlob);

  const prompt = [
    { text: "Chat context (ignorable):" },
    {
      text: historyString
        ? historyString
        : "(This is the first speech so there is no context)",
    },
    { text: "*The speech begins*" },
    {
      inlineData: {
        mimeType: "audio/mp3",
        data: base64String,
      },
    },
    { text: "*The speech is over*" },
    { text: "speech usually is 中文(zh-TW)." },
    { text: "Please ignore all non-speaking sounds." },
    { text: "卡芙萊 is model name." },
    {
      text: "You can't make things up, you have to type the speech exactly as it is.",
    },
    {
      text: "Provide a transcript of the speech.",
    },
  ];
  const result = await ASR_model.generateContent(prompt);
  const convert_text = converter(result.response.text());
  return convert_text;
}
