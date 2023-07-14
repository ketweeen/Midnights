import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import './App.css';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // for google login
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      navigate("/");
    });
  };

  // const signInWithGoogle = async () => {
  //   try {
  //     const res = await signInWithPopup(auth, provider);
  //     const user = res.user;
  //     const q = query(collection(db, "users"), where("uid", "==", user.uid));
  //     const docs = await getDocs(q);
  //     if (docs.docs.length === 0) {
  //       await addDoc(collection(db, "users"), {
  //         uid: user.uid,
  //         name: user.displayName,
  //         authProvider: "google",
  //         email: user.email,
  //       });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert(err.message);
  //   }
  // };

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
      <Card style={{ backgroundColor: "transparent", border: 0 }}>
        <Card.Body>
          {/* log in header */}
          <h2
            className="text-center mb-4 sunflower-font"
            style={{
              fontSize: 23,
              color: "#bd9dee",
              backgroundColor: "white",
              opacity: 0.9,
              padding: 5
            }}
          >
          ⥼ discover your finest creations ⥽
          </h2>

          {/* google log in */}
          <div className="text-center">
            <button
              className="login-with-google-btn"
              onClick={signInWithGoogle}
              style={{
                backgroundColor: '#bd9dee',
                border:'solid white 1.75px',
                color: "white",
                fontSize: 15,
                borderRadius: 40,
                height: "60px",
                padding: 10,
                minWidth: 300,
                marginBottom: 15,
                marginTop: 15,
              }}
            >
              <img 
                src="https://ragsdalemartin.com/wp-content/uploads/2020/07/white-google-logo.png"
                style={{
                  height: 30,
                  paddingRight: 15,
                }}/>
              Sign in with Google
            </button>
          </div>
          <br />

          {/* adding something stupid here*/}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, backgroundColor: "white", height: "3px" }} />

            <p style={{ margin: "0 10px", color: "white" }}>
              Or Sign in with Email
            </p>

            <div style={{ flex: 1, backgroundColor: "white", height: "3px" }} />
          </div>
          {/*stupidity ends */}

          {/*email and password fill up */}
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
            {/* log in button */}
            <div className="text-center">
              <Button
                disabled={loading}
                className="w;10"
                type="submit"
                style={{
                  backgroundColor: "#bd9dee",
                  borderColor: "white",
                  borderRadius: 25,
                  height: 35,
                  fontSize: 15,
                  minWidth: 100,
                }}
              >
                Log In
              </Button>
            </div>

            {/* forget password */}
            <div className="w-100 text-center mt-3">
              <Link style={{ color: "white" }} to="/forgot-password">
                Forgot Password?
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2" style={{ color: "#efd5d1" }}>
        <b>
          Need an account?{" "}
          <Link to="/signup" style={{ color: "#efd5d1" }}>
            Sign Up
          </Link>
        </b>
      </div>
      <br />
    </>
  );
}
