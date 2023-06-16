import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
// import { auth } from "../firebase";
import { Card } from "react-bootstrap";

function ViewPast() {
  const [postLists, setPostList] = useState([]);
  const postsCollectionRef = collection(db, "posts");
  const { currentUser } = useAuth();
  let navigate = useNavigate();

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
    <Card>
      <Card.Body>
        {postLists.map((post) => {
          return (
            <div className="post">
              <h2
                className="text-center mb-4"
                style={{
                  fontSize: 20,
                  color: "#bd9dee",
                  backgroundColor: "white",
                  opacity: 0.9,
                }}
              >
                <b>
                  <u>
                    &#9829; {post.title} on {post.dateText} &#9829;
                  </u>
                </b>
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
                    fontSize: 20,
                    color: "#bd9dee",
                    backgroundColor: "white",
                    opacity: 0.9,
                  }}
                >
                  <b>{post.postText}</b>
                </h2>
              </div>
            </div>
          );
        })}

        {/* button */}
        <div className="w-100 text-center mt-2">
          <Link to="/">Back</Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ViewPast;
