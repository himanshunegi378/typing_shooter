import React, { Component } from 'react'
import { EventEmitter } from 'events';



interface IProps { }
interface IState { }

async function importGame(path: any)
{
    return await import(path)
}

export default class game_catalog extends Component<IProps, IState> {
    imported_game: Promise<any>;
    constructor(props: IProps)
    {
        super(props);
        this.imported_game = importGame('../../game_lib/text_based_game');
        this.imported_game.then((e:EventEmitter)=>{
        })
            
    }
    render()
    {
        return (
            <div>

            </div>
        )
    }
}
