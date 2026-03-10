require("dotenv").config();
const express = require('express');
const cors = require('cors');
const DB = require('./DataBase/Index');
const UserRoutes = require('./Routes/UserRoutes');
const ImageRoutes = require('./Routes/ImageRoutes');
const BookRouters = require('./Routes/BookRoutes');
const BorrowRoutes = require('./Routes/BorrowRoutes');

const app = express();

app.use(cors());
app.use(express.json());




app.use(UserRoutes);
app.use(ImageRoutes);
app.use(BookRouters);
app.use(BorrowRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`E-Book-Backend server is running on port ${PORT}`);
});
