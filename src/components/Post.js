import React, {useEffect, useState} from 'react';
import postImg1 from '../img/ART.PNG'
import './Post.css'
import Avatar from "@material-ui/core/Avatar";
import {auth, db} from "../firebase";
import firebase from "firebase";

const Post = ({username, caption, imageUrl, postId, user}) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection("posts")
                .doc(postId).collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                })
        }
        ;

        return () => {
            unsubscribe();
        }
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts")
            .doc(postId).collection("comments")
            .add({
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        setComment('')
    }

    return (
        <div className="post">
            <div className="post-header">
                <Avatar className="post-avatar" alt='user'
                        src={imageUrl}/>
                <h3>{username}</h3>
            </div>

            <img src={imageUrl} alt="post"
                 className="post-img"/>
            {/*image*/}
            <h4 className="post-text"><strong>{username}</strong>{"  "}{caption}</h4>
            {/*user cap*/}
            <div className="post-comments">
                {comments.map((comment)=>(
                    <p>
                        <b>{comment.username}</b>  {comment.text}
                    </p>
                ))}
            </div>
            <form className="post-commentBox">
                <input type="text" className="post-input"
                       placeholder="Adda a comment..."
                       value={comment}
                       onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit" className="post-button"
                        disabled={!comment}
                        onClick={postComment}
                >
                    Post
                </button>
            </form>
        </div>
    );
};

export default Post;