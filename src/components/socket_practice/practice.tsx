import React, { Component } from "react";
import { transport } from "../../utils/axios_facade";
import { AxiosInstance } from "axios";
import { enemyShoot, event, shoot } from "../shooter_game/lib/shooter_gameCode";
import socket from "../../socket_logic";
import TextHighlighter from "../text_highlighter/text_highlighter";
import Color from "color";

interface IProps {}

interface IState {
  key_input?: string;
  text_input?: string;
  enemy_key?: string;
  char_input?: string; //character that player enters to after seeing the character client has to type after seeing the game_text
  current_joined_room?: string; //room to which player is currently joined
  roomName_input?: string; //name of the room that the user want to join
  game_text?: string; // text that user will type
  raw_game_text?: string;
  text_pos?: number; //letter to type in game_text
  game_over?: boolean; // tell if the match has ended or not
  highlight_color?: Color; // color to be used for highlighting the text
}

enum colors {
  rightColor = "#FFFF00",
  wrongColor = "#FF0000"
}

class Practice extends Component<IProps, IState> {
  private axios_instance!: AxiosInstance;
  private regexp!: RegExp;

  constructor(props: IProps) {
    super(props);
    this.state = {
      key_input: "",
      enemy_key: "",
      current_joined_room: "",
      roomName_input: "",
      game_text: "NA",
      char_input: "",
      text_pos: 0,
      game_over: false
    };
  }

  componentDidMount(): void {
    this.init();
    this.axios_instance = transport;
    this.regexp = new RegExp("^[a-zA-Z0-9 .]+$"); //to accept small and capital letter and numbers
  }

  /**
   * @description initialize the socket and define the socket event
   */
  init = () => {
    socket.on("enemy_key", (key: string) => {
      this.setState({ enemy_key: this.state.enemy_key?.concat(key) });
    });
    /**
     * @desc it receives a text that the user will type to compete
     */
    socket.on("game_text", (text: string) => {
      this.setState({ raw_game_text: text });
    });

    socket.on("shoot_order", function() {
      shoot();
    });
    socket.on("enemy_shoot_order", function() {
      enemyShoot();
    });
    socket.on("correct_char_input", (isCorrect: boolean) => {
      if (isCorrect) {
        this.setState({ highlight_color: Color(colors.rightColor) ,text_pos: (this.state.text_pos as number) + 1 });
      } else {
        this.setState({ highlight_color: Color(colors.wrongColor),text_pos: (this.state.text_pos as number) + 1  });
      }
    });

    ///////////////
    event().on("game_over", () => {
      // socket.emit("game_over", socket.id, this.state.current_joined_room);
      this.setState({ game_over: true });
    });
  };

  incrementPos = () => {
    this.setState({ text_pos: (this.state.text_pos as number) + 1 });
  };
  /**
   * @description If no room is joined than join the room with given name or if a room is already joined than leave that room and join the new room specified
   * @param roomName-string
   */
  joinRoom = (roomName: string) => {
    if (!this.isInRoom()) {
      socket.emit("subscribe", roomName);
      console.log(socket.id);
    } else {
      this.leaveRoom();
      socket.emit("subscribe", roomName);
      console.log(socket.id);
    }
    this.setState({ current_joined_room: roomName });
  };
  /**
   * @description Check if any room is joined by the client
   */
  private isInRoom = (): boolean => {
    return !!this.state.current_joined_room;
  };
  /**
   * @description leave the joined room if any
   */
  leaveRoom = () => {
    if (this.isInRoom()) {
      socket.emit("unsubscribe", this.state.current_joined_room);
      this.setState({ current_joined_room: "" });
    }
  };

  keyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log(event.key)
    if (this.regexp.test(event.key)) {
      socket.emit("key_res", event.key, "gang");
    }
  };
  /**
   * @description check if the character is valid char as defined by the regex
   * @param char_tocheck
   */
  isValidChar = (char_tocheck: string): boolean => {
    return this.regexp.test(char_tocheck);
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [event.currentTarget.name]: event.currentTarget.value });

    // console.log(event.currentTarget.value);
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log(this.state.name);
    // this.axios_instance.post('/savename', {name: this.state.name}).then(res => console.log(res))
    // this.socket.emit('send_msg', this.state.name)
  };

  roomName_submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(this.state.roomName_input);
    this.joinRoom(this.state.roomName_input as string);
  };

  sendCharToServer = (char: string) => {
    socket.emit("char_input", socket.id, this.state.current_joined_room, char);
  };

  /**
   * @description to be attached to the input which accept user entered letter  while playing game
   * @param event
   */
  onCharacterInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    //workaround to get the last char
    let entered_text: string = event.currentTarget.value;
    let lastChar = entered_text[entered_text.length - 1];
    if (this.isValidChar(lastChar)) {
      this.setState({ [event.currentTarget.name]: lastChar });
      if (this.isInRoom()) {
        this.sendCharToServer(lastChar);

      }
    }
  };

  restart = () => {
    socket.emit("restart", this.state.current_joined_room);
    this.setState({ text_pos: 0, game_over: false });
  };

  render() {
    return (
      <div>
        <TextHighlighter
          text={this.state.raw_game_text}
          index={this.state.text_pos! - 1}
          color={this.state.highlight_color}
        />
        <div>
          <form onSubmit={this.roomName_submit}>
            <label>Room name: </label>
            <input
              onChange={this.handleChange}
              name={"roomName_input"}
              type={"text"}
            />
            <input type={"submit"} value={"join"} />
          </form>
        </div>


        <div>
          {this.state.game_over === true ? (
            <input type="button" onClick={this.restart} value="restart" />
          ) : null}
        </div>

        <div>
          <input
            onChange={this.onCharacterInput}
            name={"char_input"}
            type={"text"}
            value={this.state.char_input}
          />
        </div>
        <div>
            <input type="button" onClick={()=>socket.emit('create_room','gang',socket.id)} value="join Room" />
        </div>
        <div>
            <input type="button" onClick={()=>socket.emit('leave_room','gang',socket.id)} value="leave Room" />
        </div>

      </div>
    );
  }
}

export default Practice;
