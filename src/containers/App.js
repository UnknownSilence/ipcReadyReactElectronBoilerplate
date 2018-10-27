import React, { Component } from "react";
import { ipcRenderer } from "electron";

import "../assets/css/App.css";

import HelloWorld from "../components/App/HelloWorld";

import {
  FETCH_TEXT_FROM_STORAGE,
  SAVE_TEXT_IN_STORAGE,
  HANDLE_FETCH_TEXT_FROM_STORAGE,
  HANDLE_SAVE_TEXT_IN_STORAGE
} from "../../utils/constants";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textboxValue: "",
      responseValue: ""
    };

    this.onTextboxChange = this.onTextboxChange.bind(this);
    this.loadSaveText = this.loadSaveText.bind(this);
    this.handleFetchText = this.handleFetchText.bind(this);
    this.saveText = this.saveText.bind(this);
    this.handleSaveText = this.handleSaveText.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on(HANDLE_FETCH_TEXT_FROM_STORAGE, this.handleFetchText);

    ipcRenderer.on(HANDLE_SAVE_TEXT_IN_STORAGE, this.handleSaveText);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(
      HANDLE_FETCH_TEXT_FROM_STORAGE,
      this.handleFetchText
    );

    ipcRenderer.removeListener(
      HANDLE_SAVE_TEXT_IN_STORAGE,
      this.handleSaveText
    );
  }

  handleSaveText(event, data) {
    console.log("handleSaveText", data);

    this.setState({
      textboxValue: ""
    });

    this.loadSaveText();
  }

  handleFetchText(event, data) {
    console.log("handleFetchText", data);
    const { text } = data;

    // ^ same as   const text = data.text

    this.setState({
      responseValue: text
    });
  }

  onTextboxChange(event) {
    const { value } = event.target;

    this.setState({
      textboxValue: value
    });
  }

  loadSaveText() {
    console.log("loadSaveText");
    ipcRenderer.send(FETCH_TEXT_FROM_STORAGE, "ping");
  }

  saveText() {
    console.log("saveText");

    const { textboxValue } = this.state;

    ipcRenderer.send(SAVE_TEXT_IN_STORAGE, textboxValue);
  }

  render() {
    const { textboxValue, responseValue } = this.state;

    return (
      <div>
        <div>
          <button onClick={this.loadSaveText}>Load Save Text</button>
          <p>{responseValue}</p>
        </div>
        <div>
          <input
            type="text"
            value={textboxValue}
            onChange={this.onTextboxChange}
          />
          <button onClick={this.saveText}>Save Text</button>
        </div>
        <HelloWorld />
      </div>
    );
  }
}

export default App;
