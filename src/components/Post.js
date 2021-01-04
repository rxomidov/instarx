import React from 'react';
import postImg1 from '../img/ART.PNG'
import './Post.css'
import Avatar from "@material-ui/core/Avatar";

const Post = ({username, caption, imageUrl}) => {
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
            <h4 className="post-text"><strong>Username</strong>{"  "}{caption}</h4>
            {/*user cap*/}
        </div>
    );
};

export default Post;