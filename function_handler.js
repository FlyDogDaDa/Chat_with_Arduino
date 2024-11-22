import { enableVoice, disableVoice } from "./tts_handler.js";

const on_led_url = "http://192.168.114.107/onLed";
const off_led_url = "http://192.168.114.107/offLed";
const get_temperature_url = "http://192.168.114.107/get_temperature_text";

/**
//打開 LED。
 */
function openLed() {
  console.log("Arduino控制器：打開 LED");
  //發送開燈請求
  var xhr = new XMLHttpRequest();
  xhr.open("GET", on_led_url, false);
  try {
    xhr.send();
    if (xhr.status == 200) {
      return "LED is turned on";
    } else {
      console.error("開燈請求失敗");
      return "Failed to turn on LED";
    }
  } catch (error) {
    console.error("請求發生錯誤:", error);
    return "Failed to turn on LED";
  }
}
//關閉 LED。
function closeLed() {
  console.log("Arduino控制器：關閉 LED");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", off_led_url, false);
  try {
    xhr.send();
    if (xhr.status == 200) {
      return "LED is turned off";
    } else {
      console.error("關燈請求失敗");
      return "Failed to turn off LED";
    }
  } catch (error) {
    console.error("請求發生錯誤:", error);
    return "Failed to turn off LED";
  }
}

//獲得溫溼度。
function getTemperatureHumidity() {
  console.log("Arduino控制器：獲取溫溼度");
  //
  var xhr = new XMLHttpRequest();
  xhr.open("GET", get_temperature_url, false);
  try {
    xhr.send();
    if (xhr.status != 200) {
      console.error("溫濕度請求失敗");
    }
    const dataArray = xhr.responseText.split(",");
    // 將陣列中的元素轉換為浮點數
    const temperature = parseFloat(dataArray[0]);
    const humidity = parseFloat(dataArray[1]);
    return { temperature, humidity };
  } catch (error) {
    console.log("請求發生錯誤:", error);
    return "Failed to get temperature";
  }
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
