import React from "react";
import Signup from "./Signup";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
// import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import CreateEntry from "./CreateEntry";
import ViewPast from "./ViewPast";
import AllOne from "./AllOne";
import ViewTrend from "./ViewTrend";

import background from "./img/background.png";
import "./App.css";
// import donutElement from "./img/donut_element-removebg-preview.png";
// import fullSphereElement from "./img/full_sphere_element-removebg-preview.png";
// import halfSphereElement from "./img/half_sphere_element-removebg-preview.png";

function App() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        padding: 75,
      }}
    >
      <div className="w-100" style={{ minWidth: "500px", maxWidth: "600px" }}>
        <h1
          className="d-flex align-items-center justify-content-center titlefont"
          style={{ color: "white", fontSize: 60 }}
        >
          ✦ midnights ✦
        </h1>
        
        <Router>
          <AuthProvider>
            <Routes>
              {/* <Route
                path="/"
                element={<PrivateRoute component={Dashboard} />}
              /> */}
              <Route path="/" element={<Dashboard />} />
              {/* <Route
                path="/update-profile"
                element={<PrivateRoute component={UpdateProfile} />}
              /> */}
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/create-entry" element={<CreateEntry />} />
              <Route path="/view-past" element={<ViewPast />} />
              <Route path="/all-one" element={<AllOne />} />
              <Route path="/view-trend" element={<ViewTrend />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </AuthProvider>
        </Router>
        {/* <div className="d-flex justify-content-center">
          <img src={donutElement} style={{height: 100, minWidth:150, marginTop: 10}} />
          <img src={fullSphereElement} style={{height: 100, minWidth: 150, marginTop: 10}} />
          <img src={halfSphereElement} style={{height: 100, minWidth: 150, marginTop: 10}}/>
        </div>
          */}
      </div>
    </Container>
  );
}

export default App;
