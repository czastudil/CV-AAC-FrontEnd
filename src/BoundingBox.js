import React from 'react';
import './BoundingBox.css';

function BoundingBox({ deleteModeOn, role, submitCallback, itemNameCallback, deleteCallback, selectCallback, itemName, wizXOne, wizXTwo, wizYOne, wizYTwo }) {
    const [opacity, setOpacity] = React.useState("");
    const [backColor, setBackColor] = React.useState("");
    const userStyles = {
        "left": wizXOne+'px', 
        "top": wizYOne-20+'px', 
        "minWidth": (wizXTwo-wizXOne)+'px',
        "height": (wizYTwo-wizYOne+20)+'px',
        "opacity": opacity,
        "backgroundColor": backColor
    }

    const deleteBoxStyles = {
        left: wizXOne+'px', 
        top: wizYOne-20+'px', 
        minWidth: (wizXTwo-wizXOne)+'px',
        height: (wizYTwo-wizYOne+20)+'px',
        opacity: opacity
    }
    
    const handleOnMouseEnter = () => {
        setOpacity("50%");
        setBackColor("rgb(252, 8, 183)");
    };

    const handleOnMouseLeave = () => {
        setOpacity("");
        setBackColor("");
    };

    return (
        <div>
            { role === 'user' ?
                <div>
                    <div 
                    onClick={() => selectCallback(itemName)}
                    className='boundingBoxUserStyle' 
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
                    style={userStyles}>
                        <div className='textBoxStyle' > 
                            {itemName} 
                        </div>
                    </div>
                </div>
            :
                <div>
                    { itemName !== '' ? 
                        <div>
                            { deleteModeOn ?
                            <div>
                                <div 
                                onClick={() => deleteCallback(itemName)}
                                className='boundingBoxDeleteStyle' 
                                style={deleteBoxStyles}
                                onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
                                    <div className='textBoxDeleteStyle'> 
                                        {itemName} 
                                    </div>
                                </div>
                            </div>
                            :
                            <div>
                                <div 
                                className='boundingBoxWizardStyle' 
                                style={{
                                    left: wizXOne+'px', 
                                    top: wizYOne-20+'px', 
                                    minWidth: (wizXTwo-wizXOne)+'px',
                                    height: (wizYTwo-wizYOne+20)+'px'}}>
                                    <div className='textBoxStyle'> 
                                        {itemName} 
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    :
                    <form onSubmit={submitCallback}>
                        <div 
                        className='boundingBoxWizardStyle' 
                        style={{
                            left: wizXOne+'px', 
                            top: wizYOne-20+'px', 
                            minWidth: (wizXTwo-wizXOne)+'px',
                            height: (wizYTwo-wizYOne+20)+'px'}}>
                            <input 
                            type='text' 
                            className='textInputStyle' 
                            onChange={(e) => itemNameCallback(e)}/>
                            <input 
                            type='submit' 
                            className='submitStyle'/>
                        </div> 
                    </form>
                    }
                </div>
            }
        </div>
    )
}

export default BoundingBox;