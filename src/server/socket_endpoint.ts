import io from "socket.io-client";
import { EventEmitter } from "events";
import { parse } from "path";

const url: string = 'http://localhost:8000';

const socket: SocketIOClient.Socket = io.connect(url);

export const attach_room_event = (room_event: EventEmitter) =>
{
    room_event.on('create_room', (room_name: string) =>
    {
        socket.emit('create_room', room_name)
    })

    room_event.on('destroy_room', (room_name: string) =>
    {
        socket.emit('destroy_room', room_name)
    })

    room_event.on('join_room', (room_name: string) =>
    {
        socket.emit('join_room', room_name)
    })

    room_event.on('leave_room', (room_name) =>
    {
        socket.emit('leave_room', room_name)
    })
}

const attach_game_event = (game_event: EventEmitter) =>
{

}
