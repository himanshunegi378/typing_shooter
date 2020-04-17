import { endpoints } from "./Socket_EndPoints";
import { Game } from "./Game_Events";

export class Room
{
    // #region Properties (1)

    private roomName: string;

    // #endregion Properties (1)

    // #region Constructors (1)

    constructor()
    {
        this.roomName = '';
    }

    // #endregion Constructors (1)

    // #region Public Methods (5)

    public async create_room(roomName: string)
    {
        let is_done: boolean = endpoints.create_room(roomName)
        if (is_done)
        {
            this.roomName = roomName;
        }
        return is_done;
    }

    public async destroy_room()
    {
        let is_done: boolean = endpoints.destroy_room(this.roomName)
        if (is_done)
        {
            this.roomName = '';
        }
        return is_done;
    }



    public async join_room(roomName: string)
    {
        let is_done: boolean = endpoints.join_room(roomName)
        if (is_done)
        {
            this.roomName = roomName;
        }
        return is_done;
    }

    public async leave_room()
    {
        let is_done: boolean = endpoints.leave_room(this.roomName)
        if (is_done)
        {
            this.roomName = '';
        }
        return is_done;
    }
    public get_roomName(): string
    {
        return this.roomName;
    }

    // #endregion Public Methods (5)
}

