import React, { useState, useRef, useEffect } from "react";
import "../styles/LoginPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import videoBg from "../assets/earth.mp4";

function LoginPage() {
  const navigate = useNavigate();
  const loginSectionRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    document.addEventListener('mousemove', moveCursor);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.body.removeChild(cursor);
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post("http://localhost:5000/api/auth/login", formData);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userEmail", formData.email);
        navigate("/home");
      } else {
        await axios.post("http://localhost:5000/api/auth/register", formData);
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(error.response?.data?.message || "Authentication error");
    }
  };

  const scrollToLogin = () => {
    loginSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="login-page">
      {/* Landing Section */}
      <section className="landing-section">
        <video autoPlay muted loop className="video-background">
          <source src={videoBg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="landing-content">
          <h1>News Summarizer</h1>
          <p>Less Clutter, More Clarity - News That Matters.</p>
          <button onClick={scrollToLogin} className="get-started-btn">Get Started</button>
        </div>
      </section>

      {/* Login Section */}
      <section ref={loginSectionRef} className="login-section">
        <div className="auth-container">
          {isLogin ? (
            <>
              <h2>Login to Your Account</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <button type="submit" className="login-button">
                  Login
                </button>
                
                <div className="auth-switch">
                  Don't have an account? <span onClick={() => setIsLogin(false)}>Sign Up</span>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2>Create Your Account</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <button type="submit" className="login-button">
                  Sign Up
                </button>
                
                <div className="auth-switch">
                  Already have an account? <span onClick={() => setIsLogin(true)}>Login</span>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default LoginPage; 