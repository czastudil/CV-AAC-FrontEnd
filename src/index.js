import { render } from 'react-dom';
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import './index.css'
import UserInterface from './UserInterface';
import WizardInterface from './WizardInterface';

//const client = new W3CWebSocket('ws://localhost:8000'); // For local testing
const client = new W3CWebSocket('wss://salty-reef-90891-f0f8e22a6219.herokuapp.com/');
export default class App extends Component {

  state ={
    mode: '',
    boundingBoxes: [],
    itemName: '',
    itemSubmitted: false,
    mousePosWizOne: { x: -1, y: -1 },
    mousePosWizTwo: { x: -1, y: -1 },
    wizClicks: 0,
    selectedItem: '',
    deleteModeOn: false,
    selectedImage: null,
    boundingBoxModeOn: false,
    mainImageWidth: 500
  }

  handleWizMousePosition = (event) => {
    if(this.state.wizClicks === 0) {
      this.setState( { mousePosWizOne: { x: event.clientX, y: event.clientY }, wizClicks: 1 });

    } else if(this.state.wizClicks === 1) {
      this.setState( { mousePosWizTwo: { x: event.clientX, y: event.clientY }, wizClicks: 2 } );
    } 
  };

  handleWizClick = () => {
    var mainImage = document.getElementById('main image');

    mainImage.addEventListener('mousedown', this.handleWizMousePosition);

    return () => {
        mainImage.removeEventListener(
        'mousedown',
        this.handleWizMousePosition
        );
    };
  }

  handleRemoveBoundingBox = (itemName) => {

    function removeObjectByItemName(item) {
      if (item.itemName !== itemName) {
        return item;
      }
    }

    this.setState({ boundingBoxes: this.state.boundingBoxes.filter((item) => removeObjectByItemName(item))});

    client.send(JSON.stringify({
      type: "removeBoundingBox",
      boundingBoxes: this.state.boundingBoxes.filter((item) => removeObjectByItemName(item))
    }));
  }

  handleSubmit = (e) => {
    this.setState( { 
      itemSubmitted: true,
      boundingBoxes: this.state.boundingBoxes.concat({ 
        itemName: this.state.itemName,
        mousePosWizOne: this.state.mousePosWizOne,
        mousePosWizTwo: this.state.mousePosWizTwo
      }) });

    client.send(JSON.stringify({
      type: "submission",
      boundingBoxes: this.state.boundingBoxes.concat({ 
        itemName: this.state.itemName,
        mousePosWizOne: this.state.mousePosWizOne,
        mousePosWizTwo: this.state.mousePosWizTwo
      })
    }));

    this.setState({
      itemName: '',
      mousePosWizOne: { x: -1, y: -1 },
      mousePosWizTwo: { x: -1, y: -1 },
      wizClicks: 0,
      itemSubmitted: false
    })
  }

  handleObjectSelection = (itemName) => {
    this.setState({ selectedItem: itemName.toLowerCase() })
  }

  handleFileSelection = (event) => {
    var file = event.target.files[0];
    //console.log(file);
    const reader = new FileReader();
  
    reader.onloadend = () => {
      // Convert the image file to base64-encoded string
      const base64Image = reader.result;
      this.setState({ selectedImage: base64Image, boundingBoxes: [] });
  
      // Split the base64 string into chunks
      const chunkSize = 65000; // if the websocket connection is closing reduce the chunk size
      const totalChunks = Math.ceil(base64Image.length / chunkSize);
  
      // Send each chunk to the server
      for (let i = 0; i < totalChunks; i++) {
        const chunk = base64Image.substr(i * chunkSize, chunkSize);
        client.send(JSON.stringify({
          type: "file chunk",
          chunk,
          chunkIndex: i,
          totalChunks
        }));
      }
    };
  
    reader.readAsDataURL(file);
    console.log('image uploaded');
  };

  transmitUserImageWidth = (userImageWidth) => {
    client.send(JSON.stringify({
      type: "mainImageWidth",
      mainImageWidth: userImageWidth,
      boundingBoxes: []
    }));
    this.setState({ 
      mainImageWidth: userImageWidth,
      boundingBoxes: []
    })
  }

  renderUploadPhotoButton = () => {
    return (
      <button>
        <label onChange={(event) => this.handleFileSelection(event)} htmlFor='fileUpload'>
          <input
            type="file"
            id='fileUpload'
            hidden
          />
          Upload Photo
        </label>
      </button>
    )
  }

  renderBoundingBoxButton = () => {
    if(this.state.boundingBoxModeOn) {
      return <button onClick={() => this.setState({ boundingBoxModeOn: false })}>Stop Adding Bounding Boxes</button>
    } else if(this.state.selectedImage !== null) {
      return <button onClick={() => this.setState({ boundingBoxModeOn: true, deleteModeOn: false })}>Add a Bounding Box</button>
    }
  }

