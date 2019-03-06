import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import recognizeMic from 'watson-speech/speech-to-text/recognize-microphone';

class App extends Component {
  constructor(){
    super();
    this.state = {
      searchText: 'this is a test',
      text: '',
      stream: null
    };

  }

  onStopClick() {
    this.state.stream.stop()//stream.stop.bind(stream);
    this.setState({
      text: ''
    });

    alert('RESET');
  }

  onClickButton(){
    console.log('handling a click (new access token parameter)');

    fetch('http://localhost:3002/api/speech-to-text/token')
      .then((response) =>{
        return response.text();
      })
      .then((token) => {

      console.log('GOT A TOKEN');
      console.log(token)
      var stream = recognizeMic({
          access_token: token,
          objectMode: true, // send objects instead of text
          extractResults: true, // convert {results: [{alternatives:[...]}], result_index: 0} to {alternatives: [...], index: 0}
          format: false // optional - performs basic formatting on the results such as capitals an periods
      });

      /**
       * Prints the users speech to the console
       * and assigns the text to the state.
       */
      stream.on('data',(data) => {
        //console.log(data);
        this.setState({
          text: data.alternatives[0].transcript
        })
        
        console.log("CURRENT TEXT <incoming>: ", JSON.stringify(this.state.text, null, 2));
        console.log("CURRENT TEXT <testing>: ", JSON.stringify(this.state.searchText, null, 2));

        if (this.state.text.trim() === this.state.searchText) {
          alert('GOT IT');
          console.log("GOT IT")
        }

        // console.log(data.alternatives[0].transcript)
      });
      stream.on('error', function(err) {
          console.log(err);
      });

      this.setState({
        stream: stream
      })

      //document.querySelector('#stop').onclick = stream.stop.bind(stream);
    }).catch(function(error) {
        console.log(error);
    });
  };
    render() {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <button id="button" onClick={this.onClickButton.bind(this)}>Listen To Microphone</button> 
          <button id="stop" onClick={this.onStopClick.bind(this)}>STOP</button> 
          <div>{this.state.searchText}</div>
        <div className="App-Text">{this.state.text}</div> 
        <div>hot reload is working</div>
        </div>
      );
    }
}

export default App;
