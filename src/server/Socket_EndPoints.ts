import { room_events_name } from "./room_events_name";
import { game_events_name } from "./game_events_name";

export interface ISocket_Endpoints
{
}

class Socket_EndPoints implements ISocket_Endpoints
{
    // #region Properties (2)

    private socket!: SocketIOClient.Socket;
    private url: string = 'http://localhost:8000';

    // #endregion Properties (2)

    // #region Constructors (1)

    constructor()
    {
        this.connect(this.url)
    }

    // #endregion Constructors (1)

    // #region Public Methods (6)

    public create_room(roomName: string): boolean
    {
        let isRoomCreated: boolean = false;
        this.socket.emit(room_events_name.create_room, roomName, (isDone: boolean) =>
        {
            isRoomCreated = isDone;
        })
        return isRoomCreated;
    }

    public decrease_score(decreaseScoreby: number)
    {
        this.socket.emit(game_events_name.decrease_score, decreaseScoreby)
    }

    public destroy_room(roomName: string): boolean
    {
        let isRoom_destroyed: boolean = false;
        this.socket.emit(room_events_name.destroy_room, roomName, (isDone: boolean) =>
        {
            isRoom_destroyed = isDone;
        })
        return isRoom_destroyed;
    }

    public increase_score(increaseScoreby: number)
    {
        this.socket.emit(game_events_name.increase_score, increaseScoreby);
    }

    public join_room(roomName: string): boolean
    {
        let isRoom_joined: boolean = false;
        this.socket.emit(room_events_name.join_room, roomName, (isDone: boolean) =>
        {
            console.log(isDone)
            isRoom_joined = isDone;
        })
        return isRoom_joined;
    }

    public leave_room(roomName: string)
    {
        let isRoom_left: boolean = false;
        this.socket.emit(room_events_name.leave_room, roomName, (isDone: boolean) =>
        {
            isRoom_left = isDone;
        })
        return isRoom_left;
    }


    // #endregion Public Methods (6)

    // #region Private Methods (1)

    private connect(url: string)
    {
        this.socket = io.connect(url)
    }

    // #endregion Private Methods (1)
}
const endpoints = new Socket_EndPoints();
export { endpoints };