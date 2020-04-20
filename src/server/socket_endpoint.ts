import io from "socket.io-client";
import { EventEmitter } from "events";
import { parse } from "path";

const url: string = 'http://localhost:8000';

const socket: SocketIOClient.Socket = io.connect(url);
let roomName: string = '';

export const attach_room_event = (room_event: EventEmitter) =>
{
    room_event.on('create_room', (room_name: string) =>
    {
        socket.emit('create_room', room_name)
        roomName = room_name;
    })

    room_event.on('destroy_room', (room_name: string) =>
    {
        socket.emit('destroy_room', room_name)
        roomName = '';

    })

    room_event.on('join_room', (room_name: string) =>
    {
        socket.emit('join_room', room_name)
    })

    socket.on('room_joined', (room_name: string) =>
    {
        roomName = room_name;
    })

    room_event.on('leave_room', (room_name) =>
    {
        socket.emit('leave_room', room_name)
        roomName = '';
    })
}

const attach_game_event = (game_event: EventEmitter) =>
{
    game_event.on('key_pressed', (keyCode, callback) =>
    {
        socket.emit('key_pressed', keyCode, roomName, callback)
    })

    socket.on('text_received', (text: string) =>
    {
        game_event.emit('text_received', text)
    })


}
