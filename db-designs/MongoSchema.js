const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReviewSchema = new Schema({
  id: Number,
  review_id: Number,
  product_id: { type: Number, index: true },
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: { type: Date, default: Date.now },
  reviewer_name: { type: String, match: /[a-zA-Z]/ },
  helpfulness: { type: Number, default: 0 },
  photos: Array,
  reported: { type: Boolean, default: false },
  characteristics: Object,
});

const MetaSchema = new Schema({
  product_id: Number,
  characteristics: {
    type: Object,
    default: {},
  },
});

module.exports = {
  ReviewTemplate: ReviewSchema,
  MetaTemplate: MetaSchema,
};
