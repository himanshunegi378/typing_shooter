import { Game } from "./Game_Events";
import { Room } from './Room';
import { EventEmitter } from 'events';

 class GameRoom extends Room
{
    private game: Game;
    constructor()
    {
        super();
        this.game = new Game();
    }

    /**
     * changeGame
gameEvent:Event     */
    public changeGame(gameEvent:EventEmitter) {
        this.game.change_gameEvent(gameEvent);
        
    }

    public startGame(){}

   
}
const game_room  = new GameRoom()
export {game_room}
