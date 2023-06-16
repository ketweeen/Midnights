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

  //second use effect for retriving name from firebase
  // useEffect(() => {
  //   const getPosts = async () => {
  //     const data = await getDocs(nameCollection);
  //   };
  //   getPosts();
  // })

  return (
    <>
      <Card>
        <Card.Body>
          {/* 1 */}
          <div className="w-100 text-center mt-2">
            <Link to="/create-entry" className="btn btn-primary w-100 mt-3">
              Create Entry
            </Link>
          </div>

          
          {/* 2 */}
          <div className="w-100 text-center mt-2">
            <Link to="/view-past" className="btn btn-primary w-100 mt-3">
              View Past
            </Link>
          </div>
          {/* 3 */}
          <div className="w-100 text-center mt-2">
            <Link to="/all-one" className="btn btn-primary w-100 mt-3">
              Hmm whats this
            </Link>
          </div>
        </Card.Body>

        <br />
      </Card>
      <br />
      <Card>
        <Card.Body>
          {/* <h2 className="text-center mb-4">Profile</h2> */}
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {auth.currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
          <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
