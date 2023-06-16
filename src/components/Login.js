import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  return (
    <>
      <Card style={{backgroundColor: 'transparent', border: 0}}>
        <Card.Body>
        <h2 className="text-center mb-4" 
          style={{fontSize: 20, 
                  color: "#bd9dee", 
                  backgroundColor: "white", 
                  opacity:0.9}}><b>- log in -</b></h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              {/* <Form.Label>Email</Form.Label> */}
              <Form.Control type="email" ref={emailRef} required placeholder="Email" 
              style={{borderRadius: 40, 
                      height:"60px", 
                      padding:20, 
                      minWidth:300,
                      marginBottom: 15}}/>
            </Form.Group>
            <Form.Group id="password">
              {/* <Form.Label>Password</Form.Label> */}
              <Form.Control type="password" ref={passwordRef} required placeholder="Password" 
              style={{borderRadius: 40, 
                      height:"60px", 
                      padding:20, 
                      minWidth: 300,
                      marginBottom: 25}}/>
            </Form.Group>
            <div className="text-center">
              <Button disabled={loading} className="w;10" type="submit" 
              style={{backgroundColor: "#bd9dee",
                      borderColor: "white",
                      borderRadius: 25,
                      height:35,
                      fontSize: 15,
                      minWidth: 100}}>
                Log In
              </Button>
            </div>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link style={{color: "white"}} to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2"
           style={{color: "#efd5d1"}}>
        <b>Need an account? <Link to="/signup" style={{color: "#efd5d1"}}>Sign Up</Link></b>
      </div>
      <br />
    </>
  );
}
