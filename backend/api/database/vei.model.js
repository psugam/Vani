// models/Entry.js
const mongoose = require('mongoose');

const RelatedSchema = new mongoose.Schema({
  id: String,
  word_slp1: String,
  word_iast: String,
  word_devanagari: String,
  type: String,
  meanings: [
    {
      gender: String,
      definition: String,
    },
  ],
  related: [], // recursive, but we usually stop at 1 level
});

const EntrySchema = new mongoose.Schema({
  id: { type: String, index: true },
  word_slp1: String,
  word_iast: { type: String, index: true },
  word_devanagari: String,
  type: String,
  meanings: [
    {
      gender: String,
      definition: String,
    },
  ],
  related: [RelatedSchema],
});

const Vei = mongoose.model('vei', EntrySchema);

module.exports = Vei;
