import React from 'react';
import BoundingBox from './BoundingBox';
import VocabBoard from './VocabBoard';
import "./UserInterface.css"

function UserInterface( { selectedImage, boundingBoxes, renderUploadPhotoButtonCallback, 
    selectCallback, selectedItem, mode, mainImageWidth }) {

    const msg = new SpeechSynthesisUtterance();

    function handlePlay(word) {
        msg.text = word;
        window.speechSynthesis.speak(msg);
    }

    const imageContainer = document.getElementById('image container');

    function setImageSize() {
        return {maxWidth: imageContainer.clientWidth-10, 
                maxHeight: window.innerHeight*0.8}
    }
    
    function arrayToUserBoundingBoxesTraining(fullArray, index) {
        return (
            <div>
            {fullArray.map(item =>
            <BoundingBox 
                key={index+''+Math.random()}
                role='user'
                selectCallback={handlePlay}
                itemName={item.itemName}
                wizXOne={item.mousePosWizOne.x} 
                wizXTwo={item.mousePosWizTwo.x} 
                wizYOne={item.mousePosWizOne.y} 
                wizYTwo={item.mousePosWizTwo.y}/>)}
            </div>
        )
    }

    function arrayToUserBoundingBoxes(fullArray, index) {
        return (
            <div>
            {fullArray.map(item =>
            <BoundingBox 
                key={index+''+Math.random()}
                role='user'
                selectCallback={selectCallback}
                itemName={item.itemName}
                wizXOne={item.mousePosWizOne.x} 
                wizXTwo={item.mousePosWizTwo.x} 
                wizYOne={item.mousePosWizOne.y} 
                wizYTwo={item.mousePosWizTwo.y}/>)}
            </div>
            )
        }

    if(mode === 'training') {
        return (
            <div className='userContainer'>
                <div id='image container' style={{ flex: 1}}>
                    { selectedImage === null ?
                    <div className='noImage'>
                        <p className='noImageTxt'>No Image Found</p>
                    </div>
                    :
                        <img
                        alt="not found"
                        id='main image'
                        style={setImageSize()}
                        src={selectedImage}
                        />
                    }
                    <div>
                        {arrayToUserBoundingBoxesTraining(boundingBoxes)}
                    </div>
                    <p style={ {marginRight: '10px'} }>You are in Training User mode</p>
                </div>
            </div>
        );
    } else if(mode === 'beginner') {
        return (
            <div className='userContainer'>
                <div id='image container' style={{ flex: 1}}>
                    { selectedImage === null ?
                    <div className='noImage'>
                        <p className='noImageTxt'>No Image Found</p>
                    </div>
                    :
                        <img
                        alt="not found"
                        id='main image'
                        style={setImageSize()}
                        src={selectedImage}
                        />
                    }
                    <VocabBoard 
                    selectedItem={selectedItem}
                    mode={mode}
                    mainImageWidth={mainImageWidth}/>
                    <div>
                        {arrayToUserBoundingBoxes(boundingBoxes)}
                    </div>
                    <p style={ {marginRight: '10px'} }>You are in Beginner User mode</p>
                </div>
            </div>
        );
    } else if(mode === 'intermediate') {
        return (
            <div className='userContainer'>
                <div id='image container' style={{ flex: 1}}>
                    { selectedImage === null ?
                    <div className='noImage'>
                        <p className='noImageTxt'>No Image Found</p>
                    </div>
                    :
                    <img
                    alt="not found"
                    id='main image'
                    style={setImageSize()}
                    src={selectedImage}
                    />
                    }
                    {arrayToUserBoundingBoxes(boundingBoxes)}
                    <div style={{ display: 'flex', flexFlow: 'row'}}>
                        <p style={ {marginRight: '10px'} }>You are in Intermediate User mode</p>
                        {renderUploadPhotoButtonCallback()}
                    </div>
                </div>
                <VocabBoard 
                selectedItem={selectedItem}
                mode={mode}/>
            </div>
        );
    }
}

export default UserInterface;