import { Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home/Home";
import SignUp from "./Pages/SignUp/SignUp"
import Login from './Pages/Login/Login';
import AddBook from './Pages/AddBook/AddBook'
import ViewBook from './Pages/ViewBook/ViewBook'
import BorrowRequest from './Pages/BorrowRequests/BorrowRequests'
import BorrowNotification from './Pages/BorrowNotification/BorrowNotification'
import Profile from './Pages/Profile/Profile';


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/AddBook' element={<AddBook />} />
        <Route path="/book/:id" element={<ViewBook />} />
        <Route path="/borrow-requests" element={<BorrowRequest />} />
        <Route path="/borrow-notification" element={<BorrowNotification />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default App;
