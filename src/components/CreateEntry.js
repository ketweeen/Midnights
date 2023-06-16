import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Card } from "react-bootstrap";
import { db, auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function CreateEntry() {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [dateText, setDateText] = useState("");
  const { currentUser } = useAuth();

  const postsCollectionRef = collection(db, "posts");
  let navigate = useNavigate();

  const createEntry = async () => {
    await addDoc(postsCollectionRef, {
      title,
      postText,
      dateText,
      author: {
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
      },
    });
    navigate("/");
  };

  useEffect(() => {
    // Check if currentUser is null or not
    if (!currentUser) {
      // Redirect to the login page or handle the unauthorized state
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return (
    <Card>
      <Card.Body>
        {/* text */}
        <h2
          className="text-center mb-4"
          style={{
            fontSize: 20,
            color: "#bd9dee",
            backgroundColor: "white",
            opacity: 0.9,
          }}
        >
          <b>How was your dream?</b>
        </h2>

        {/* title */}
        <label> Title:</label>
        <input
          placeholder="Title..."
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <br />
        {/* date */}
        <label> Date:</label>
        <input
          placeholder="Date..."
          onChange={(event) => {
            setDateText(event.target.value);
          }}
        />
        <br />
        {/* post */}
        <label> Post:</label>
        <textarea
          placeholder="Post..."
          onChange={(event) => {
            setPostText(event.target.value);
          }}
        />
        <br />
        {/* submit button */}
        <div className="w-100 text-center mt-2">
          <button onClick={createEntry}> Submit Post </button>
        </div>
        {/* button */}
        <div className="w-100 text-center mt-2">
          <Link to="/">Back</Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CreateEntry;
