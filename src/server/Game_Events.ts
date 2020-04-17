import { EventEmitter } from "events";
import { endpoints } from "./Socket_EndPoints";
import { game_events_name } from "./game_events_name";
import { server_instance } from ".";



export class Game
{
    // #region Properties (1)

    private game_event: EventEmitter;

    // #endregion Properties (1)

    // #region Constructors (1)

    constructor()
    {
        this.game_event = new EventEmitter();
    }

    // #endregion Constructors (1)

    // #region Public Methods (1)

    public change_gameEvent(gameEvent: EventEmitter)
    {
        this.game_event = gameEvent;
        this.game_event.on(game_events_name.increase_score, endpoints.increase_score)
        this.game_event.on(game_events_name.decrease_score, endpoints.decrease_score)
        // this.game_event.on('player_died',)
    }

    key_pressed = (keycode:string){
        
    }

    // #endregion Public Methods (1)
}
