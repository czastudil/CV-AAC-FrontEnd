// created using https://blog.logrocket.com/using-react-webcam-capture-display-images/

import Webcam from "react-webcam";
import { useCallback, useRef, useState } from 'react';

const CustomWebcam = ({ selectedImage, webcamCallback }) => {
    const webcamRef = useRef(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        webcamCallback(imageSrc);
    }, [webcamRef])

    return (
        <div>
            { selectedImage === null ?
            <div className="container">
                <Webcam width={'95%'} ref={webcamRef} />
                <div className="btn-container">
                    <button onClick={capture}>Capture photo</button>
                </div>
            </div>
            :
            null
            }
        </div>
    );
}

export default CustomWebcam;