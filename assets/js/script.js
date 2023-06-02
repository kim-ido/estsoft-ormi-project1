import {data} from "./data.js";

const chatContainer = document.querySelector(".chat-container");
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;

const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("themeColor");

    document.body.classList.toggle("dark-mode", themeColor === "dark-mode");
    themeButton.innerText = document.body.classList.contains("dark-mode") ? "light_mode" : "dark_mode";

    const defaultText = `<div class="default-text">
                            <p><strong>나만의 블록체인 전문가</strong></p>
                            <h1>IDOREUM</h1>
                            <h2>Chatbot</h2><br/>
                            <p>ex) 스마트 컨트랙트에 대해 알려줘</p>
                        </div>`;

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`;
    const pElement = document.createElement("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].message.content;
    } catch (error) {
        pElement.classList.add("error");
        pElement.textContent = "이런, 뭔가 잘못됐어요! 다시 시도해 주세요.";
        console.log(error);
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
};
// const getChatResponse = async (incomingChatDiv) => {
//     const pElement = document.createElement("p");
//     const result = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//     })
//         .then((response) => response.json())
//         .then((response) => {
//             pElement.textContent = response.choices[0].message.content;
//         })
//         .catch((err) => {
//             pElement.classList.add("error");
//             pElement.textContent = "이런, 뭔가 잘못됐어요! 다시 시도해 주세요.";
//         });

//     incomingChatDiv.querySelector(".typing-animation").remove();
//     incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
//     localStorage.setItem("all-chats", chatContainer.innerHTML);
//     chatContainer.scrollTo(0, chatContainer.scrollHeight);
// };

const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
};

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="./assets/images/chatbot.png" alt="chatbot-img width="90px" height="90px">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;

    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
};

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if(!userText) return;

    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="./assets/images/user.png" alt="user-img" width="90px" height="90px">
                        <p>${userText}</p>
                    </div>
                </div>`;

    const outgoingChatDiv = createChatElement(html, "outgoing");
    // outgoingChatDiv.querySelector("p").textContent = userText;
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
};

deleteButton.addEventListener("click", () => {
    if(confirm("정말 모든 대화를 삭제하시겠습니까?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("dark-mode") ? "light_mode" : "dark_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);