const chatContainer = document.getElementById("chat-container");
const loading = document.getElementById("loading");
const sendButton = document.getElementById("sendButton");
const textInput = document.getElementById("textInput");

export function addMessage(sender, content) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", `${sender}-message`);

  const messageBubble = document.createElement("div");
  messageBubble.classList.add("message-bubble", `${sender}-message-bubble`);

  messageBubble.innerHTML = content;

  messageElement.appendChild(messageBubble);
  chatContainer.prepend(messageElement);

  return messageElement;
}

export function handleLoading(display) {
  loading.style.display = display;
  sendButton.disabled = display === "block";
}

export function clearInput() {
  textInput.value = "";
}
