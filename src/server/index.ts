import { Room } from "./Room";
import { Game } from "./Game_Events";

class Server
{
    // #region Properties (2)

    private _game: Game;
    private _room: Room;

    // #endregion Properties (2)

    // #region Constructors (1)

    constructor()
    {
        this._room = new Room();
        this._game = new Game();
    }

    // #endregion Constructors (1)

    // #region Public Accessors (2)

    public get game(): Game
    {
        return this._game;
    }

    public get room(): Room
    {
        return this._room;
    }

    // #endregion Public Accessors (2)
}

const server_instance = new Server();
export  {server_instance};