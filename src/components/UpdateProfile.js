import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./UpdateProfile.css"
// import { addDoc, collection } from "firebase/firestore";
// import { db, auth } from "../firebase";

export default function UpdateProfile() {
  const emailRef = useRef();
  // const nameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updatePassword, updateEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const [name, setName] = useState("");
  // const nameCollection = collection(db, "Name");
  const navigate = useNavigate();

  // const createName = async () => {
  //   await addDoc(nameCollection, {
  //     name,
  //     author: { email: auth.currentUser.email, id: auth.currentUser.uid },
  //   });
  //   // navigate("/");
  // };

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        navigate("/");


      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      {/* <div className="createPostPage">
        <div className="cpContainer">
          <h1></h1>
          <div className="inputGp">
            <label> Title:</label>
            <input
              placeholder="Title..."
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </div>
          <button onClick={createName}> Submit</button>
        </div>
      </div> */}

      <Card style={{backgroundColor: 'transparent', border: 'none'}}>
        <Card.Body>
        <h2 className="text-center mb-4 sunflower-font" 
          style={{fontSize: 23, 
                  color: "#bd9dee", 
                  backgroundColor: "white", 
                  opacity:0.9,
                  padding: 5
                  }}>
          ⥼ discover your finest creations ⥽
          </h2>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, backgroundColor: "white", height: "3px" }} />

            <p style={{ margin: "0 10px", color: "white" }}>
            Update Profile
            </p>

            <div style={{ flex: 1, backgroundColor: "white", height: "3px" }} />
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* email */}
            <div className="row">
                <div className="w-100">
                  <Form.Group id="email">
                    <Form.Control
                      type="email"
                      ref={emailRef}
                      required
                      defaultValue={currentUser.email}
                      style={{
                      borderRadius: 40,
                      height: "60px",
                      padding: 20,
                      marginTop: 30
                    }}
                    />
                  </Form.Group>
                </div>
            </div>
            

            {/* <Form.Group id="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                ref={nameRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group> */}

            {/* password */}
            <div className="row">
              <div className="w-100">
              <Form.Group id="password">
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  required
                  placeholder="Password (Leave blank to keep the same)"
                  style={{
                    borderRadius: 40,
                    height: "60px",
                    padding: 20,
                    marginTop: 15, 
                    marginBottom: 15,
                  }}
                />
              </Form.Group>
              </div>
            </div>
            {/* password confirmation */}
            <div className="row">
              <div className="w-100">
                <Form.Group id="password-confirm">
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    required
                    placeholder="Password Confirmation (Leave blank to keep the same)"
                    style={{
                      borderRadius: 40,
                      height: "60px",
                      padding: 20,
                    }}
                  />
                </Form.Group>
              </div>
            </div>
            <br />

            {/* button */}
            <Button disabled={loading} className="btn btn-secondary btn-outline-light w-100 mt-3" type="submit">
              Update
            </Button>

            <div className="w-100 text-center mt-2">
              <Link to="/" style={{
                color: '#efd5d1'
              }}>
              <b>Cancel</b>
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
