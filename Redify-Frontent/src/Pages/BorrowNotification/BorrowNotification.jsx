import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNavbar from "../../Components/SideNavBar/SideNavBar";
import "./BorrowNotification.css";

const BorrowNotification = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [returnDate, setReturnDate] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOwnerRequests();
  }, []);

  const fetchOwnerRequests = async () => {
    try {
      const res = await axios.get(
        "https://redify-backend.onrender.com/borrow/requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(res.data);
    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const openApproveModal = (req) => {
    setSelectedRequest(req);
    setReturnDate("");
    setShowModal(true);
  };

  const approveRequest = async () => {
    if (!returnDate) {
      toast.error("Please select return date");
      return;
    }

    try {
      await axios.patch(
        `https://redify-backend.onrender.com/borrow/approve/${selectedRequest._id}`,
        { returnDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Request approved");
      setShowModal(false);
      fetchOwnerRequests();
    } catch {
      toast.error("Approval failed");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await axios.patch(
        `https://redify-backend.onrender.com/borrow/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Request rejected");
      fetchOwnerRequests();
    } catch {
      toast.error("Rejection failed");
    }
  };

  const markAsReturned = async (requestId) => {
    try {
      await axios.patch(
        `https://redify-backend.onrender.com/borrow/return/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Book marked as returned");
      fetchOwnerRequests();
    } catch {
      toast.error("Failed to mark book as returned");
    }
  };


  return (
    <div className="owner-page">
      <SideNavbar />
      <div className="owner-content">
        <ToastContainer />
        <h2 className="page-title">Borrow Requests</h2>

        {requests.length === 0 ? (
          <p className="empty">No borrow requests</p>
        ) : (
          <div className="borrow-grid">
            {requests.map((req) => (
              <div key={req._id} className="borrow-card">
                
                <img
                  src={req.book?.bookImage}
                  alt={req.book?.title}
                  className="book-img"
                />

                
                <div className="borrow-main">
                 
                  <div className="borrow-info">
                    <h2>{req.book?.title}</h2>

                    <span className={`status ${req.status}`}>
                      {req.status}
                    </span>
                  </div>

                  
                  <div className="owner-card">
                    <h4 className="owner-title">
                      Requester <br />Details
                    </h4>

                    <div className="owner-row">
                      <img
                        src={req.requester?.profileImage || "/avatar.png"}
                        alt={req.requester?.name}
                        className="owner-img"
                      />

                      <div>
                        <h3>{req.requester?.name}</h3>
                        <p>{req.requester?.email}</p>
                      </div>
                    </div>
                  </div>


                
                  {req.status === "APPROVED" && (
                    <div className="return-section">
                      <p className="return-date">
                        <b>Return Date:</b>{" "}
                        {req.returnDate
                          ? new Date(req.returnDate).toLocaleDateString()
                          : "Not set"}
                      </p>

                      <button
                        className="return-btn"
                        onClick={() => markAsReturned(req._id)}
                      >
                        Mark as Returned
                      </button>
                    </div>
                  )}

                  
                  {req.status === "PENDING" && (
                    <div className="actions">
                      <button
                        className="approve"
                        onClick={() => openApproveModal(req)}
                      >
                        Approve
                      </button>
                      <button
                        className="reject"
                        onClick={() => rejectRequest(req._id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     
      {showModal && (
        <div className="modal-date">
          <div className="modal-box">
            <h3>Select Return Date</h3>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
            <div className="modal-actions">
              <button className="approve-modal" onClick={approveRequest}>
                Confirm
              </button>
              <button className="reject-modal" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowNotification;
