import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
// import { auth } from "../firebase";
import { Card } from "react-bootstrap";
import "./App.css";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import GrassIcon from '@mui/icons-material/Grass';
import OutletIcon from '@mui/icons-material/Outlet';
import LooksIcon from '@mui/icons-material/Looks';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

function ViewPast() {
  const [postLists, setPostList] = useState([]);
  const postsCollectionRef = collection(db, "posts");
  const { currentUser } = useAuth();
  let navigate = useNavigate();

  function moodSymbol(mood) {
    if (mood === 'happy') {
      return <SentimentSatisfiedAltIcon style={{fontSize: '35', margin: 5}} />
    }
    if (mood === 'neutral') {
      return <SentimentNeutralIcon style={{fontSize: '35', margin: 5}} />
    }
    if (mood === 'sad') {
      return <SentimentVeryDissatisfiedIcon style={{fontSize: '35', margin: 5}} />
    }
  }

  function dreamTypeSymbol(dreamType) {
    if (dreamType === 'Normal') {
      return <BedtimeIcon style={{fontSize: '25', marginBottom: 2}} />
    }
    if (dreamType === 'Lucid') {
      return <GrassIcon style={{fontSize: '25', marginBottom: 2}} />
    }
    if (dreamType === 'Nightmare') {
      return <OutletIcon style={{fontSize: '25', marginBottom: 2}} />
    }
    if (dreamType === 'Healing') {
      return <LooksIcon style={{fontSize: '25', marginBottom: 2}} />
    }
    if (dreamType === 'Out-of-body Experience') {
      return <SelfImprovementIcon style={{fontSize: '25', marginBottom: 2}} />
    }
  }

  useEffect(() => {
    // Check if currentUser is null or not
    if (!currentUser) {
      // Redirect to the login page or handle the unauthorized state
      navigate("/login");
    } else {
      const fetchPosts = async () => {
        const data = await getDocs(postsCollectionRef);
        const posts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        // setPostList(posts.filter((post) => post.author.email === currentUser.email));

        const sortedPosts = posts
          .filter((post) => post.author.email === currentUser.email)
          .sort((a, b) => new Date(b.dateText) - new Date(a.dateText));

        setPostList(sortedPosts);
      };

      fetchPosts();
    }
  }, [currentUser, navigate]);

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    setPostList((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  return (
    <Card
      style={{
        background: 'none',
        border: 'none'
      }}>
      <Card.Body>
        {/* text */}
        <h2
            className="text-center mb-4 sunflower-font"
            style={{
              fontSize: 23,
              color: "#bd9dee",
              backgroundColor: "white",
              opacity: 0.9,
              padding: 5,
              marginTop: 10
            }}
          >
          see your past dreams here ~
        </h2>

        <br />
        
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, backgroundColor: "white", height: "2px" }} />
        </div>

        {/* post list */}
        {postLists.map((post) => {
          return (
            <div className="post">
              {/* title */}
              <h2
                className="text-center mb-4 sunflower-font"
                style={{
                  fontSize: 35,
                  color: "white",
                  backgroundColor: "transparent",
                  opacity: 0.9,
                  marginTop: 15
                }}
              >
                {/* mood symbol */}
                <div>
                  {moodSymbol(post.mood)}
                </div>
                <u>{post.title}</u>
              </h2>

              {/* dream type */}
              <h2
                className="text-center mb-4"
                style={{
                  fontSize: 15,
                  color: "white",
                  backgroundColor: "transparent",
                  opacity: 0.9,
                  marginTop: -15
              }}>
                ⥼ {dreamTypeSymbol(post.dreamType)} {post.dreamType} : {post.dreamTypeSpecific} ⥽
              </h2>

              {/* date */}
              <h2
                className="text-center mb-4"
                style={{
                  fontSize: 18,
                  color: "white",
                  backgroundColor: "transparent",
                  opacity: 0.9,
                  marginTop: -10,
                  wordSpacing: 5
                }}
              >
                {post.dateText} || {post.sleepTime.start} - {post.sleepTime.end}
              </h2>

              {/* post text */}
              <div className="postTextContainer text-center"
                style={{
                  color: "white",
                  backgroundColor: "transparent",
                  border: 'solid white 1.5px',
                  opacity: 0.9,
                  borderRadius: 10,
                  padding: 20,
                  margin: 30
                }}>
                <h2
                  className="text-center mb-4"
                  style={{
                    fontSize: 20,
                    padding: 20
                  }}
                >
                "{post.postText}"
                </h2>
                <p style={{marginBottom: -3}}>Sleep Duration: {Math.floor(post.sleepTime.duration / 60)} hours and {Math.floor(post.sleepTime.duration % 60)} minutes</p>
              </div>

              <div className="postTags">
                <h2
                  className="text-center mb-4"
                  style={{
                    fontSize: 16,
                    color: "white",
                    backgroundColor: "transparent",
                    opacity: 0.9,
                  }}
                >
                  <b>{post.tags.map(tag => '#'+ tag + ' ')}</b>
                </h2>
              </div>

              {/* delete button */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
              <Button
                  type="button" class="btn btn-outline-light"
                  onClick={() => {
                    deletePost(post.id);
                  }}
                >
                  <DeleteIcon /> Delete
                </Button>
              </div>

              <br />

              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1, backgroundColor: "white", height: "2px" }} />
              </div>
            </div>
          );
        })}

        <br />

        {/* button */}
        <div className="w-100 text-center mt-2">
          <Link to="/"
            style={{
            color: '#efd5d1'
            }}>
            <b>Back</b>
            </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ViewPast;