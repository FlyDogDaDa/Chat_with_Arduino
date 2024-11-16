let speech = new SpeechSynthesisUtterance();
export let isVoiceEnabled = true;
const toggleVoiceButton = document.getElementById("toggleVoiceButton");

window.speechSynthesis.onvoiceschanged = () => {
  const voices = window.speechSynthesis.getVoices();
  const voice = voices[4];
  speech.voice = voice;
};

export function speak(text) {
  if (isVoiceEnabled) {
    speech.text = text;
    window.speechSynthesis.speak(speech);
  }
}

export function enableVoice() {
  isVoiceEnabled = true;
  toggleVoiceButton.classList.remove("disabled");
  toggleVoiceButton.classList.add("enabled");
}

export function disableVoice() {
  isVoiceEnabled = false;
  toggleVoiceButton.classList.remove("enabled");
  toggleVoiceButton.classList.add("disabled");
}
