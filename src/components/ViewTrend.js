import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getDocs, collection, deleteDoc, doc, query, where, onSnapshot } from "firebase/firestore";
// import { auth } from "../firebase";
import { Card } from "react-bootstrap";
// import LineChart from "./chart/LineChart";
import PieChart from './chart/PieChart';
import BarChart from "./chart/BarChart";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import GrassIcon from '@mui/icons-material/Grass';
import OutletIcon from '@mui/icons-material/Outlet';
import LooksIcon from '@mui/icons-material/Looks';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import { normalMenu, lucidMenu, nightmareMenu, healingMenu, outOfBodyMenu } from "./DreamMenu";
import { sleepDataQuestions, sleepDataStats } from "./SleepDataQuestions";
import { Line } from "react-chartjs-2";

function ViewTrend() {
  const [postLists, setPostList] = useState([]);
  const postsCollectionRef = collection(db, "posts");
  const { currentUser } = useAuth();
  let navigate = useNavigate();

  // Initialise mood data state
  const [moodData, setMoodData] = useState({
    labels: ["happy", "neutral", "sad"],
    datasets: [
      {
        label: "Mood",
        data: [0, 0, 0], // Initialize with default values of 0
        backgroundColor: ["#f1e9d6", "#d978ae", "#a9e5fd"],
        borderColor: "white",
        borderWidth: 1.5,
      },
    ],
  });

  // Initialise dream type data state
  const [dreamTypeData, setDreamTypeData] = useState({
    labels: ["Normal", "Lucid", "Nightmare", "Healing", "Out-of-body Experience"],
    datasets: [
      {
        label: "Dream Types",
        data: [0, 0, 0, 0, 0],
        backgroundColor: ["#f1e9d6", "#d978ae", "#a9e5fd", "#abcdef", "#fedcba"],
        borderColor: "white",
        borderWidth: 1.5,
      },
    ],
  });

  // Initialise normal dreams data state
  const [normalSubtypeData, setNormalSubtypeData] = useState({
    labels: normalMenu,
    datasets: [
      {
        label: "Normal Dream Subtypes",
        data: Array(normalMenu.length).fill(0),
        backgroundColor: ["#f1e9d6", "#d978ae", "#a9e5fd", "#abcdef", "#fedcba", "#012345"],
        borderColor: "white",
        borderWidth: 1.5,
      },
    ],
  });

  // Initialise lucid dreams data state
  const [lucidSubtypeData, setLucidSubtypeData] = useState({
    labels: lucidMenu,
    datasets: [
      {
        label: "Lucid Dream Subtypes",
        data: Array(lucidMenu.length).fill(0),
        backgroundColor: ["#f1e9d6", "#d978ae"],
        borderColor: "white",
        borderWidth: 1.5,
      },
    ],
  });

  // Initialise nightmare dreams data state
  const [nightmareSubtypeData, setNightmareSubtypeData] = useState({
    labels: nightmareMenu,
    datasets: [
      {
        label: "Nightmare Dream Subtypes",
        data: Array(nightmareMenu.length).fill(0),
        backgroundColor: ["#f1e9d6", "#d978ae", "#a9e5fd", "#abcdef", "#fedcba", "#012345"],
        borderColor: "white",
        borderWidth: 1.5,
      },
    ],
  });

  // Initialise healing dreams data state
  const [healingSubtypeData, setHealingSubtypeData] = useState({
    labels: healingMenu,
    datasets: [
      {
        label: "Healing Dream Subtypes",
        data: Array(healingMenu.length).fill(0),
        backgroundColor: ["#f1e9d6", "#d978ae", "#a9e5fd", "#abcdef", "#fedcba", "#012345"],
        borderColor: "white",
        borderWidth: 1.5,
      },
    ],
  });

  // Initialise out-of-body experience dreams data state
  const [outOfBodySubtypeData, setOutOfBodySubtypeData] = useState({
    labels: outOfBodyMenu,
    datasets: [
      {
        label: "Out-of-Body Experience Dream Subtypes",
        data: Array(outOfBodyMenu.length).fill(0),
        backgroundColor: ["#f1e9d6", "#d978ae", "#a9e5fd", "#abcdef", "#fedcba", "#012345"],
        borderColor: "white",
        borderWidth: 1.5,
      },
    ],
  });
  
  // Initialise average sleep duration
  const [averageSleepDuration, setAverageSleepDuration] = useState(0);

  // Initialise sleep data questions percentage array
  const [questionPercentages, setQuestionPercentages] = useState([]);

  useEffect(() => {
    // Check if currentUser is null or not
    if (!currentUser) {
      // Redirect to the login page or handle the unauthorized state
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {

    const fetchUserPostsAndData = async () => {
      // Fetch user posts using a one-time read
      const postsSnapshot = await getDocs(postsCollectionRef);
      const allPosts = postsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      }));

      // Filter user posts based on the current user's email
      const userPosts = allPosts.filter(
        (post) => post.author.email === currentUser.email
      );

      // Calculate mood counts using reduce
      const moodCount = userPosts.reduce(
        (counts, post) => {
          if (post.mood === "happy") {
            counts.happyCount++;
          } else if (post.mood === "neutral") {
            counts.neutralCount++;
          } else if (post.mood === "sad") {
            counts.sadCount++;
          } else {
            counts.noneCount++;
          }
          return counts;
        },
        { happyCount: 0, neutralCount: 0, sadCount: 0, noneCount: 0 }
      );

      const { happyCount, neutralCount, sadCount } = moodCount;

      // Create the moodData object for the chart
      const moodChart = {
        labels: ["Happy", "Neutral", "Sad"],
        datasets: [
          {
            label: "Mood",
            data: [happyCount, neutralCount, sadCount],
            backgroundColor: ["#f1e9d6", "#d978ae", "#a9e5fd"],
            borderColor: "white",
            borderWidth: 1.5,
          },
        ],
      };

      // Calculate dream type counts and dream type specific counts using reduce
      const dreamTypeCount = userPosts.reduce(
        (counts, post) => {
          if (post.dreamType === "Normal") {
            counts.normalCount++;
            if (normalMenu.includes(post.dreamTypeSpecific)) {
              counts.normalSubtypeCounts[post.dreamTypeSpecific]++;
            }
          } else if (post.dreamType === "Lucid") {
            counts.lucidCount++;
            if (lucidMenu.includes(post.dreamTypeSpecific)) {
              counts.lucidSubtypeCounts[post.dreamTypeSpecific]++;
            }
          } else if (post.dreamType === "Nightmare") {
            counts.nightmareCount++;
            if (nightmareMenu.includes(post.dreamTypeSpecific)) {
              counts.nightmareSubtypeCounts[post.dreamTypeSpecific]++;
            }
          } else if (post.dreamType === "Healing") {
            counts.healingCount++;
            if (healingMenu.includes(post.dreamTypeSpecific)) {
              counts.healingSubtypeCounts[post.dreamTypeSpecific]++;
            }
          } else if (post.dreamType === "Out-of-body Experience") {
            counts.outOfBodyCount++;
            if (outOfBodyMenu.includes(post.dreamTypeSpecific)) {
              counts.outOfBodySubtypeCounts[post.dreamTypeSpecific]++;
            }
          }
          return counts;
        },
        {
          normalCount: 0,
          lucidCount: 0,
          nightmareCount: 0,
          healingCount: 0,
          outOfBodyCount: 0,
          // Initialize dream type subtypes counts with 0
          normalSubtypeCounts: Object.fromEntries(normalMenu.map((subtype) => [subtype, 0])),
          lucidSubtypeCounts: Object.fromEntries(lucidMenu.map((subtype) => [subtype, 0])),
          nightmareSubtypeCounts: Object.fromEntries(nightmareMenu.map((subtype) => [subtype, 0])),
          healingSubtypeCounts: Object.fromEntries(healingMenu.map((subtype) => [subtype, 0])),
          outOfBodySubtypeCounts: Object.fromEntries(outOfBodyMenu.map((subtype) => [subtype, 0]))
        }
      );

      // Create dreamTypeData object for chart
      const dreamTypeChart = {
        labels: ["Normal", "Lucid", "Nightmare", "Healing", "Out-of-body Experience"],
        datasets: [
          {
            label: "Dream Types",
            data: [
              dreamTypeCount.normalCount, 
              dreamTypeCount.lucidCount, 
              dreamTypeCount.nightmareCount, 
              dreamTypeCount.healingCount,
              dreamTypeCount.outOfBodyCount
            ],
            backgroundColor: ["#f1e9d6", "#d978ae", "#a9e5fd", "#abcdef", "#fedcba"],
            borderColor: "white",
            borderWidth: 1.5,
          },
        ],
      };

      // Create normalSubtypeData object for chart
      const normalSubtypeChart = {
        labels: normalMenu,
        datasets: [
          {
            label: "Normal Dream Subtypes",
            data: Object.values(dreamTypeCount.normalSubtypeCounts),
            backgroundColor: ["#f1e9d6", "#d978ae", "#a9e5fd", "#abcdef", "#fedcba", "#012345"],
            borderColor: "white",
            borderWidth: 1.5,
          },
        ],
      };

      // Create lucidSubtypeData object for chart
      const lucidSubtypeChart = {
        labels: lucidMenu,
        datasets: [
          {
            label: "Lucid Dream Subtypes",
            data: Object.values(dreamTypeCount.lucidSubtypeCounts),
            backgroundColor: ["#f1e9d6", "#d978ae", "#a9e5fd", "#abcdef", "#fedcba", "#012345"],
            borderColor: "white",
            borderWidth: 1.5,
          },
        ],
      };

      // Create nightmareSubtypeData object for chart
      const nightmareSubtypeChart = {
        labels: nightmareMenu,
        datasets: [
          {
            label: "Nightmare Dream Subtypes",
            data: Object.values(dreamTypeCount.nightmareSubtypeCounts),
            backgroundColor: ["#f1e9d6", "#d978ae", "#a9e5fd", "#abcdef", "#fedcba", "#012345"],
            borderColor: "white",
            borderWidth: 1.5,
          },
        ],
      };

      // Create healingSubtypeData object for chart
      const healingSubtypeChart = {
        labels: healingMenu,
        datasets: [
          {
            label: "Healing Dream Subtypes",
            data: Object.values(dreamTypeCount.healingSubtypeCounts),
            backgroundColor: ["#f1e9d6", "#d978ae", "#a9e5fd", "#abcdef", "#fedcba", "#012345"],
            borderColor: "white",
            borderWidth: 1.5,
          },
        ],
      };

      // Create outOfBodySubtypeData object for chart
      const outOfBodySubtypeChart = {
        labels: outOfBodyMenu,
        datasets: [
          {
            label: "Out-of-body Experience Dream Subtypes",
            data: Object.values(dreamTypeCount.outOfBodySubtypeCounts),
            backgroundColor: ["#f1e9d6", "#d978ae", "#a9e5fd", "#abcdef", "#fedcba", "#012345"],
            borderColor: "white",
            borderWidth: 1.5,
          },
        ],
      }

      const numPosts = userPosts.length;

      // Calculation for average sleep duration
      const totalSleepDuration = userPosts.reduce(
        (total, post) => total + post.sleepTime.duration,
        0
      );
      const averageDuration = numPosts === 0 ? 0 : totalSleepDuration / numPosts;

      // Calculation for sleep data questions percentage
      const trueCounts = sleepDataQuestions.map((question, index) => {
        const trueCount = userPosts.reduce(
          (count, post) => (post.questionStates[index] ? count + 1 : count),
          0
        );
        return (trueCount / numPosts) * 100;
      });

      // Update the state for all the data: user posts, mood counts, and dream type counts, average sleep duration, and sleep data questions
      setPostList(userPosts);
      setMoodData(moodChart);
      setDreamTypeData(dreamTypeChart);
      setNormalSubtypeData(normalSubtypeChart);
      setLucidSubtypeData(lucidSubtypeChart);
      setNightmareSubtypeData(nightmareSubtypeChart);
      setHealingSubtypeData(healingSubtypeChart);
      setOutOfBodySubtypeData(outOfBodySubtypeChart);
      setAverageSleepDuration(averageDuration);
      setQuestionPercentages(trueCounts);
    };

    // Fetch user posts and mood counts once
    fetchUserPostsAndData();
  }, [currentUser]);

  // function to show normal chart if exists
  function showNormalChart(normalCount) {
    if (normalCount) {
      return (
        <div className="text-center mb-4 sunflower-font">
          <h2 style={{ color: 'white', margin: 20, fontSize: 30 }}>⥼ Normal Dreams Breakdown ⥽</h2>
          <PieChart chartData={normalSubtypeData} />
          <br />
          <BarChart chartData={normalSubtypeData} />

          {/* divider */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, backgroundColor: "white", height: "2px" }} />
          </div>
        </div>
      )
    }
  }

  // function to show lucid chart if exists
  function showLucidChart(lucidCount) {
    if (lucidCount) {
      return (
        <div className="text-center mb-4 sunflower-font">
          <h2 style={{ color: 'white', margin: 20, fontSize: 30 }}>⥼ Lucid Dreams Breakdown ⥽</h2>
          <PieChart chartData={lucidSubtypeData} />
          <br />
          <BarChart chartData={lucidSubtypeData} />

          {/* divider */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, backgroundColor: "white", height: "2px" }} />
          </div>
        </div>
      )
    }
  }

  // function to show nightmare chart if exists
  function showNightmareChart(nightmareCount) {
    if (nightmareCount) {
      return (
        <div className="text-center mb-4 sunflower-font">
          <h2 style={{ color: 'white', margin: 20, fontSize: 30 }}>⥼ Nightmare Dreams Breakdown ⥽</h2>
          <PieChart chartData={nightmareSubtypeData} />
          <br />
          <BarChart chartData={nightmareSubtypeData} />

          <br />

          {/* divider */}
          <div style={{ display: "flex", alignItems: "center"}}>
            <div style={{ flex: 1, backgroundColor: "white", height: "2px" }} />
          </div>
        </div>
      )
    }
  }

  // function to show healing chart if exists
  function showHealingChart(healingCount) {
    if (healingCount) {
      return (
        <div className="text-center mb-4 sunflower-font">
          <h2 style={{ color: 'white', margin: 20, fontSize: 30 }}>⥼ Healing Dreams Breakdown ⥽</h2>
          <PieChart chartData={healingSubtypeData} />
          <br />
          <BarChart chartData={healingSubtypeData} />

          <br />

          {/* divider */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, backgroundColor: "white", height: "2px" }} />
          </div>
        </div>
      )
    }
  }

  // function to show out-of-body experience subdream if exists
  function showOutOfBody(outOfBodyCount) {
    if (outOfBodyCount) {
      return (
        <div className="text-center mb-4 sunflower-font">
          <h2 style={{ color: 'white', margin: 20, fontSize: 30 }}>⥼ Out-of-body Experience Dreams Breakdown ⥽</h2>
          <PieChart chartData={outOfBodySubtypeData} />
          <br />
          <BarChart chartData={outOfBodySubtypeData} />

          <br />

          {/* divider */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, backgroundColor: "white", height: "2px" }} />
          </div>
        </div>
      )
    }
  }

  return (
    <Card
      style={{
        background: 'none',
        border: 'none'
      }}>
      <Card.Body>
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
          how have your dreams been?
        </h2>

        {/* divider */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, backgroundColor: "white", height: "2px" }} />
        </div>
        
        {/* sleep data stats */}
        <div style={{ color: 'white' }} >
          <h2 className="sunflower-font text-center mb-4" style={{ margin: 20 }} >⥼ Sleep Data Breakdown ⥽</h2>
          <p className="text-center mb-4" style={{ fontSize: 18 }}>On average, you slept for: 
            <p className="sunflower-font" style={{fontSize: 25}}>✦ {Math.floor(averageSleepDuration / 60)} hours and {Math.floor(averageSleepDuration % 60)} minutes ✦</p>
          </p>

          <p style={{ fontSize: 18 }}><b>Did you know?</b></p>
          {sleepDataStats.map((question, index) => (
            <p key={index} style={{ fontSize: 18 }}>
              {index + 1}. {question} <b style={{ fontSize: 20 }}>{questionPercentages[index] !== undefined ? questionPercentages[index].toFixed(2) + '%' : 'N/A'}</b> of the time!
            </p>
          ))}
        </div>

        {/* divider */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, backgroundColor: "white", height: "2px" }} />
        </div>

        {/* mood piechart */}
        <div id='mood-piechart' className="text-center mb-4 sunflower-font">
          <h2 style={{ color: 'white', margin: 20 }}>⥼ Dream Moods Breakdown ⥽</h2>
          <PieChart chartData={moodData} />
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
            {/* 0: happy, 1: neutral, 2: sad */}
            <SentimentSatisfiedAltIcon /> dreams: {moodData.datasets[0].data[0]},
            <SentimentNeutralIcon style={{ marginLeft: 10 }} /> dreams: {moodData.datasets[0].data[1]},
            <SentimentVeryDissatisfiedIcon style={{ marginLeft: 10 }} /> dreams: {moodData.datasets[0].data[2]}
            <br />
            total: {moodData.datasets[0].data[0] + moodData.datasets[0].data[1] + moodData.datasets[0].data[2]}
          </h2>
        </div>

        {/* <div>
          <LineChart chartData={userData}/>
        </div> */}

        {/* divider */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, backgroundColor: "white", height: "2px" }} />
        </div>

        {/* dream type piechart */}
        <div id='dream-type-piechart' className="text-center mb-4 sunflower-font">
          <h2 style={{ color: 'white', margin: 20 }}>⥼ Dream Types Breakdown ⥽</h2> 
          <PieChart chartData={dreamTypeData} />
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
            {/* 0: normal, 1: lucid, 2: nightmare, 3: healing, 4: out-of-body */}
            <BedtimeIcon style={{ marginLeft: 10, marginBottom: 3 }} /> dreams: {dreamTypeData.datasets[0].data[0]},
            <GrassIcon style={{ marginLeft: 10, marginBottom: 3 }} /> dreams: {dreamTypeData.datasets[0].data[1]},
            <OutletIcon style={{ marginLeft: 10, marginBottom: 3 }} /> dreams: {dreamTypeData.datasets[0].data[2]},
            <br />
            <LooksIcon style={{ marginLeft: 10, marginBottom: 3 }} /> dreams: {dreamTypeData.datasets[0].data[3]},
            <SelfImprovementIcon style={{ marginLeft: 10, marginBottom: 3 }} /> dreams: {dreamTypeData.datasets[0].data[4]}
            <br />
            total: {dreamTypeData.datasets[0].data[0] + dreamTypeData.datasets[0].data[1] + dreamTypeData.datasets[0].data[2]
                    + dreamTypeData.datasets[0].data[3] + dreamTypeData.datasets[0].data[4]}
          </h2>
        </div>

        {/* divider */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, backgroundColor: "white", height: "2px" }} />
        </div>
        
        {/* 0: normal, 1: lucid, 2: nightmare, 3: healing, 4: out-of-body */}
        {showNormalChart(dreamTypeData.datasets[0].data[0])}
        {showLucidChart(dreamTypeData.datasets[0].data[1])}
        {showNightmareChart(dreamTypeData.datasets[0].data[2])}
        {showHealingChart(dreamTypeData.datasets[0].data[3])}
        {showOutOfBody(dreamTypeData.datasets[0].data[4])}

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

export default ViewTrend;