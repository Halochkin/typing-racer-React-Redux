import logo from './logo.svg';
import './App.css';

import React, {Component} from 'react';
import ReactShadowRoot from 'react-shadow-root';


import {connect} from "react-redux"
import {handleInputEvent, getAllSessions} from "./Reducers/actions";




class App extends Component {
  constructor(props) {
    super(props);
    console.log(props.state)
  }

  // componentDidMount() {
  //  console.log("did mount")
  // }

  style = `
  * {
    font-size: 20px;
}

.current {
    text-decoration: underline;
}

.err {
    background-color: rgba(255, 0, 0, 0.8);
    border-radius: 5px;
}

#done {
    color: forestgreen;
}

#result {
    border: 0.5px solid black;
}

#main-result {
    background-color: khaki;
    text-align: center;
    display: block;
    height: 2em;
    float: right;
    width: 13vw;
    line-height: 4vh;
    font-size: 82%;
    border-radius: 3px;
    padding: 3px;
}

textarea {
    width: 73vw;
    height: auto;
    resize: none;
    margin: 1vw;
}

#expected {
    background-color: rgba(0, 128, 6, 0.29);
    border-radius: 5px;
    font-size: 25px;

    background-image: url(data:image/gif;base64,R0lGODlhAQAoAPABAERmZv///yH5BAg1AAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAAQAoAAACBYSPqctYACH5BAg1AAAALAAAAAABACgAgP///////wIFhI+py1gAOw==);
    background-repeat: repeat-y;
}

#main-input {
    width: 77vw;
    padding: 3px;
    margin-left: 3vw;
}

.previous-speed {
    font-size: 1em;
    display: block;
    margin: -1vw -1vw 1vw -1vw;
    padding: 0.2vw;
}

.prev-wrapper {
    background-color: white;
    padding: 1vw;
    margin: 1vw;
    width: 85vw;
    box-shadow: 0px 0px 4px 0px #be9f9f;
    border-radius: 0 0 5px 5px;
    overflow: hidden;
}

#string-field {
    background-color: lightyellow;
    border-radius: 5px;
    padding: 1vw;
    margin-left: 3vw;
    width: 85vw;
    border: 1px solid gray;
    box-shadow: inset 0px 0px 2px 0px #b1adad;
}

#previous-results {
    overflow-y: scroll;
    padding: 2vw;
    height: 46vh;
    overflow-x: hidden;
}

#main-input {
    margin-left: 3vw;
    width: 75vw;
}

.prev-wrapper:first-child {
    margin-top: -2vw;
}

#app {
    padding: 3vw;

}

.close-btn {
    float: left;
    font-size: 1em;
    color: red;
    margin: 1.3em 10px 10px;
    background-color: #2a272700;
    width: 1.3em;
    text-align: center;
    height: 1.3em;
    border-radius: 50%;
    font-family: cursive;
    cursor: pointer;
    box-shadow: inset 0 0 2px 0px #131212;

}

.repeat-btn {
    color: #4CAF50;
    font-family: cursive;
    cursor: pointer;
    float: left;
    margin: 10px;
    margin-top: 1.3em;
    box-shadow: inset 0 0 2px 0px #131212;
    width: 1.3em;
    text-align: center;
    line-height: 1.2em;
    height: 1.3em;
    border-radius: 50%;
    font-size: 1em;
    text-shadow: 0px 0px 0px black;
}
  `


  handleInput = (e) => {
    // e.preventDefault();
    if (e.key.length > 1 && e.key !== "Backspace") return;
    this.props.handleInputEvent(e);
  }

  componentDidMount() {
 let data = this.props.getAllSessions();
 console.log(data)
  }

  render() {
    return (
      <type-racer>
        <ReactShadowRoot>
          <div>
          <style>{this.style}</style>
          <link rel="stylesheet" href="./shadow-style.css"/>
          <div id="app">
            <div id="previous-results"/>
            <br/>
            <div id="string-field">
              <span id="done">{this.props.state.typedWords && this.props.state.typedWords.join("") || ""}</span>
              <span className="current" id="typed">{this.props.state.typedCharacters}</span>
              <span className="current" id="expected">{this.props.state.expectedCharacter}</span>
              <span className="current" id="remains">{this.props.state.remainedCharacters}</span>
              <span id="tail">{this.props.state.remainedWords}</span>
            </div>
            <br/>
            <input id="main-input" onKeyDown={this.handleInput} aria-selected="false" type="text"/>
            <span id="main-result">{this.props.state.sessionResult || ""}</span>
          </div>
          </div>
        </ReactShadowRoot>
      </type-racer>
    );
  }
}


function mapStateToProps(state) {
  return {
    state: state.getImmutableState
  }
}

const mapDispatchToProps = {
  handleInputEvent,
  getAllSessions
}

export default connect(mapStateToProps, mapDispatchToProps)(App);  //set state to App!
