import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNavbar from "../../Components/SideNavBar/SideNavBar";
import "./ViewBook.css";

const ViewBook = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchBook();
    }, []);

    const fetchBook = async () => {
        try {
            const res = await axios.get(`https://redify-backend.onrender.com/book/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBook(res.data);
        } catch {
            toast.error("Failed to load book");
        } finally {
            setLoading(false);
        }
    };

    const sendBorrowRequest = async () => {
        try {
            setBtnLoading(true);
            await axios.post(
                `https://redify-backend.onrender.com/borrow/request/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Borrow request sent");
            fetchBook();
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setBtnLoading(false);
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (!book) return null;

    const isOwner = book.owner._id === userId;

    return (
        <div className="view-book-page">
            <SideNavbar />
            <ToastContainer />

            <div className="view-book-card">
                
                <div className="book-main">
                   
                    <div className="book-image-card">
                        <img src={book.bookImage} alt={book.title} />
                    </div>

                   
                    <div className="book-info">
                        
                        <h1>{book.title}</h1>
                        <h3>by {book.author}</h3>

                        <p className="description">{book.description}</p>

                        <div className="meta">
                            <span> {book.category}</span>
                            <span> {book.language}</span>
                            <span> {book.publishedYear}</span>
                        </div>
                        <div className="action-section">
                    <span className={`status ${book.status.toLowerCase()}`}>
                        {book.status}
                    </span>

                    {isOwner ? (
                        <p className="warning"> This is your book</p>
                    ) : book.status === "AVAILABLE" ? (
                        <button onClick={sendBorrowRequest} disabled={btnLoading}>
                            {btnLoading ? "Sending..." : "Borrow Book"}
                        </button>
                    ) : (
                        <p className="info">Book not available</p>
                    )}
                </div>
                    </div>
                    
                </div>

            
                <div className="owner-section">
                    <h1>Owner Details</h1>
                    <img
                        src={
                            book.owner.profileImage ||
                            "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                        }
                        alt="Owner"
                    />

                    <div className="owner-info">
                        <h4>{book.owner.name}</h4>
                        <p>{book.owner.email}</p>

                        {book.owner.address && (
                            <p className="address">
                                {book.owner.address.houseName},{" "}
                                {book.owner.address.city},{" "}
                                {book.owner.address.district} -{" "}
                                {book.owner.address.pincode}
                            </p>
                        )}
                    </div>
                </div>

               
            </div>
        </div>
    );
};

export default ViewBook;
