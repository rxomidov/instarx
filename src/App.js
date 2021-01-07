import './App.css';
import React, {useEffect, useState} from "react";
import logo from './img/shirt_00000.png'
import user from './img/user.jpg'
import user2 from './img/user2.PNG'
import user3 from './img/user3.PNG'
import Post from "./components/Post";
import {db, auth} from "./firebase";
import {makeStyles, Modal, Button, Input} from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate( -${top}%, -${left}%)`,
    }
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 300,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid black',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
    }
}))

function App() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle)

    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log(authUser);
                setUser(authUser);

                if (authUser.displayName) {

                } else {
                    return authUser.updateProfile({
                        displayName: username,
                    })
                }
            } else {
                setUser(null);
            }
        });

        return () => {
            unsubscribe();
        }
    }, [user, username]);

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })));
        })
    }, []);

    const signUp = (event) => {
        event.preventDefault();

        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: username
                })
            })
            .catch((error) => alert(error.message));
    };

    const signIn = (event) => {
        event.preventDefault();

        auth.signInWithEmailAndPassword(email, password)

            .catch((error) => alert(error.message));

        setOpenSignIn(false);
    };

    return (
        <div className="app">
            <Modal open={open}
                   onClose={() => setOpen(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <form className="app-signup">
                        <center>
                            <img src={logo} alt="logo"
                                 className="app-headerImg"/>
                        </center>
                        <Input type='text'
                               placeholder='username'
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}/>
                        <Input type='email'
                               placeholder='email'
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}/>
                        <Input type='password'
                               placeholder='password'
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                        <Button type='submit' onClick={signUp}>Sign Up</Button>

                    </form>
                </div>
            </Modal>
            <Modal open={openSignIn}
                   onClose={() => setOpenSignIn(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <form className="app-signup">
                        <center>
                            <img src={logo} alt="logo"
                                 className="app-headerImg"/>
                        </center>
                        <Input type='email'
                               placeholder='email'
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}/>
                        <Input type='password'
                               placeholder='password'
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                        <Button type='submit' onClick={signIn}>Sign In</Button>

                    </form>
                </div>
            </Modal>
            <div className="app-header">
                <img src={logo} alt="logo"
                     className="app-headerImg"/>
                {user ? (
                    <Button onClick={() => auth.signOut()}>Log Out</Button>
                ) : (
                    <div className="app-loginContainer">
                        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        <Button onClick={() => setOpen(true)}>Sign Up</Button>
                    </div>
                )}
            </div>
            {/*    header*/}
            <div className="app-posts">
                {
                    posts.map(({id, post}) => (
                        <Post key={id} postId={id} user={user} username={post.username} caption={post.caption}
                              imageUrl={post.imageUrl}/>
                    ))
                }
            </div>
            {user?.displayName
                ? (<ImageUpload username={user.displayName}/>)
                : (<h3 className="sorry">Sorry, You need to Login To Upload Images!</h3>)}
            <InstagramEmbed
                url="https://www.instagram.com/p/CGyucmxA95n/"
                maxWidth={320}

                hideCaption={false}
                containerTagName='div'
                protocol=''
                injectScript
                onLoading={() => {}}
                onSuccess={() => {}}
                onAfterRender={() => {}}
                onFailure={() => {}}
            />
        </div>
    );
}

export default App;
