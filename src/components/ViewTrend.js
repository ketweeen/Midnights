import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getDocs, collection, deleteDoc, doc, query, where, onSnapshot } from "firebase/firestore";
// import { auth } from "../firebase";
import { Card } from "react-bootstrap";
// import LineChart from "./chart/LineChart";
import PieChart from './chart/PieChart';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

function ViewTrend() {
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

  let noneCount = 0;
  
  const moodData = postLists
    .filter((post) => post.author.email == currentUser.email)
    .reduce(
      (counts, post) => {
        if (post.mood === 'happy') {
          counts.happyCount++;
        } else if (post.mood === 'neutral') {
          counts.neutralCount++;
        } else if (post.mood === 'sad') {
          counts.sadCount++;
        } else {
          noneCount++;
        }
        return counts;
      },
      { happyCount: 0, neutralCount: 0, sadCount: 0, noneCount: 0 }
    );
  
  const { happyCount, neutralCount, sadCount } = moodData;

  let [userData, setUserData] = useState({
    labels: ['happy', 'neutral', 'sad'],
    datasets: [
      {
        label: 'Mood',
        data: [happyCount, neutralCount, sadCount],
        backgroundColor: [
          '#f1e9d6',
          '#d978ae',
          '#a9e5fd'
        ],
        borderColor: "white",
        borderWidth: 1.5,
      }
    ],
  });

  useEffect(() => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      datasets: [
        {
          ...prevUserData.datasets[0],
          data: [happyCount, neutralCount, sadCount]
        }
      ]
    }));
  }, [happyCount, neutralCount, sadCount]);

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
        <div>
          <PieChart chartData={userData} />
        </div>
        {/* <div>
          <LineChart chartData={userData}/>
        </div> */}
        {/* button */}
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
        <SentimentSatisfiedAltIcon /> dreams: {happyCount},
        <SentimentNeutralIcon style={{marginLeft: 10}}/> dreams: {neutralCount},
        <SentimentVeryDissatisfiedIcon style={{marginLeft: 10}} /> dreams: {sadCount}
        <br />
        total: {happyCount + neutralCount + sadCount}
        </h2>

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