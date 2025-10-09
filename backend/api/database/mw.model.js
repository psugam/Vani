// backend/database/mw.model.js
const mongoose = require('mongoose');

const SenseSchema = new mongoose.Schema({
  type: { type: String },
  meaning: { type: String }
}, { _id: false });

const RelatedEntrySchema = new mongoose.Schema({
  headword: { type: String, required: true },
  headword_slp1: { type: String, required: true },
  senses: { type: [SenseSchema], default: [] }
}, { _id: false });

const mwSchema = new mongoose.Schema({
  headword: { type: String, required: true },
  headword_slp1: { type: String, required: true },
  senses: { type: [SenseSchema], default: [] },
  related_entries: { type: [RelatedEntrySchema], default: [] }
}, { collection: "mws" });

const MW = mongoose.model('mw', mwSchema);

module.exports = MW;
