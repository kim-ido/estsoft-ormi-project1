const chatContainer = document.querySelector(".chat-container");
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

const initialHeight = chatInput.scrollHeight;

let apiUrl = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`;
let userText = null;

// import {data} from "./data.js";
let data = [{
        role: "system",
        content: "assistant는 블록체인 분야의 전문가이다.",
    },{
        role: "user",
        content: "암호화폐에 대해 알려줘",
    },{
        role: "assistant",
        content: "암호학을 기반으로 한 디지털 화폐의 새로운 형태입니다. 2008년 비트코인의 탄생에서부터 시작되었습니다. 은행 또는 정부와 같은 중개자가 개입하지 않는 개인과 개인간의 거래를 지원합니다.",
    },{
        role: "user",
        content: "이더리움에 대해 알려줘",
    },{
        role: "assistant",
        content: "이더리움은 많은 커뮤니티로 구성된 네트워크이며, 사람들이 중앙화 시스템에 통제되지 않고 거래하고 소통할 수 있는 도구 세트입니다. 이더리움에는 이더리움 네트워크에서 특정 활동에 대한 비용을 지불하는 데 사용되는 자체 암호화폐인 이더가 있습니다.",
    },{
        role: "user",
        content: "블록체인에 대해 알려줘",
    },{
        role: "assistant",
        content: "블록체인은 트랜잭션의 데이터베이스이며, 네트워크 상의 수많은 컴퓨터에서 업데이트 되고 서로 공유합니다. 새롭게 추가된 트랜잭션의 묶음을 '블록'이라고 하며, 이는 블록체인이라는 이름의 유래입니다. 대부분의 블록체인은 공용이며, 데이터를 추가할 수는 있지만 제거할 수는 없습니다. 누군가 정보를 위조하거나 시스템을 해킹하려고 하는 경우, 네트워크에서 누구보다 많은 컴퓨팅 자원을 사용해야 합니다. 하지만 거의 불가능에 가깝죠! 덕분에 블록체인은 강력한 보안을 유지할 수 있습니다.",
    },{
        role: "user",
        content: "이더리움과 비트코인의 차이점을 알려줘",
    },{
        role: "assistant",
        content: "2015년에 출시된 이더리움은 비트코인의 혁신을 기반으로 하지만, 몇 가지 큰 차이점이 있습니다. 둘 다 결제 서비스 제공 업체 또는 은행 없이 디지털 화폐를 사용할 수 있도록 합니다. 하지만 이더리움은 프로그래밍이 가능하기 때문에 네트워크에 분산형 애플리케이션을 구축하고 배포할 수도 있습니다. 비트코인이 결제만을 위한 네트워크라면, 이더리움은 사용자의 개인정보를 존중하고 사용자를 검열할 수 없는 금융 서비스, 게임, 소셜 네트워크 및 다른 앱들의 시장과도 같습니다.",
    },{
        role: "user",
        content: "왜 이더리움을 사용하는지 알려줘",
    },{
        role: "assistant",
        content: "돈을 해외로 송금하거나, 거주하는 곳에서 통제 불가능한 외부 세력으로 인해 자산의 미래를 걱정해야 하거나, 일상적인 거래 시에 기존 금융 기관에서 받는 여러 제한 및 수수료 인상 부담 때문에 지쳤다면, 암호화폐가 제공하는 기능에 대해 관심이 생길 것입니다. 이더리움은 보다 저렴하고 빠른 해외 결제가 가능합니다. 지구 반대편에 있는 먼 곳에 돈을 전송하는데 몇 영업일, 심하면 몇 주가 걸리는 일반적인 은행과 달리, 이 혁신적인 수단을 통하면 단 몇 분 밖에 소요되지 않습니다.",
    },{
        role: "user",
        content: "스마트 컨트랙트에 대해 알려줘",
    },{
        role: "assistant",
        content: "스마트 계약은 간단히 컴퓨터 프로그램이며 이더리움 블록체인 상에서 구동됩니다. 스마트 계약은 한 사용자의 트랜잭션 또는 다른 계약에서 실행하려고 할 때만 실행됩니다. 이는 이더리움에서 할 수 있는 일을 크게 확장하며 다른 암호화폐와의 차별성을 부여합니다. 이러한 프로그램을 오늘날 우리는 분산형 앱 또는 디앱(DApp)이라고 부릅니다. 스마트 계약이 이더리움에 계시되면 이더리움이 존재하는 한 계속 작동하게 됩니다. 스마트 계약은 자동 방식이기 때문에 어떠한 사용자도 차별하지 않으며 언제나 사용할 수 있습니다.",
    }];

const getChatResponse = async (incomingChatDiv) => {
    const pElement = document.createElement("p");
    const result = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        redirect: "follow",
    })
        .then((res) => res.json())
        .then((res) => {
            pElement.textContent = res.choices[0].message.content;
        })
        .catch((err) => {
            pElement.classList.add("error");
            pElement.textContent = "이런, 뭔가 잘못됐어요! 다시 시도해 주세요.";
        });

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
};

const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("dark-mode", themeColor === "dark-mode");
    themeButton.innerText = document.body.classList.contains("dark-mode") ? "light_mode" : "dark_mode";

    const defaultText = `<div class="default-text">
                            <h1>IDOREUM</h1>
                            <h2>Chatbot</h2>
                            <p><strong>블록체인 분야의 무엇이든 물어보세요!</strong></p><br/>
                            <p>ex) 이더리움에 대해 알려줘</p>
                        </div>`;

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

loadDataFromLocalstorage();

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
};

const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
};

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/chatbot.png" alt="chatbot-img width="90px" height="90px">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;

    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
};

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if(!userText) return;

    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/user.png" alt="user-img" width="90px" height="90px">
                        <p></p>
                    </div>
                </div>`;

    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
};

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("dark-mode") ? "light_mode" : "dark_mode";
});

deleteButton.addEventListener("click", () => {
    if(confirm("정말 모든 대화를 삭제하시겠습니까?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

sendButton.addEventListener("click", handleOutgoingChat);