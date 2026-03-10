const express = require('express');
const Book = require('../DataBase/Models/BookSchema');
const checkToken = require('../DataBase/MiddleWares/CheckTokenValidation');
const mongoose = require('mongoose');

const router = express.Router();


router.post('/book',
    checkToken(['USER', 'ADMIN']),
    async (req, res) => {
        try {
            const book = await Book.create({
                ...req.body,
                owner: req.user.id,
            });

            return res.status(201).json({
                message: 'Book added successfully',
                book,
            });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
);


router.get('/book', checkToken(['USER', 'ADMIN']), async (req, res) => {
    try {
        const { search, category, language, status, page = 1, limit = 100 } = req.query;

        const query = {};

        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) query.category = category;
        if (language) query.language = language;
        if (status) query.status = status;

        const books = await Book.find(query)
            .populate('owner', 'name email')
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.status(200).json(books);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});




router.get('/book/:id',
    checkToken(['USER', 'ADMIN']),
    async (req, res) => {
        try {
            const book = await Book.findById(req.params.id)
                .populate('owner', 'name email profileImage address')
                .populate('borrowedBy', 'name email');

            res.status(200).json(book);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
);


router.patch('/book/:id',
    checkToken(['USER', 'ADMIN']),
    async (req, res) => {
        try {
            const book = await Book.findById(req.params.id);

            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }

            if (book.owner.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not allowed' });
            }

            const updatedBook = await Book.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            res.json({ message: 'Book updated', updatedBook });

        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
);


router.delete('/book/:id',
    checkToken(['USER', 'ADMIN']),
    async (req, res) => {
        try {
            const book = await Book.findById(req.params.id);

            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }

            if (
                book.owner.toString() !== req.user.id &&
                req.user.role !== 'ADMIN'
            ) {
                return res.status(403).json({ message: 'Not allowed' });
            }

            await Book.findByIdAndDelete(req.params.id);
            res.json({ message: 'Book deleted successfully' });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }


);


router.get('/books/user/:userId',
    checkToken(['USER', 'ADMIN']),
    async (req, res) => {
        try {
            const { userId } = req.params;

            
            const books = await Book.find({ owner: userId })
                .populate('owner', 'name email')
                .sort({ createdAt: -1 });


            if (!books.length) {
                return res.status(404).json({ message: 'No books found for this user' });
            }

            res.status(200).json(books);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
);


module.exports = router;
