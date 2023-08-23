import React from 'react';
import BoundingBox from './BoundingBox';
import './WizardInterface.css';

function WizardInterface( {selectedImage, boundingBoxes, mousePosWizOne, 
    mousePosWizTwo, itemSubmitted, itemNameCallback, deleteCallback, deleteModeOn,
    submitCallback, itemName, renderBoundingBoxButtonCallback, renderUploadPhotoButtonCallback,
    renderDeleteModeButtonCallback, changeRolesCallback, boundingBoxModeOn, wizClickCallback,
    mainImageWidth} ) {

    function arrayToWizardBoundingBoxes(fullArray, index) {
        return (
          <div>
          {fullArray.map(item =>
            <BoundingBox 
              role='wizard'
              deleteModeOn={deleteModeOn}
              deleteCallback = {deleteCallback}
              key={index+''+Math.random()}
              itemName={item.itemName}
              wizXOne={item.mousePosWizOne.x} 
              wizXTwo={item.mousePosWizTwo.x} 
              wizYOne={item.mousePosWizOne.y} 
              wizYTwo={item.mousePosWizTwo.y}/>)}
            </div>
        )
    }

    if(boundingBoxModeOn) {
        wizClickCallback();
      } 

    return (
        <div>
            <div>
                <div>
                {selectedImage === null ?
                  <div className='noImageWizard' style={{width: mainImageWidth+"px" }} id="main image">
                    <p className='noImageTxt'>No Image Found</p>
                  </div>
                  :
                  <div>
                    <img
                      alt="not found"
                      className='wizardImage'
                      id="main image"
                      style={{width: mainImageWidth+"px" }}
                      src={selectedImage}
                    />
                  </div>
                }
                  {arrayToWizardBoundingBoxes(boundingBoxes)}
                  {mousePosWizOne.x !== -1 && mousePosWizTwo.x !== -1 ? 
                  <div>
                      { itemSubmitted === false ? 
                        <BoundingBox 
                        submitCallback={submitCallback}
                        itemNameCallback={itemNameCallback}
                        itemName=''
                        wizXOne={mousePosWizOne.x} 
                        wizXTwo={mousePosWizTwo.x} 
                        wizYOne={mousePosWizOne.y} 
                        wizYTwo={mousePosWizTwo.y} />
                        :
                        <BoundingBox 
                        deleteModeOn={deleteModeOn}
                        itemName={itemName}
                        wizXOne={mousePosWizOne.x} 
                        wizXTwo={mousePosWizTwo.x} 
                        wizYOne={mousePosWizOne.y} 
                        wizYTwo={mousePosWizTwo.y} />
                        }
                    </div>
                  : null }
                </div>
              </div>
              <div style={ {display: 'flex' } }>
                <p style={ {marginRight: '10px'} }>You are in wizard mode</p>
                {renderBoundingBoxButtonCallback()}
                {renderDeleteModeButtonCallback()}
                {renderUploadPhotoButtonCallback()}
            </div>
        </div>
    )
}

export default WizardInterface;