  renderDeleteModeButton = () => {
    if(this.state.deleteModeOn) {
      return <button onClick={() => this.setState({ deleteModeOn: false })}>Exit Deletion Mode</button>
    } else {
      return (
        <div>
          { this.state.boundingBoxes.length > 0 ?
            <button onClick={() => this.setState({ deleteModeOn: true, boundingBoxModeOn: false })}>Delete a Bounding Box</button>
            :
            null
          }
        </div>
      )
    }
  }

  renderMode = () => {
    if(this.state.mode === 'wizard') {
      return (
        <WizardInterface 
          selectedImage={this.state.selectedImage}
          boundingBoxes={this.state.boundingBoxes}
          mousePosWizOne={this.state.mousePosWizOne}
          mousePosWizTwo={this.state.mousePosWizTwo}
          itemSubmitted={this.state.itemSubmitted}
          itemNameCallback={(e) => this.setState({ itemName: e.target.value })}
          deleteCallback = {this.handleRemoveBoundingBox}
          deleteModeOn={this.state.deleteModeOn}
          submitCallback={this.handleSubmit}
          itemName={this.state.itemName}
          renderBoundingBoxButtonCallback={this.renderBoundingBoxButton}
          renderUploadPhotoButtonCallback={this.renderUploadPhotoButton}
          renderDeleteModeButtonCallback={this.renderDeleteModeButton}
          boundingBoxModeOn={this.state.boundingBoxModeOn}
          wizClickCallback={this.handleWizClick}
          mainImageWidth={this.state.mainImageWidth}/>
      )
    } else {
      return (
        <UserInterface 
          selectedImage={this.state.selectedImage}
          boundingBoxes={this.state.boundingBoxes}
          renderUploadPhotoButtonCallback={this.renderUploadPhotoButton}
          selectCallback={this.handleObjectSelection}
          selectedItem={this.state.selectedItem}
          mode={this.state.mode}
          mainImageWidth={this.state.mainImageWidth}/>
      )
    } 
  }

  componentDidMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    var receivedChunks = [];
    client.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);
        if (dataFromServer.type === "removeBoundingBox") {
          console.log('got reply! ', dataFromServer);
          this.setState({ 
            boundingBoxes: dataFromServer.boundingBoxes })
        } else if (dataFromServer.type === "submission") {
          console.log('got reply! ', dataFromServer);
          this.setState({ 
            boundingBoxes: dataFromServer.boundingBoxes })
        } else if (dataFromServer.type === "file chunk") {
          const { chunk, chunkIndex, totalChunks } = dataFromServer;
      
          // Store the received chunk
          receivedChunks[chunkIndex] = chunk;

          // Check if all chunks have been received
          if (receivedChunks.length === totalChunks) {
            console.log('Received all image chunks');
            // Concatenate the chunks to reconstruct the base64 image
            const base64Image = receivedChunks.join('');

            // Handle the complete base64 image here
            this.setState({ 
              selectedImage: base64Image,
              boundingBoxes: [] })

            // Clear the received chunks array for future use
            receivedChunks = [];
          }
        } else if (dataFromServer.type === "mainImageWidth") {
          console.log('got reply! ', dataFromServer);
          this.setState({ 
            mainImageWidth: dataFromServer.mainImageWidth,
            boundingBoxes: dataFromServer.boundingBoxes })
        } else if (dataFromServer.type === "client disconnected") {
          console.log('got reply! ', dataFromServer);
          this.setState({
            boundingBoxes: [],
            itemName: '',
            itemSubmitted: false,
            mousePosWizOne: { x: -1, y: -1 },
            mousePosWizTwo: { x: -1, y: -1 },
            wizClicks: 0,
            selectedItem: '',
            deleteModeOn: false,
            selectedImage: null,
            boundingBoxModeOn: false,
            mainImageWidth: 500 })
        }
    };
    client.onerror = (error) => {
      console.error('WebSocket Error:', error);
      // TODO: Handle the error or attempt to reconnect
    };
    
    client.onclose = () => {
      console.log('WebSocket Connection Closed');
      // TODO: Handle the connection close event and attempt to reconnect
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.boundingBoxModeOn !== this.state.boundingBoxModeOn && this.state.boundingBoxModeOn === false) {
      document.getElementById('main image').removeEventListener('mousedown', this.handleWizMousePosition);
    } 

    const mainImage = document.getElementById('main image');

    if(this.state.mode !== 'wizard'
      && this.state.mode !== ''
      && mainImage
      && this.state.mainImageWidth !== mainImage.clientWidth) {
        this.transmitUserImageWidth(mainImage.clientWidth);
    }
  }

  render() {
    return (
      <div>
        { this.state.mode === '' ?
          <div style={{width: "500px"}}>
            <h1>Available Modes:</h1>
            <button onClick={() => this.setState({ mode: 'training' })}>Training User</button>
            <button onClick={() => this.setState({ mode: 'beginner' })}>Beginner User</button>
            <button onClick={() => this.setState({ mode: 'intermediate' })}>Intermediate User</button>
            <button onClick={() => this.setState({ mode: 'wizard' })}>Wizard</button>
          </div>
        :
        <div>
          {this.renderMode()}
        </div>
      }
      </div>
    )
  }
}

const root = document.getElementById('root');
render(<App />, root);