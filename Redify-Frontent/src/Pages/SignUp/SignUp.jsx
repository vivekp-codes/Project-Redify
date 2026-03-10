import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    house: "",
    city: "",
    district: "",
    pincode: "",
    profileImage: null,
  });
  const [preview, setPreview] = useState(null);


  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const houseRef = useRef(null);
  const cityRef = useRef(null);
  const districtRef = useRef(null);
  const pincodeRef = useRef(null);


  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    const data = new FormData();
    data.append("image", file);

    try {
      const res = await axios.post("http://localhost:8000/image-upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData({ ...formData, profileImage: res.data.url });
      toast.success("Profile image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/user/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        address: {
          houseName: formData.house,
          city: formData.city,
          district: formData.district,
          pincode: formData.pincode,
        },
        profileImage: formData.profileImage,
      });

      toast.success(res.data.message);

      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <ToastContainer />
      <div className="signup-card">
        <div className="left-section">
          <div className="window-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>

          <div className="signup-header">
            <h1>
              Join <span className="logo-e">R</span>
              <span className="logo-balance">eadify</span>
            </h1>
            <p>Create your account to explore books</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>

            {/* ROW 1 : ACCOUNT DETAILS */}
            <div className="form-row two-col">
              <input
                ref={nameRef}
                type="text"
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, emailRef)}
              />
              <input
                ref={emailRef}
                type="email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              />
            </div>

            <div className="form-row two-col">
              <input
                ref={passwordRef}
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, confirmRef)}
              />
              <input
                ref={confirmRef}
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, houseRef)}
              />
            </div>

            {/* ROW 2 : ADDRESS */}
            <div className="form-row four-col">
              <input
                ref={houseRef}
                type="text"
                placeholder="House Name"
                name="house"
                value={formData.house}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, cityRef)}
              />
              <input
                ref={cityRef}
                type="text"
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, districtRef)}
              />
              <input
                ref={districtRef}
                type="text"
                placeholder="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, pincodeRef)}
              />
              <input
                ref={pincodeRef}
                type="text"
                placeholder="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>

            {/* ROW 3 : PROFILE IMAGE */}
            <div className="profile-upload-card">
              <label className="upload-box">
                {preview ? (
                  <img src={preview} alt="Profile Preview" />
                ) : (
                  <span>Upload Profile Image</span>
                )}
                <input type="file" hidden onChange={handleImageChange} />
              </label>
            </div>

            {/* SOCIAL LOGIN (DUMMY) */}
            

            {/* ACTION BUTTONS */}
            <div className="action-buttons">
              <button
                type="button"
                className="login-btn-sig"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button className="signup-btn" type="submit" disabled={loading}>
                {loading ? <div className="button-loader"></div> : "Sign Up"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
