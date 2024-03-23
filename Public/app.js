const socket = io("http://localhost:5000");

const messageContainer = document.getElementById("message-container")
const form = document.getElementById("send-container")
const message = document.getElementById("message")



const name = prompt("Enter you name")
console.log(name)
socket.emit("new-user-joined", name)

const appendFunc = (message, position) => {
    const messageElement = document.createElement("li")
    messageElement.innerHTML = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

socket.on("user-joined", name => {
    appendFunc(`${name} joined the chat `, "center")
})

socket.on("receive", data => {
    appendFunc(`${data.message}: ${data.name} `, "left")

})


form.addEventListener("submit", (e) => {
    e.preventDefault();
    const mymessage = message.value;
    appendFunc(`You :${mymessage}`)
    socket.emit("send", mymessage)
    message.value = ""
})
