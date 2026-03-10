import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SideNavbar.css";

const SideNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const popupRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [user, setUser] = useState({
    name: "Guest",
    email: "guest@example.com",
    profileImage:
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      let profileImg = parsedUser.profileImage;

      if (!profileImg) {
        profileImg =
          "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
      }

      setUser({
        name: parsedUser.name || "Guest",
        email: parsedUser.email || "guest@example.com",
        profileImage: profileImg,
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE HAMBURGER */}
      <div className="mobile-hamburger" onClick={() => setIsOpen(true)}>
        <span className="material-symbols-outlined">menu</span>
      </div>

      {/* OVERLAY */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      {/* SIDEBAR */}
      <div className={`side-navbar ${isOpen ? "open" : ""}`}>
        <div className="window-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>


        <div className="logo">
          <span className="logo-text">
            <span className="logo-e">R</span>eadify
          </span>
        </div>

        <div className="divider" />

        <div className={`item ${location.pathname === "/" ? "active" : ""}`} onClick={() => handleNavigate("/")}>
          <span className="material-symbols-outlined">home</span>
          <span>Home</span>
        </div>

        <div className={`item ${location.pathname === "/AddBook" ? "active" : ""}`} onClick={() => handleNavigate("/AddBook")}>
          <span className="material-symbols-outlined">book</span>
          <span>Add Book</span>
        </div>

        <div className={`item ${location.pathname === "/borrow-notification" ? "active" : ""}`} onClick={() => handleNavigate("/borrow-notification")}>
          <span className="material-symbols-outlined">notifications</span>
          <span>Notifications</span>
        </div>

        <div className={`item ${location.pathname === "/borrow-requests" ? "active" : ""}`} onClick={() => handleNavigate("/borrow-requests")}>
          <span className="material-symbols-outlined">swap_horiz</span>
          <span>Borrow Requests</span>
        </div>

        <div className="user-wrapper" ref={popupRef}>
          <div className="user" onClick={() => setShowPopup(!showPopup)}>
            <img src={user.profileImage} alt="user" />
            <div className="user-info">
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
          </div>

          {showPopup && (
            <div className="user-popup">
              <button onClick={() => handleNavigate("/profile")}>
                <span className="material-symbols-outlined added-symbols icons-sidenav">person</span>
                <span className="side-pop-txt">View Profile</span>
              </button>

              <button className="logout-btn" onClick={handleLogout}>
                <span className="material-symbols-outlined added-symbols icons-sidenav">logout</span>
                <span className="side-pop-txt">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideNavbar;
