import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import './App.css';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch {
      setError("Failed to create an account");
    }

    setLoading(false);
  }

  return (
    <>
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
              Sign up with Email
            </p>

            <div style={{ flex: 1, backgroundColor: "white", height: "3px" }} />
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* email */}
            <div className="row">
              <div className="mx-auto col-10 col-md-8 col-lg-9">
                <Form.Group id="email">
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    required
                    placeholder="Email"
                    style={{
                      borderRadius: 40,
                      height: "60px",
                      padding: 20,
                      width: 400,
                      marginBottom: 15,
                      marginTop: 15,
                    }}
                  />
                </Form.Group>
              </div>
            </div>
            {/* password */}
            <div className="row">
              <div className="mx-auto col-10 col-md-8 col-lg-9">
              <Form.Group id="password">
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  required
                  placeholder="Password"
                  style={{
                    borderRadius: 40,
                    height: "60px",
                    padding: 20,
                    width: 400,
                    marginBottom: 25,
                  }}
                />
              </Form.Group>
              </div>
            </div>
            {/* password confirmation */}
            <div className="row">
              <div className="mx-auto col-10 col-md-8 col-lg-9">
                <Form.Group id="password-confirm">
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    required
                    placeholder="Password Confirmation"
                    style={{
                      borderRadius: 40,
                      height: "60px",
                      padding: 20,
                      width: 400,
                      marginBottom: 25,
                    }}
                  />
                </Form.Group>
              </div>
            </div>
            {/* button */}
            <div className="text-center">
              <Button disabled={loading} type="submit" 
              style={{backgroundColor: "#bd9dee",
                      borderColor: "white",
                      borderRadius: 25,
                      height:35,
                      fontSize: 15,
                      minWidth: 100}}>
                Sign Up
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2" style={{color: "#efd5d1"}}>
        <b>Already have an account? <Link to="/login" style={{color: "#efd5d1"}}>Log In</Link></b>
      </div>
    </>
  );
}
