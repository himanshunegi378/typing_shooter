import React, { Component } from 'react'
import { server_instance } from '../../server';
import Shooter from '../shooter_game/shooter';
//@ts-ignore
import { e } from '../../game_lib/shooter_gameCode';
import { game_room } from '../../server/GameRoom';
import { EventEmitter } from 'events';
import { attach_room_event } from '../../server/socket_endpoint';

interface IProps { }
interface IState
{
    tobe_created_room_name?: string // room name entered by the user for room creation or room joining
    tobe_joined_room_name?: string //
}

export class Room_View extends Component<IProps, IState> {
    private room_event: EventEmitter;
    constructor(props: IProps)
    {
        super(props);
        this.state = {}
        this.room_event = new EventEmitter();
        attach_room_event(this.room_event);

    }

    componentDidMount(){
        //@ts-ignore
     
    }

    join_room = (event: React.FormEvent<HTMLFormElement>) =>
    {
        event.preventDefault()
        if (this.state.tobe_joined_room_name)
        {
            console.log(this.state.tobe_joined_room_name)
            // game_room.join_room(this.state.tobe_joined_room_name)
            this.room_event.emit('join_room',this.state.tobe_joined_room_name)
            this.setState({ tobe_joined_room_name: '' })
        }
    }
    leave_room = (roomName: string) => { server_instance.room.leave_room() }
    
    create_room = (event: React.FormEvent<HTMLFormElement>) =>
    {
        event.preventDefault()
        if (this.state.tobe_created_room_name)
        {
            console.log(this.state.tobe_created_room_name)
            // game_room.create_room(this.state.tobe_created_room_name)
            this.room_event.emit('create_room',this.state.tobe_created_room_name)
            this.setState({ tobe_created_room_name: '' })
        }
    }
    destroy_room = (roomName: string) => { server_instance.room.destroy_room() }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        this.setState({ [event.currentTarget.name]: event.currentTarget.value });

    };

    render()
    {
        return (
            <div>
                <form onSubmit={this.create_room}>
                    <b>Create Room</b>
                    <div>
                        <label>Name: </label>
                        <input name={'tobe_created_room_name'} onChange={this.handleChange} type={'text'} value={this.state.tobe_created_room_name} />
                        <button type='submit'>create</button>
                    </div>
                </form>
                <form onSubmit={this.join_room}>
                    <b>Join Room</b>
                    <div>
                        <label>Name: </label>
                        <input name={'tobe_joined_room_name'} onChange={this.handleChange} type={'text'} value={this.state.tobe_joined_room_name} />
                        <button>join</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Room_View;
