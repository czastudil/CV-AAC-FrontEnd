import React from 'react';
import './Button.css'; 

import deleteButton from './assets/trash-bin.png'; // Delete icons created by Pixel perfect - Flaticon
import playButton from './assets/play-button.png'; // Play button icons created by Roundicons - Flaticon
import editButton from './assets/repairing-service.png'; // Gear icons created by Freepik - Flaticon

function Button({ buttonType }) {
    const [opacity, setOpacity] = React.useState("");
    const buttonStyles = {
        "opacity": opacity
    }

    const clearStyles = {
        backgroundColor: '#19bde0', 
        borderRadius: '50%',
        textAlign: 'center',
        color: 'white',
        verticalAlign: 'middle',
        display: 'table-cell',
        marginTop: 0,
        fontWeight: 'bolder',
        opacity: opacity
    }
    
    const handleOnMouseEnter = () => {
        setOpacity("50%");
    };

    const handleOnMouseLeave = () => {
        setOpacity("");
    };
    
    if (buttonType === "delete") {
        return (
            <div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave} style={ buttonStyles }>
                <img className='buttonImage' alt="Delete last word button" src={deleteButton} />
            </div>
        )
    } else if (buttonType === "clear") {
        return (
            <div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave} style={ clearStyles } className="buttonImage">
                clear
            </div>  
        )
    } else if (buttonType === "play") {
        return (
            <div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave} style={ buttonStyles }>
                <img className='buttonImage' alt="Sentence play button" src={playButton} />
            </div>
        )
    } else if (buttonType === "edit") {
        return (
            <div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave} style={ buttonStyles }>
                <img className='buttonImage' alt="Edit vocabulary button" src={editButton} />
            </div>
        )
    }
}

export default Button;