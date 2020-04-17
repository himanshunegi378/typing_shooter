import React, { Component } from "react";
import Color from "color";

interface IProps {
  text?: string;
  index?: number;
  color?: Color;
}

interface IState {
  text?: string;
  index?: number;
  tokenized_text?: JSX.Element[];
}

class TextHighlighter extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      text: "",
      index: -1,
      tokenized_text: []
    };
  }

  componentDidMount(): void {
    if (this.props.text) {
      this.setState({
        tokenized_text: TextHighlighter.text_to_token(this.props.text)
      });
    }
  }

  static getDerivedStateFromProps(props: IProps, state: IState) {
    let newState: IState;
    if (props.text) {
      //to check if text changed
      if (props.text !== state.text) {
        newState = {
          text: props.text,
          tokenized_text: TextHighlighter.text_to_token(props.text),
          index: -1
        };
        return newState;
      }
      //if text not changed
      else {
        //to check if index changed
        if (props.index !== state.index) {
          let newTokenizedText: JSX.Element[] = state.tokenized_text!;
          let char = props.text[props.index!];
          newTokenizedText[props.index!] = (
            <span key={props.index}
              style={{
                fontSize: "20px",
                backgroundColor: props.color!.toString()
              }}
            >
              {char}
            </span>
          );

          return { tokenized_text: newTokenizedText, index: props.index };
        }
      }
    }
  }

  static text_to_token = (text: string): JSX.Element[] => {
    if (!text) return [];

    let array_text: string[] | undefined = text.split("")!;
    let tokenized_text: JSX.Element[];
    tokenized_text = array_text.map((char,i) => {
      return <span key={i} style={{ fontSize: "20px" }}>{char}</span>;
    });

    return tokenized_text;
  };

  render() {
    return <div>{this.state.tokenized_text}</div>;
  }
}

export default TextHighlighter;
