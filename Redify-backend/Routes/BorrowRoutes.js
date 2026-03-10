const express = require('express');
const BorrowRequest = require('../DataBase/Models/BorrowRequestSchema');
const Book = require('../DataBase/Models/BookSchema');
const checkToken = require('../DataBase/MiddleWares/CheckTokenValidation');

const router = express.Router();


router.post(
  '/borrow/request/:bookId',
  checkToken(['USER', 'ADMIN']),
  async (req, res) => {
    try {
      const { bookId } = req.params;

      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      
      if (book.owner.toString() === req.user.id) {
        return res.status(400).json({ message: 'You cannot borrow your own book' });
      }

    
      const existingRequest = await BorrowRequest.findOne({
        book: bookId,
        requester: req.user.id,
        status: 'PENDING'
      });

      if (existingRequest) {
        return res.status(400).json({ message: 'Request already sent' });
      }


      
      if (book.status !== 'AVAILABLE') {
        return res.status(400).json({ message: 'Book is not available' });
      }

      const request = await BorrowRequest.create({
        book: bookId,
        requester: req.user.id,
        owner: book.owner
      });

      
      book.status = 'REQUESTED';
      book.currentRequest = request._id;
      await book.save();

      res.status(201).json({
        message: 'Borrow request sent',
        request
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);


router.get(
  '/borrow/requests',
  checkToken(['USER', 'ADMIN']),
  async (req, res) => {
    try {
      const requests = await BorrowRequest.find({ owner: req.user.id })
        .populate('book', 'title author bookImage')
        .populate('requester', 'name email profileImage')
        .sort({ createdAt: -1 });

      res.status(200).json(requests);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);


router.patch( 
  '/borrow/approve/:requestId',
  checkToken(['USER', 'ADMIN']),
  async (req, res) => {
    try {
      const { requestId } = req.params;
      const { returnDate } = req.body; // 👈 from frontend

      const request = await BorrowRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      if (request.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not allowed' });
      }

      const book = await Book.findById(request.book);

      if (!returnDate) {
        return res.status(400).json({ message: 'Return date is required' });
      }

      if (new Date(returnDate) <= new Date()) {
        return res
          .status(400)
          .json({ message: 'Return date must be in the future' });
      }

      request.status = 'APPROVED';
      request.returnDate = returnDate;
      await request.save();

      book.status = 'BORROWED';
      book.borrowedBy = request.requester;
      await book.save();

      await BorrowRequest.updateMany(
        {
          book: request.book,
          _id: { $ne: requestId },
          status: 'PENDING'
        },
        { status: 'REJECTED' }
      );

      res.status(200).json({ message: 'Borrow request approved' });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);



router.patch( 
  '/borrow/reject/:requestId',
  checkToken(['USER', 'ADMIN']),
  async (req, res) => {
    try {
      const { requestId } = req.params;

      const request = await BorrowRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      if (request.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not allowed' });
      }

      const book = await Book.findById(request.book);

      
      if (request.status !== 'PENDING') {
        return res
          .status(400)
          .json({ message: 'Only pending requests can be rejected' });
      }


      request.status = 'REJECTED';
      await request.save();

      book.status = 'AVAILABLE';
      book.currentRequest = null;
      book.borrowedBy = null;
      await book.save();

      res.status(200).json({ message: 'Borrow request rejected' });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);


router.patch(
  '/borrow/return/:requestId',
  checkToken(['USER', 'ADMIN']),
  async (req, res) => {
    try {
      const { requestId } = req.params;

      const request = await BorrowRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      if (request.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not allowed' });
      }

      const book = await Book.findById(request.book);
      if (request.status !== 'APPROVED') {
        return res
          .status(400)
          .json({ message: 'Book is not currently borrowed' });
      }

      request.status = 'RETURNED';
      await request.save();

      book.status = 'AVAILABLE';
      book.borrowedBy = null;
      book.currentRequest = null;
      await book.save();

      res.status(200).json({ message: 'Book returned successfully' });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);


router.get(
  '/borrow/my-requests',
  checkToken(['USER', 'ADMIN']),
  async (req, res) => {
    try {
      const requests = await BorrowRequest.find({
        requester: req.user.id
      })
        .populate('book', 'title author bookImage status')
        .populate('owner', 'name email profileImage ')
        .sort({ createdAt: -1 });

      res.status(200).json(requests);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);


module.exports = router;
