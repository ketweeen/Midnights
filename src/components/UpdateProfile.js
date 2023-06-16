import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
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

      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>

            {/* <Form.Group id="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                ref={nameRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group> */}

            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                ref={passwordRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>

            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmRef}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <br />

            <Button disabled={loading} className="w-100" type="submit">
              Update
            </Button>

            <div className="w-100 text-center mt-2">
              <Link to="/">Cancel</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
