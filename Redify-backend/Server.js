const express = require('express');
const cors = require('cors');
require("dotenv").config();
const DB = require('./DataBase');
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

app.listen(8000, () => {
  console.log('E-Book-Backend server is running ...');
});
