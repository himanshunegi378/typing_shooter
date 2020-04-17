import React, { Component } from 'react'
import Room_View from '../room/room_view'
import Shooter from '../shooter_game/shooter'
// @ts-ignore
import { e } from "../../game_lib/shooter_gameCode";
import { game_room } from "../../server/GameRoom";
export default class GameView extends Component
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
        //@ts-ignore
        e.emit('new_game', canvas, ctx)



    }


    render()
    {
        return (
            <>
                <link rel="stylesheet" href="./style.css" />
                <div id='canvas_block'>
                    <canvas id="canvas" style={{
                        margin: 'auto',
                        display: 'block',
                        backgroundColor: "#070719"
                    }} tabIndex={0} />
                </div>

            </>
        );
    }
}
