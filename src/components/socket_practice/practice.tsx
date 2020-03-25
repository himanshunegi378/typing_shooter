import React, { Component } from "react";
import io from "socket.io-client";
import { transport } from "../../utils/axios_facade";
import { AxiosInstance } from "axios";
import { enemyShoot, shoot } from "../shooter_game/lib/shooter_gameCode";

interface IProps {}

interface IState {
  key_input?: string;
  text_input?: string;
  enemy_key?: string;
  char_input?: string; //character that player enters to after seeing the character client has to type after seeing the game_text
  current_joined_room?: string; //room to which player is currently joined
  roomName_input?: string; //name of the room that the user want to join
  game_text?: string; // text that user will type
  text_pos?: number; //letter to type in game_text
}

class Practice extends Component<IProps, IState> {
  private socket!: SocketIOClient.Socket;
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
      text_pos: 0
    };
  }

  componentDidMount(): void {
    this.init();
    this.axios_instance = transport;
    this.regexp = new RegExp("^[a-zA-Z0-9 ]+$"); //to accept small and capital letter and numbers
  }

  /**
   * @description initialize the socket and define the socket event
   */
  init = () => {
    this.socket = io.connect("http://192.168.0.6:8000");
    this.socket.on("enemy_key", (key: string) => {
      this.setState({ enemy_key: this.state.enemy_key?.concat(key) });
    });
    /**
     * @desc it receives a text that the user will type to compete
     */
    this.socket.on("game_text", (text: string) => {
      let newString: string = "";
      for (let i = 0; i < text.length; i++) {
        newString = newString.concat(`<span>${text.charAt(i)}</span>`);
      }
      document.getElementById("game_text")!.innerHTML = newString;
      this.setState({ game_text: newString });
    });

    this.socket.on("shoot_order", function() {
      shoot();
    });
    this.socket.on("enemy_shoot_order", function() {
      enemyShoot();
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
      this.socket.emit("subscribe", roomName);
      console.log(this.socket.id);
    } else {
      this.leaveRoom();
      this.socket.emit("subscribe", roomName);
      console.log(this.socket.id);
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
      this.socket.emit("unsubscribe", this.state.current_joined_room);
      this.setState({ current_joined_room: "" });
    }
  };

  keyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log(event.key)
    if (this.regexp.test(event.key)) {
      this.socket.emit("key_res", event.key, "gang");
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
    this.socket.emit(
      "char_input",
      this.socket.id,
      this.state.current_joined_room,
      char
    );
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
        let game_text_span = document.getElementById("game_text");
        let letters = game_text_span!.getElementsByTagName("span");
        for (let i = 0; i < letters.length; i++) {
          if (this.state.text_pos === i) {
            let singleLettter = letters[i].innerText;
            letters[i].style.backgroundColor = '#FFFF00'
            letters[i].innerHTML = `${singleLettter}`;
          }
        }
        this.incrementPos();
      }
    }
  };

  render() {
    return (
      <div>
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

        <div
          style={{ fontSize: "20px", fontWeight: "bold" }}
          id={"game_text"}
        ></div>

        <div>
          <input
            onChange={this.onCharacterInput}
            name={"char_input"}
            type={"text"}
            value={this.state.char_input}
          />
        </div>
      </div>
    );
  }
}

export default Practice;
