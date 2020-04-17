import io from "socket.io-client";

const url: string = 'http://localhost:8000';
const socket: SocketIOClient.Socket = io.connect(url);

export default socket;