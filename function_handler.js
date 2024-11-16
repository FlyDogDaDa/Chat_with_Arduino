import { enableVoice, disableVoice } from "./tts_handler.js";

/**
//打開 LED。
 */
function openLed() {
  console.log("Arduino控制器：打開 LED");
  return true;
}
const openLedFunctionDeclaration = {
  name: "openLed",
  parameters: {
    type: "OBJECT", //"OBJECT",
    description: "Turn on the LED bulb.",
    properties: {
      Null: {
        type: "STRING",
        description:
          "Useless parameters, the incoming content will be ignored.",
      },
    },
    required: [],
  },
};

//關閉 LED。
function closeLed() {
  console.log("Arduino控制器：關閉 LED");
  return false;
}
const closeLedFunctionDeclaration = {
  name: "closeLed",
  parameters: {
    type: "OBJECT", //"OBJECT",
    description: "Turn off the LED bulb.",
    properties: {
      Null: {
        type: "STRING",
        description:
          "Useless parameters, the incoming content will be ignored.",
      },
    },
    required: [],
  },
};

//獲得溫溼度。
function getTemperatureHumidity() {
  console.log("Arduino控制器：獲取溫溼度");
  // 這裡先用假資料代替
  const temperature = 25;
  const humidity = 60;
  return { temperature, humidity };
}

const getTemperatureHumidityFunctionDeclaration = {
  name: "getTemperatureHumidity",
  parameters: {
    type: "OBJECT", //"OBJECT",
    description:
      "Get temperature and humidity from sensors. The temperature is returned in degrees and the humidity is returned in relative humidity unit percentage.",
    properties: {
      Null: {
        type: "STRING",
        description:
          "Useless parameters, the incoming content will be ignored.",
      },
    },
    required: [],
  },
};

const enableVoiceOutputFunctionDeclaration = {
  name: "enableVoiceOutput",
  parameters: {
    type: "OBJECT",
    description: "Enter normal speaking mode and your voice will be heard",
    properties: {
      Null: {
        type: "STRING",
        description:
          "Useless parameters, the incoming content will be ignored.",
      },
    },
    required: [],
  },
};

const disableVoiceOutputFunctionDeclaration = {
  name: "disableVoiceOutput",
  parameters: {
    type: "OBJECT",
    description:
      "Enter quiet mode and your voice will be hidden. You can still communicate, just in words.",
    properties: {
      Null: {
        type: "STRING",
        description:
          "Useless parameters, the incoming content will be ignored.",
      },
    },
    required: [],
  },
};

export const functionDeclarations = [
  openLedFunctionDeclaration,
  closeLedFunctionDeclaration,
  getTemperatureHumidityFunctionDeclaration,
  enableVoiceOutputFunctionDeclaration,
  disableVoiceOutputFunctionDeclaration,
];

export const functions = {
  openLed: openLed,
  closeLed: closeLed,
  getTemperatureHumidity: getTemperatureHumidity,
  enableVoiceOutput: enableVoice,
  disableVoiceOutput: disableVoice,
};
