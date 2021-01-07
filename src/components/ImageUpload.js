import React, {useState} from 'react';
import {Button} from "@material-ui/core";
import {storage, db} from "../firebase";
import firebase from "firebase";
import './ImageUpload.css';

const ImageUpload = ({username}) => {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState('');
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    };

    const handleUpload = (e) => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) => {
                alert(error.message)
            },
            () => {
                storage.ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url =>{
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null)
                });
            }
        )
    };

    return (
        <div className="upload-wrapper">
            <div className="img-upload">
                <h3 className="img-upload-header">Upload Image</h3>
                <progress value={progress} max="100"/>
                <input type="text" placeholder="Enter a caption..."
                       onChange={event => setCaption(event.target.value)}
                       value={caption}
                       className="custom-caption-input"/>
                <input className="custom-file-input" type="file" onChange={handleChange}/>
                <Button className="image-uploadButton"
                        onClick={handleUpload}>
                    Upload
                </Button>
            </div>
        </div>
    );
};

export default ImageUpload;