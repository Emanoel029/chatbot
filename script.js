const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessagen;
const API_KEY = "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"; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

const creatChatli = (message, className) => {
  //Criar um elemento <li> de chat com a mensagem e className passados
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : ` <span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessagen }],
    }),
  };
  //Enviar pedido POST para a API, obter resposta
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent =
        "Ops! Algo correu mal. Por favor, tente novamente.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
  userMessagen = chatInput.value.trim();
  if (!userMessagen) return;
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  //Anexar a mensagem do usuário à caixa de bate-papo
  chatbox.appendChild(creatChatli(userMessagen, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    //Mostra a mensagem "Pensando..." enquanto espera pela resposta
    const incomingChatLi = creatChatli("Pensando...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

//ajustar a altura da área de texto de entrada com base no seu conteúdo
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  //se a tecla enter for pressionada sem a tecla shift e a janela
  // for superior a 800px, tratamos do chat
  if (e.key === "Enter" && !e.shiftkey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
