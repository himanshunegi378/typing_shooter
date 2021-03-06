import React, { Component } from "react";
import "./style.css";
// @ts-ignore
import { init } from "./lib/shooter_gameCode";
// @ts-ignore
import { e } from "../../game_lib/shooter_gameCode";
import { game_room } from "../../server/GameRoom";

export class Shooter extends Component
{


    componentDidMount(): void
    {
        const canvas = document.getElementById("canvas");

        // @ts-ignore
        const ctx = canvas.getContext("2d");
        // ctx.fillStyle = 'red';
        // ctx.fillRect(0, 0,20, 40);
        let block = document.getElementById('canvas_block');
        // @ts-ignore
        block.onload = () =>
        {
            console.log('game started');
        }
        //@ts-ignore
        game_room.changeGame(e)
       


    }


    render()
    {
        return (
            <>
                <link rel="stylesheet" href="./style.css" />
                <div id='canvas_block'>
                    <canvas id="canvas" tabIndex={0} />
                </div>
                {/*<script src="./lib/shooter_gameCode.js"></script>*/}

            </>
        );
    }
}

export default Shooter;
