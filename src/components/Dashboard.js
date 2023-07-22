import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
// import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // const nameCollection = collection(db, "name");

  // remove users who are not logged in
  useEffect(() => {
    // Check if currentUser is null or not
    if (!currentUser) {
      // Redirect to the login page or handle the unauthorized state
      navigate("/login");
    }
  }, [currentUser, navigate]);

  //allow log out
  async function handleLogout() {
    setError("");

    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  if (!currentUser) {
    // Show a loading indicator or redirect to the login page
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <Card
        style={{
          backgroundColor: 'transparent',
          border: 'none',
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
          what would you like to do today?
          </h2>
          {/* Create Entry */}
          <div className="w-100 text-center mt-2">
            <Link to="/create-entry" className="btn btn-outline-light mt-3"
              style={{
                width: 300,
                border: 'solid white 1.5px'
              }}>
            ⥼ Create Entry ⥽
            </Link>
          </div>

          {/* View Past */}
          <div className="w-100 text-center mt-2">
            <Link to="/view-past" className="btn btn-outline-light mt-3"
              style={{
                width: 300,
                border: 'solid white 1.5px'
              }}>
            ⥼ View Past ⥽
            </Link>
          </div>

          {/* View Trend */}
          <div className="w-100 text-center mt-2">
            <Link to="/view-trend" className="btn btn-outline-light mt-3"
              style={{
                width: 300,
                border: 'solid white 1.5px'
              }}>
            ⥼ View Trend ⥽
            </Link>
          </div>
        </Card.Body>
        <br />
      </Card>
      <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, backgroundColor: "white", height: "3px" }} />
      </div>

      {/* Profile */}
      <Card
        style={{
          background: "transparent" ,
          border: 'none',
          color: 'white',
        }}>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {auth.currentUser.email}
          {/* Update Profile Button */}
          <Link to="/update-profile" className="btn btn-outline-light w-100 mt-3">
            Update Profile
          </Link>
          {/* Log Out Button */}
          <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout} 
              style={{
                color: '#efd5d1'
              }}>
              <b>Log Out</b>
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
