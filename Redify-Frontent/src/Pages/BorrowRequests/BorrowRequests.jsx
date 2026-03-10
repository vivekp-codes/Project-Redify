import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNavbar from "../../Components/SideNavBar/SideNavBar";
import "./BorrowRequests.css";

const BorrowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const res = await axios.get(
        "https://redify-backend.onrender.com/borrow/my-requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(res.data);
    } catch (err) {
      toast.error("Failed to load borrow requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status pending";
      case "APPROVED":
        return "status approved";
      case "REJECTED":
        return "status rejected";
      case "RETURNED":
        return "status returned";
      default:
        return "status";
    }
  };

  return (
    <div className="borrow-page">
      <SideNavbar />

      <div className="borrow-content">
        <ToastContainer />
        <h1 className="page-title">My Borrow Requests</h1>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="empty">No borrow requests found.</p>
        ) : (
          <div className="borrow-grid">
            {requests.map((req) => (
              <div key={req._id} className="borrow-card">
                
                <img
                  src={req.book?.bookImage}
                  alt={req.book?.title}
                  className="book-img-brw"
                />

                
                <div className="borrow-main">
                  
                  <div className="borrow-info">
                    <h2>{req.book?.title}</h2>
                    <p className="author">by {req.book?.author}</p>

                    <span className={getStatusClass(req.status)}>
                      {req.status}
                    </span>

                    {req.status === "APPROVED" && req.returnDate && (
                      <p className="return-date">
                        Return Date:{" "}
                        {new Date(req.returnDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                 
                  <div className="owner-card">
                    <h4 className="owner-title">Owner <br /> Details</h4>

                    <div className="owner-row">
                      <img
                        src={req.owner?.profileImage || "/avatar.png"}
                        alt={req.owner?.name}
                        className="owner-img"
                      />

                      <div>
                        <h3>{req.owner?.name}</h3>
                        <p>{req.owner?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowRequests;
