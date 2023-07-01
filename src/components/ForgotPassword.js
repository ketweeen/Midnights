import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <>
      <Card style={{backgroundColor: 'transparent', border: 0}}>
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
              Reset password with Email
            </p>

            <div style={{ flex: 1, backgroundColor: "white", height: "3px" }} />
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
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
                      marginTop: 15,
                      marginBottom: 15,
                    }}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="text-center">
              <Button disabled={loading} className="w;10" type="submit" 
              style={{backgroundColor: "#bd9dee",
                      borderColor: "white",
                      borderRadius: 25,
                      height:35,
                      fontSize: 15,
                      minWidth: 100}}>
                Reset Password
              </Button>
            </div>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link style={{color: "white"}} to="/login">Back to Login</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2"
       style={{color: "#efd5d1"}}>
      <b>Need an account? <Link to="/signup" style={{color: "#efd5d1"}}>Sign Up</Link></b>
      </div>
    </>
  );
}
