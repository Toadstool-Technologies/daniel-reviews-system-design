const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReviewSchema = new Schema({
  product_id: Number,
  review_id: { type: Number, index: true },
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: { type: Date, default: Date.now },
  reviewer_name: { type: String, match: /[a-zA-Z]/ },
  helpfulness: { type: Number, default: 0 },
  photos: Array,
  reported: Boolean,
});

const MetaSchema = new Schema({
  product_id: Number,
  ratings: {
    type: Object,
    default: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  },
  recommended: {
    type: Object,
    default: {
      false: 0,
      true: 0,
    },
  },
  characteristics: {
    type: Object,
    default: {},
  },
});

module.exports = {
  ReviewTemplate: ReviewSchema,
  MetaTemplate: MetaSchema,
};
