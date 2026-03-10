import { useState, useEffect } from "react";
import axios from "axios";
import SideNavbar from "../../Components/SideNavBar/SideNavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AddBook.css";

const AddBook = () => {
    const navigate = useNavigate();
    const [deleteBook, setDeleteBook] = useState(null);
    const [editBook, setEditBook] = useState(null);
    const [editData, setEditData] = useState({});


    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);


    const [myBooks, setMyBooks] = useState([]);
    const [loadingBooks, setLoadingBooks] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        category: "OTHER",
        language: "ENGLISH",
        publishedYear: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const uploadImage = async () => {
        const data = new FormData();
        data.append("image", imageFile);

        const res = await axios.post(
            "http://localhost:8000/image-upload",
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return res.data.url;
    };


    const fetchMyBooks = async () => {
        try {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("user");

            if (!token || !userData) {
                setMyBooks([]);
                return;
            }

            setLoadingBooks(true);

            const user = JSON.parse(userData);
            const userId = user._id || user.id;

            const res = await axios.get(
                `http://localhost:8000/books/user/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMyBooks(res.data);
        } catch (err) {

            console.error("Fetch books skipped:", err.message);
        } finally {
            setLoadingBooks(false);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            toast.error("Please upload a book image");
            return;
        }

        try {
            const imageUrl = await uploadImage();
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:8000/book",
                {
                    ...formData,
                    bookImage: imageUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Book added successfully!");
            fetchMyBooks();

            setTimeout(() => {
                navigate("/");
            }, 1200);
        } catch (err) {
            toast.error("Failed to add book");
        }
    };

    useEffect(() => {
        fetchMyBooks();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await axios.patch(
                `http://localhost:8000/book/${editBook._id}`,
                {
                    title: editData.title,
                    author: editData.author,
                    description: editData.description,
                    category: editData.category,
                    language: editData.language,
                    publishedYear: editData.publishedYear,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Book updated successfully ");

            setEditBook(null);
            setEditData({});
            fetchMyBooks();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to update book"
            );
        }
    };

    const handleDelete = async (bookId) => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8000/book/${bookId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Book deleted successfully ");

            setDeleteBook(null);
            fetchMyBooks();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to delete book"
            );
        }
    };



    return (
        <div className="addbook-page">
            <SideNavbar />

            <div className="addbook-content">
                <ToastContainer />

                <button className="addbook-btn" onClick={() => setShowModal(true)}>
                    + Add Book
                </button>
                <h1 className="head-text">My Library</h1>


                <div className="user-books">

                    {loadingBooks && <p>Loading...</p>}

                    {!loadingBooks && myBooks.length === 0 && (
                        <p>No books added yet.</p>
                    )}

                    {myBooks.map((book) => (
                        <div key={book._id} className="user-book-card">


                            <div className="user-book-actions">
                                <span
                                    className="icon-glass"
                                    onClick={() => {
                                        setEditBook(book);
                                        setEditData(book);
                                    }}
                                >
                                    <Pencil size={16} />
                                </span>

                                <span
                                    className="icon-glass delete"
                                    onClick={() => setDeleteBook(book)}
                                >
                                    <Trash2 size={16} />
                                </span>
                            </div>


                            <div className="book-image">
                                <img src={book.bookImage} alt={book.title} />
                            </div>


                            <div className="book-details">
                                <h3 className="book-title">{book.title}</h3>
                                <p className="book-author">by {book.author}</p>

                                <p className="book-description-user">{book.description}</p>


                            </div>
                        </div>
                    ))}
                </div>





                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-card">
                            <h2>Add New Book</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Book Title"
                                        onChange={handleChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="author"
                                        placeholder="Author"
                                        onChange={handleChange}
                                        required
                                    />
                                    <select name="category" onChange={handleChange}>
                                        <option disabled selected>Category</option>
                                        {[
                                            "FICTION",
                                            "NON-FICTION",
                                            "TECH",
                                            "EDUCATION",
                                            "BIOGRAPHY",
                                            "COMICS",
                                            "OTHER",
                                        ].map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    <select name="language" onChange={handleChange}>
                                        <option disabled selected>Language</option>
                                        {["ENGLISH", "MALAYALAM", "HINDI"].map((lang) => (
                                            <option key={lang} value={lang}>
                                                {lang}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-row">
                                    <input
                                        type="number"
                                        name="publishedYear"
                                        placeholder="Published Year"
                                        onChange={handleChange}
                                    />
                                    <textarea
                                        name="description"
                                        placeholder="Book Description"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="image-upload">
                                    <input type="file" onChange={handleImageChange} required />
                                    {preview && (
                                        <img src={preview} alt="Preview" className="preview-img" />
                                    )}
                                </div>

                                <div className="modal-actions">
                                    <button type="submit" className="submit-btn-add">
                                        Add Book
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                )}

                {deleteBook && (
                    <div className="modal-overlay">
                        <div className="modal-card-dlt glass-modal">
                            <h3 className="modal-title">Delete Book</h3>

                            <p className="modal-text">
                                Are you sure you want to delete
                                <span className="highlight"> {deleteBook.title}</span>?
                            </p>

                            <div className="modal-actions-dlt">
                                <button
                                    className="submit-btn-dlt danger"
                                    onClick={() => handleDelete(deleteBook._id)}
                                >
                                    Yes, Delete
                                </button>

                                <button
                                    className="cancel-btn"
                                    onClick={() => setDeleteBook(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {editBook && (
                    <div className="modal-overlay">
                        <div className="modal-card glass-modal">
                            <h3 className="modal-title">Edit Book</h3>

                            <form onSubmit={handleUpdate}>

                                <div className="form-row">
                                    <input
                                        type="text"
                                        value={editData.title || ""}
                                        placeholder="Title"
                                        onChange={(e) =>
                                            setEditData({ ...editData, title: e.target.value })
                                        }
                                        required
                                    />

                                    <input
                                        type="text"
                                        value={editData.author || ""}
                                        placeholder="Author"
                                        onChange={(e) =>
                                            setEditData({ ...editData, author: e.target.value })
                                        }
                                        required
                                    />
                                    <select
                                        value={editData.category}
                                        onChange={(e) =>
                                            setEditData({ ...editData, category: e.target.value })
                                        }
                                    >
                                        <option>FICTION</option>
                                        <option>NON-FICTION</option>
                                        <option>TECH</option>
                                        <option>EDUCATION</option>
                                        <option>BIOGRAPHY</option>
                                        <option>COMICS</option>
                                        <option>OTHER</option>
                                    </select>
                                    <select
                                        value={editData.language}
                                        onChange={(e) =>
                                            setEditData({ ...editData, language: e.target.value })
                                        }
                                    >
                                        <option>ENGLISH</option>
                                        <option>HINDI</option>
                                        <option>MALAYALAM</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={editData.publishedYear || ""}
                                        placeholder="PublishedYear"
                                        onChange={(e) =>
                                            setEditData({ ...editData, publishedYear: e.target.value })
                                        }
                                        required
                                    />
                                </div>



                                <div className="form-row">
                                    <textarea
                                        value={editData.description || ""}
                                        placeholder="Description"
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                description: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button type="submit" className="submit-btn-up">
                                        Update
                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setEditBook(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}



            </div>
        </div>
    );
};

export default AddBook;
