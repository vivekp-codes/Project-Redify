const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ['FICTION', 'NON-FICTION', 'TECH', 'EDUCATION', 'BIOGRAPHY','COMICS', 'OTHER' ],
      default: 'OTHER',
    },

    language: {
      type: String,
      enum: ['ENGLISH', 'MALAYALAM', 'HINDI'],
      default: 'ENGLISH',
    },

    bookImage: {
      type: String, 
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },

    status: {
      type: String,
      enum: ['AVAILABLE', 'REQUESTED', 'BORROWED'],
      default: 'AVAILABLE'
    },

    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    publishedYear: {
      type: Number,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
