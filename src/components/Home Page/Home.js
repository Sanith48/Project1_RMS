import React from "react";
// import Image from "./../images/gkmit.jpeg";
//import Homepage from "./Homepage";
import Navbar from "../Navbar/Navbar";
import "./Home.css"

const Home = () => {
  return (
    <>
           <section id="hero">
          <div class="hero-container">
              <div className="hero-logo">
                  <img src={Image} alt="Busy"/>
              </div>
              <h1> Welcome To CHRIST Restaurant</h1>
              <h2>Have a great day</h2>
              <div class="actions">
                 <a href="/login" class="main-2"> Login </a>
                  <a href="/register" class="main-1">Register</a>
                 
              </div>
          </div>
      </section>
    </>
  );
};

export default Home;
