import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { v4 } from "uuid";
const pastes = new Map<string, [string, Socket]>();
const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (_, r) => {
	r.send("Hello World!");
});

app.get("/:id", (req, res) => {
	const id = req.params.id;
	if (!pastes.has(id)) {
		return res.status(404).send("Paste not found");
	}
	res.header("content-type", "text/plain; charset=utf-8");
	res.status(200).send(pastes.get(id)![0]);
	const sock = pastes.get(id)![1];
	sock.connected && sock.emit("pasteDeleted", id);
	pastes.delete(id);
});

io.on("connection", (socket) => {
	socket.on("deletePaste", (paste: string) => {
		pastes.has(paste) &&
			pastes.get(paste)![1] === socket &&
			pastes.delete(paste);
	});
	socket.on("createPaste", (paste: string) => {
		if (typeof paste !== "string") {
			return socket.disconnect(true);
		}
		let id = v4();
		pastes.set(id, [paste, socket]);
		socket.emit("pasteCreated", id);
	});
});

server.listen(3000);
