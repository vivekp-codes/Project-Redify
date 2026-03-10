import "./Home.css";
import SideNavbar from "../../Components/SideNavBar/SideNavBar";
import Footer from "../../Components/Footer/Footer"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestBook, setLatestBook] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const categories = [
    "ALL",
    "FICTION",
    "NON-FICTION",
    "TECH",
    "EDUCATION",
    "BIOGRAPHY",
    "COMICS",
    "OTHER",
    "AVAILABLE",
    "BORROWED",
  ];

  const fetchBooks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setBooks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get("https://redify-backend.onrender.com/book", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: search ? { search } : {},
      });

      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestBook = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(
        "https://redify-backend.onrender.com/book",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 1,
            page: 1,
          },
        }
      );

      if (Array.isArray(res.data) && res.data.length > 0) {
        setLatestBook(res.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLatestBook();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const filteredBooks = books.filter((book) => {
    if (selectedCategory === "ALL") return true;
    if (selectedCategory === "AVAILABLE") return book.status === "AVAILABLE";
    if (selectedCategory === "BORROWED") return book.status === "BORROWED";
    return book.category === selectedCategory;
  });

  return (
    <div className="home-page">
      <SideNavbar />

      <div className="home-container">
        <div className="row row-1-grid">

          <div className="left-column">


            {localStorage.getItem("token") && (
              <div className="search-wrapper">
                <div className="search-box">
                  <span className="material-icons search-icon">search</span>
                  <input
                    type="text"
                    placeholder="Search by book title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Latest Book */}
            {!localStorage.getItem("token") ? (
              <div>

              </div>
            ) : (
              <div className="latest-book card">
                {latestBook ? (
                  <>
                    <img
                      src={latestBook.bookImage || "https://via.placeholder.com/300"}
                      alt={latestBook.title}
                    />

                    <div className="latest-info">
                      <div className="tags">
                        <span className="tag">Latest Release</span>
                      </div>

                      <h2>{latestBook.title}</h2>

                      <p>
                        {latestBook.description
                          ? latestBook.description.slice(0, 1000) + ""
                          : "No description available"}
                      </p>

                      <button >
                        {latestBook.category}
                      </button>

                    </div>
                  </>
                ) : (
                  <p>Loading latest book...</p>
                )}
              </div>
            )}
          </div>


          {localStorage.getItem("token") && (
            <div className="right-column">
              <div className="community card">
                <h2>Join Readers Community</h2>
                <p>
                  Connect with book lovers from all over the world in one shared space.
                  Showcase your favorite books, explore diverse collections, and discover
                  titles recommended by readers like you. Build your personal library,
                  track what you love, and find inspiration for your next great read.
                </p>
                <button
                  className="join-btn"
                  onClick={() => navigate("/signup")}
                >
                  Go To SignUp
                </button>
              </div>
            </div>
          )}

        </div>



        {localStorage.getItem("token") ? (
          <div className="all-books">
            <h3>All Books</h3>

            {/* Categories */}
            <div className="categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <p>Loading books...</p>
            ) : filteredBooks.length === 0 ? (
              <p>No books available</p>
            ) : (
              <div className="books-grid">
                {filteredBooks.map((book) => (
                  <div className="book-card" key={book._id}>
                    <img
                      src={book.bookImage || "https://via.placeholder.com/300"}
                      alt={book.title}
                    />
                    <div className="book-overlay">
                      <h3>{book.title}</h3>
                      <span className="author">by {book.author}</span>
                      <button
                        className="details-btn"
                        onClick={() => navigate(`/book/${book._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="login-promo">
            <h2> Discover Amazing Books</h2>
            <p>
              Log in or create an account to explore, borrow, and share books with the community.
            </p>

            <button
              className="signup-btn"
              onClick={() => navigate("/SignUp")}
            >
              Create Your Free Account
            </button>
          </div>

        )}

      </div>
      <Footer/>
    </div>
  );
};

export default Home;
