import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Card } from "react-bootstrap";
import { db, auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./CreateEntry.css";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function CreateEntry() {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [dateText, setDateText] = useState("");
  const [mood, setMood] = useState("neutral");
  const [tags, setTags] = useState([]);
  const { currentUser } = useAuth();

  const handleMood = (event, newMood) => {
    if (newMood !== null) {
      setMood(newMood);
    }
  };

  const postsCollectionRef = collection(db, "posts");
  let navigate = useNavigate();

  const createEntry = async () => {
    await addDoc(postsCollectionRef, {
      title,
      postText,
      dateText,
      mood,
      tags,
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

  function handleKeyDown(e) {
    // if Enter is not pressed, do nothing
    if (e.key !== 'Enter') return

    const value = e.target.value
    if (!value.trim()) return // If only spaces is typed down

    setTags([...tags, value])
    e.target.value = ''
  }

  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index))
  }

  return (
    <Card
     style={{
      background: 'transparent',
      border: 'none',
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
          how was your dream?
          </h2>

        {/* title */}
        {/* <label> Title:</label> */}
        <input
          placeholder="Give it a title..."
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          className="w-100 sunflower-font"
          style={{
            borderRadius: 20,
            height: "50px",
            padding: 20,
            width: 400,
            marginBottom: 15,
            border: 'solid white 1.5px',
            background: 'transparent',
            color: "white",
            fontSize: 28
          }}
        />
      <br />
        {/* date */}
        {/* <label> Date: </label> */}
        <input
          type="date"
          placeholder="Date..."
          onChange={(event) => {
            setDateText(event.target.value);
          }}
          style={{
            borderRadius: 40,
            height: "30px",
            padding: 20,
            width: 200,
            marginBottom: 15,
            border: 'solid white 1.5px',
            background: 'white',
            color: "#bd9dee"
          }}
        />
        <br />
        {/* post */}
        {/* <label> Post: </label> */}
        <textarea
          placeholder="Describe it... (max. 500 characters)"
          className="w-100"
          onChange={(event) => {
            setPostText(event.target.value);
          }}
          style={{
            borderRadius: 20,
            height: "200px",
            padding: 20,
            width: 400,
            marginBottom: 15,
            border: 'solid white 1.5px',
            background: 'transparent',
            color: "white"
          }}
          maxLength={500}
        />
        <br />
        {/* mood */}
        <ToggleButtonGroup
          value={mood}
          exclusive
          onChange={handleMood}
          aria-label="mood"
          style={{
            border: "solid white 1.5px",
            marginBottom: 15
          }}
          aria-required
        >
          <ToggleButton value="happy" aria-label="happy">
            <SentimentSatisfiedAltIcon style={{color: 'white'}} />
          </ToggleButton>
          <ToggleButton value="neutral" aria-label="neutral">
            <SentimentNeutralIcon style={{color: 'white'}} />
          </ToggleButton>
          <ToggleButton value="sad" aria-label= "sad">
            <SentimentVeryDissatisfiedIcon style={{color: 'white'}} />
          </ToggleButton>
        </ToggleButtonGroup>

        <br />
        {/* tags */}
        <label style={{color: 'white'}}> <b>Tags:</b> </label>
        <div className="tags-input-container">
            { tags.map((tag, index) => (
                <div className="tag-item" key={index}>
                    <span className="text">{tag}</span>
                    <span className="close" onClick={() => removeTag(index)}>&times;</span>
                </div>
            ))}
            <input className="tags-input" type="text" onKeyDown={handleKeyDown} placeholder="Add some tags..." />
        </div>
        
        {/* submit button */}
        <div className="w-100 text-center mt-2">
          <button className="btn btn-outline-light mt-3" onClick={createEntry}> Submit Entry </button>
        </div>
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

export default CreateEntry;