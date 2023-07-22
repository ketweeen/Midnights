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
import BedtimeIcon from '@mui/icons-material/Bedtime';
import GrassIcon from '@mui/icons-material/Grass';
import OutletIcon from '@mui/icons-material/Outlet';
import LooksIcon from '@mui/icons-material/Looks';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { sleepDataQuestions } from "./SleepDataQuestions";
import { normalMenu, lucidMenu, nightmareMenu, healingMenu, outOfBodyMenu } from "./DreamMenu";

function CreateEntry() {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [dateText, setDateText] = useState("");
  const [mood, setMood] = useState("neutral");
  const [dreamType, setDreamType] = useState("Normal");
  const [dreamTypeSpecific, setDreamTypeSpecific] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [questionStates, setQuestionStates] = useState(
    Array(sleepDataQuestions.length).fill(false)
  );
  const [tags, setTags] = useState([]);
  const { currentUser } = useAuth();

  const postsCollectionRef = collection(db, "posts");
  let navigate = useNavigate();

  const createEntry = async () => {
    // Error alerts
    if (!title) {
      alert("Please give it a title :(");
      return;
    }

    if (!dateText) {
      alert("Please select a date!");
      return;
    }

    if (!postText) {
      alert("Please describe your dream!");
      return;
    }

    if (!dreamTypeSpecific) {
      alert("Please select a more specific dream type!");
      return;
    }

    if (!startTime || !endTime) {
      alert("Please select both start and end time!");
      return;
    }

    // Add document to firebase
    await addDoc(postsCollectionRef, {
      title,
      postText,
      dateText,
      mood,
      dreamType,
      dreamTypeSpecific,
      sleepTime: {
        start: startTime,
        end: endTime,
        duration: calculateDuration()
      },
      questionStates,
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

  // Function to handle mood
  const handleMood = (event, newMood) => {
    if (newMood !== null) {
      setMood(newMood);
    }
  };

  // Function to handle dream type
  const handleDreamType = (event, newDreamType) => {
    if (newDreamType !== null) {
      setDreamType(newDreamType);
    }
  }

  // Function to handle dream type specific
  const handleDreamTypeSpecific = (event) => {
    setDreamTypeSpecific(event.target.value);
  };
  
  // Dropdown menus for each dream type
  function dreamTypeDropdown(dreamType) {
    let menu = normalMenu;
    if (dreamType === 'Lucid') {
      menu = lucidMenu;
    } else if (dreamType === 'Nightmare') {
      menu = nightmareMenu;
    } else if (dreamType === 'Healing') {
      menu = healingMenu;
    } else if (dreamType === 'Out-of-body Experience') {
      menu = outOfBodyMenu;
    }
    return (
      <div>
          <select
            style={{
              width: 250,
              border: 'solid white 1.5px',
              backgroundColor: 'white',
              padding: 10,
              color: '#bd9dee',
              borderRadius: 25
            }}
            onChange={handleDreamTypeSpecific}>
            <option>Please choose one!</option>
            {menu.map((type) => (
              <option value={type}>{type}</option>
            )
          )}
          </select>
      </div>
    )
  }

  // Function to calculate duration
  const calculateDuration = () => {
    // Convert start and end time strings to Date objects
    const start = new Date(`2023-01-01T${startTime}:00`);
    const end = new Date(`2023-01-01T${endTime}:00`);

    // Calculate the duration in minutes
    let durationInMinutes = (end - start) / 60000;

    if (durationInMinutes < 0) {
      durationInMinutes += 1440;
    }

    return durationInMinutes;
  };

  // Switch
  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#bd9dee',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
    },
  }));

  // Function to handle switch change
  const handleSwitchChange = (index) => (event) => {
    const newQuestionStates = [...questionStates];
    newQuestionStates[index] = event.target.checked;
    setQuestionStates(newQuestionStates);
  };

  // Function to handle tag system
  function handleKeyDown(e) {
    // if Enter is not pressed, do nothing
    if (e.key !== 'Enter') return

    const value = e.target.value
    if (!value.trim()) return // If only spaces is typed down

    setTags([...tags, value])
    e.target.value = ''
  }

  // Function to remove tag
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
          maxLength={100}
          required
        />

        <br />

        {/* date */}
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
          required
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

        {/* dream type */}
        <ToggleButtonGroup
          value={dreamType}
          exclusive
          onChange={handleDreamType}
          aria-label="dream type"
          style={{
            border: "solid white 1.5px",
            marginBottom: 15
          }}
          aria-required
        >
          <ToggleButton value="Normal" aria-label="normal">
            <BedtimeIcon style={{color: 'white'}} />
            <p
              style={{
                marginLeft: 5,
                marginTop: 15,
                fontSize: 11,
                color: "white"
              }}>
            Normal
            </p>
          </ToggleButton>
          <ToggleButton value="Lucid" aria-label="lucid">
            <GrassIcon style={{color: 'white'}} />
            <p
              style={{
                marginLeft: 5,
                marginTop: 15,
                fontSize: 11,
                color: "white"
              }}>
            Lucid
            </p>
          </ToggleButton>
          <ToggleButton value="Nightmare" aria-label= "nightmare">
            <OutletIcon style={{color: 'white'}} />
            <p
              style={{
                marginLeft: 5,
                marginTop: 15,
                fontSize: 11,
                color: "white"
              }}>
            Nightmare
            </p>
          </ToggleButton>
          <ToggleButton value="Healing" aria-label="healing">
            <LooksIcon style={{color: 'white'}} />
            <p
              style={{
                marginLeft: 5,
                marginTop: 15,
                fontSize: 11,
                color: "white"
              }}>
            Healing
            </p>
          </ToggleButton>
          <ToggleButton value="Out-of-body Experience" aria-label="out-of-body experience">
            <SelfImprovementIcon style={{color: 'white'}} />
            <p
              style={{
                marginLeft: 5,
                marginTop: 15,
                fontSize: 11,
                color: "white"
              }}>
            Our-of-body Experience
            </p>
          </ToggleButton>
        </ToggleButtonGroup>

        <br />
            
        {/* dream type specific */}
        <div>
        <label style={{color: 'white'}}> <b>Let's be more specific:</b> </label>
          {dreamTypeDropdown(dreamType)}
        </div>

        <br />

        {/* sleep data */}
        <div>
          {/* divider */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, backgroundColor: "white", height: "3px" }} />

              <p style={{ margin: "0 10px", color: "white" }}>
                Sleep Data
              </p>

            <div style={{ flex: 1, backgroundColor: "white", height: "3px" }} />
          </div>

          <br />

          {/* sleeping time */}
          <label style={{color: 'white'}}> <b>Sleeping time:</b> from </label>
          <input type="time" min="00:00" max="23:59" required
            style={{
              backgroundColor: 'white',
              color: '#bd9dee',
              border: 'none',
              borderRadius: 25,
              padding: 7,
              margin: 5
            }}
            onChange={(event) => {
              setStartTime(event.target.value);
            }}
          />
          <label style={{color: 'white'}}> to </label>
          <input type="time" min="00:00" max="23:59" required
            style={{
              backgroundColor: 'white',
              color: '#bd9dee',
              border: 'none',
              borderRadius: 25,
              padding: 7,
              margin: 5
            }}
            onChange={(event) => {
              setEndTime(event.target.value);
            }}
          />

          <br />

          {/* sleep data questions */}  
          <div style={{ marginTop: 25 }}>
            <label style={{color: 'white'}}> <b>Additional Questions:</b> </label>
            {sleepDataQuestions.map((question, index) => (
              <FormGroup>
                <Stack direction="row" spacing={1} alignItems="center">
                  <label style={{ color: 'white', marginTop: 6 }}> 
                    <b>{`${index + 1}. ${question}`}</b>
                  </label>
                  <p style={{ color: 'white' }}>No</p>
                  <AntSwitch 
                    checked={questionStates[index]}
                    onChange={handleSwitchChange(index)}
                    inputProps={{ 'aria-label': 'ant design' }} 
                  />
                  <p style={{ color: 'white' }}>Yes</p>
                </Stack>
              </FormGroup>
            ))}
          </div>
          

          {/* divider */}
          <div style={{ display: "flex", alignItems: "center", marginTop: 25 }}>
            <div style={{ flex: 1, backgroundColor: "white", height: "3px" }} />
            <div style={{ flex: 1, backgroundColor: "white", height: "3px" }} />
          </div>
        </div>

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

        {/* back button */}
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