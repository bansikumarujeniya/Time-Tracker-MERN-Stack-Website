import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/LandingPage.css";
import heroImg from "../../assets/hero-img.png.webp";
import aboutImg from "../../assets/about-img.png.webp";
import adminFeatureImg from "../../assets/admin-dashboard.png";
import devTimeLogImg from "../../assets/developer-timelog.png";
import pmPanelImg from "../../assets/pm-panel.png";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";


const LandingPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "1. How does Time Tracker work?",
      answer:
        "Time Tracker allows project managers to assign tasks and track developer performance using time logs and reports.",
    },
    {
      question: "2. Who can use this app?",
      answer:
        "Anyone involved in team-based projects—Admins, Project Managers, and Developers—can use it to streamline workflows.",
    },
    {
      question: "3. Is there a report generation feature?",
      answer:
        "Yes, Admins can generate task-wise and project-wise reports using the dashboard.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="landing_page">
      {/* Header Section */}
      <header className="header_section">
        <div className="container-fluid">
          <nav className="navbar">
            <div className="navbar-left">
              <img
                src="/timer.png"
                alt="Time Tracker Logo"
                className="navbar-logo"
              />
              <span className="navbar-title">Time Tracker</span>
            </div>
            <div className="nav-links">
              <Link to="/login" className="btn-landing">
                Login
              </Link>
              <Link to="/register" className="btn-landing">
                Signup
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero_section">
        <div className="hero_container">
          <div className="hero_content">
            <h1>Track Your Time, Improve Productivity</h1>
            <p>
              Monitor projects, track progress, and manage tasks efficiently.
            </p>
            <div className="btn-group">
              <Link to="/register" className="btn-landing">
                Get Started
              </Link>
            </div>
          </div>
          <div className="hero_image">
            <img src={heroImg} alt="Time Tracking Dashboard" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about_section">
        <div className="about_container">
          <div className="about_image">
            <img src={aboutImg} alt="Team Collaboration" />
          </div>
          <div className="about_content">
            <h2>About Time Tracker</h2>
            <p>
              Our Time Tracking App helps teams stay organized by assigning
              tasks, tracking time, and generating insightful reports.
            </p>
            <Link to="/register" className="btn-landing">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq_section">
        <div className="faq_container">
          <h2 className="faq_title">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq_item ${openIndex === index ? "open" : ""}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq_question">
                <h4>{faq.question}</h4>
                <span className="faq_icon">
                  {openIndex === index ? "▲" : "▼"}
                </span>
              </div>
              <div
                className="faq_answer_wrapper"
                style={{
                  maxHeight: openIndex === index ? "300px" : "0px",
                }}
              >
                <p className="faq_answer">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Feature Section */}
      <section className="feature_section">
        <div className="feature_container">
          <h2 className="feature_title">Key Features</h2>
          {/* Feature 1 - Left */}
          <div className="feature_block">
            <div className="feature_image left">
              <img src={adminFeatureImg} alt="Admin Dashboard" />
            </div>
            <div className="feature_text">
              <h3>Admin Dashboard</h3>
              <p>Powerful overview with user controls, reports, and system insights.</p>
            </div>
          </div>

          {/* Feature 2 - Right */}
          <div className="feature_block reverse">
            <div className="feature_image right">
              <img src={devTimeLogImg} alt="Developer Time Log" />
            </div>
            <div className="feature_text">
              <h3>Developer Time Logs</h3>
              <p>Developers can view assigned tasks and log their working hours.</p>
            </div>
          </div>

          {/* Feature 3 - Left */}
          <div className="feature_block">
            <div className="feature_image left">
              <img src={pmPanelImg} alt="Project Manager Panel" />
            </div>
            <div className="feature_text">
              <h3>Project Manager Panel</h3>
              <p>Manage tasks, assign developers, and add the project in one place.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer_section">
        <div className="footer_container">
          <p>
            &copy; {new Date().getFullYear()} Time Tracker. All rights reserved.
          </p>
          <div className="social_icons">
            <a href="https://www.instagram.com/vrajesh.gajjar" target="_blank" rel="noopener noreferrer">
              <i><FaInstagram /></i>
            </a>
            <a href="https://github.com/bansikumarujeniya" target="_blank" rel="noopener noreferrer">
              <i><FaGithub /></i>
            </a>
            <a href="https://www.linkedin.com/in/bansikumar-ujeniya-48865b291" target="_blank" rel="noopener noreferrer">
              <i><FaLinkedin /></i>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
