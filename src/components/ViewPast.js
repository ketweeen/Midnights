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

function ViewPast() {
  const [postLists, setPostList] = useState([]);
  const postsCollectionRef = collection(db, "posts");
  const { currentUser } = useAuth();
  let navigate = useNavigate();

  function moodSymbol(mood) {
    if (mood == 'happy') {
      return <SentimentSatisfiedAltIcon style={{fontSize: '35', margin: 5}} />
    }
    if (mood == 'neutral') {
      return <SentimentNeutralIcon style={{fontSize: '35', margin: 5}} />
    }
    if (mood == 'sad') {
      return <SentimentVeryDissatisfiedIcon style={{fontSize: '35', margin: 5}} />
    }
  }

  useEffect(() => {
    // Check if currentUser is null or not
    if (!currentUser) {
      // Redirect to the login page or handle the unauthorized state
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
  };

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
  }, [deletePost]);

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
        {postLists.filter((post) => post.author.email == currentUser.email)
        .map((post) => {
          return (
            <div className="post">
              {/* text */}
              <h2
                className="text-center mb-4 sunflower-font"
                style={{
                  fontSize: 25,
                  color: "white",
                  backgroundColor: "transparent",
                  opacity: 0.9,
                  marginTop: 15
                }}
              >
                <div>
                  {moodSymbol(post.mood)}
                </div>
                <u>{post.title}</u>
              </h2>

              <h2
                className="text-center mb-4"
                style={{
                  fontSize: 16,
                  color: "white",
                  backgroundColor: "transparent",
                  opacity: 0.9,
                  lineHeight:0,
                }}
              >
                {post.dateText}
              </h2>

              {/* <div className="deletePost">
                {currentUser && post.author.email === auth.currentUser.email && (
                  <button
                    onClick={() => {
                      deletePost(post.id);
                    }}
                  >
                    {" "}
                    &#128465;
                  </button>
                )}
              </div> */}

              <div className="postTextContainer">
                <h2
                  className="text-center mb-4"
                  style={{
                    fontSize: 18,
                    color: "white",
                    backgroundColor: "transparent",
                    border: 'solid white 1.5px',
                    opacity: 0.9,
                    borderRadius: 10,
                    padding: 20,
                    margin: 30
                  }}
                >
                {post.postText}
                </h2>
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

              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1, backgroundColor: "white", height: "2px" }} />
              </div>
            </div>
          );
        })}

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