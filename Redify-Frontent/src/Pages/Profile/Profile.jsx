import { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from '../../Components/SideNavBar/SideNavBar'
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://redify-backend.onrender.com/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="profile-loading">Loading profile...</div>;

  const { user, stats, books } = profile;

  return (
    <div className="profile-page">
      {/* Profile Card */}
      <SideNavbar />
      <div className="profile-card-pro glass">
        {/* Row 1 */}
        <div className="profile-row row-1">
          <div className="profile-left">
            <img
              src={user.profileImage || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"}
              alt="profile"
              className="profile-avatar"
            />
          </div>

          <div className="profile-right">
            <h2>{user.name}</h2>
            <div className="profile-stats">
              <div className="stat">
                <h3>{stats.totalAddedBooks}</h3>
                <span>Books Added</span>
              </div>
              <div className="stat">
                <h3>{stats.totalBorrowedBooks}</h3>
                <span>Books Borrowed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="profile-row row-2">
          <p className="email">{user.email}</p>
          {user.address && (
            <p className="address">
              {user.address.houseName}, {user.address.city}, {user.address.district} - {user.address.pincode}
            </p>
          )}
        </div>
      </div>


      {/* Books Grid */}
      <div className="profile-books glass">
        <h3>Your Books</h3>

        <div className="books-grid-profile">
          {books.map((book) => (
            <img
              key={book._id}
              src={book.bookImage}
              alt={book.title}
              title={book.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
