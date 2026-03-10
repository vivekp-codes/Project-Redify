import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleKeyDown = (e, nextRef, submit = false) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (submit) {
        handleSubmit(e);
      } else if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("https://redify-backend.onrender.com/user/login", {
        email: formData.email,
        password: formData.password,
      });

      toast.success(res.data.message);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <ToastContainer />

      <div className="login-card">

        {/* <div className="left-section image-section">
          <img
            className="side-image"
            src="/Images/lib-poster.png"
            alt="Books"
          />
        </div> */}


        <div className="right-section-login form-section">

          <div className="window-dots-log">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>

          <div className="form-part">
            <div className="login-header">
              <h1>
                Welcome back to <span className="logo-e">R</span>
                <span className="logo-balance">eadify</span>
              </h1>
              <p>Login to continue reading your favorite books</p>
            </div>


            <form className="login-form" onSubmit={handleSubmit}>
              <input
                ref={emailRef}
                type="email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              />
              <input
                className="pass"
                ref={passwordRef}
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, null, true)}
              />

              <div className="action-buttons-log">
                <button
                  type="button"
                  className="login-btn-sig"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>

                <button className="login-btn-log" type="submit" disabled={loading}>
                  {loading ? <div className="button-loader"></div> : "Login"}
                </button>
              </div>



            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
