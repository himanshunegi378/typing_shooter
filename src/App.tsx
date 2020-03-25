import React from "react";
import "./App.css";
import Shooter from "./components/shooter_game/shooter";
import Practice from "./components/socket_practice/practice";

function App() {
    return (
        <div className="App">
            <Shooter/>
            <Practice/>
        </div>
    );
}

export default App;
