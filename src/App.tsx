import React from "react";
import "./App.css";
import Shooter from "./components/shooter_game/shooter";
import Practice from "./components/socket_practice/practice";
import Room_View from './components/room/room_view';
import 'bootstrap/dist/css/bootstrap.min.css'
import GameView from './components/game_view/game_view';
function App()
{
    return (
        <div className="App">
            <GameView />
            <Room_View />
        </div>
    );
}

export default App;
