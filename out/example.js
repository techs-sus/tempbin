import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
socket.on("connect", () => {
    console.log("socket connected - client");
    socket.emit("createPaste", "hi");
});
socket.on("pasteDeleted", (id) => {
    console.log(`paste ${id} deleted`);
});
socket.on("pasteCreated", (id) => {
    console.log(`paste created: ${id}`);
});
socket.on("message", (x) => {
    console.log(x);
});
