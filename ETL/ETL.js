const mongoose = require('mongoose');
const parse = require('csv-parser');
const fs = require('fs');
const { Review, Metadata } = require('../db/index');

const REVIEWS_PATH = 'ETL/csv_data/reviews.csv';
const REVIEWS_PHOTOS_PATH = 'ETL/csv_data/reviews_photos.csv';

mongoose.connect('mongodb://localhost/reviews', {
  useNewUrlParser: true,
});

let batch = [];
const photoData = {};

// Parse Photo Data
fs.createReadStream(REVIEWS_PHOTOS_PATH)
  .on('error', (err) => {
    throw err;
  })
  .pipe(parse({ delimiter: ',' }))
  .on('data', (rowData) => {
    const reviewId = rowData.review_id;
    if (photoData.reviewId) {
      photoData[reviewId].push(rowData);
    } else {
      photoData[reviewId] = [rowData];
    }
  })
  .on('end', () => {
    console.log('photos parsed... parsing reviews');
    // Parse and store review data
    fs.createReadStream(REVIEWS_PATH)
      .on('error', (err) => {
        throw err;
      })
      .pipe(parse({ delimiter: ',' }))
      .on('data', async (rowData) => {
        batch.push(new Review({
          id: rowData.id,
          product_id: rowData.product_id,
          rating: rowData.rating,
          date: (new Date(Number(rowData.date))).toISOString(),
          summary: rowData.summary,
          body: rowData.body,
          recommend: rowData.recommend,
          reported: rowData.reported,
          reviewer_name: rowData.reviewer_name,
          helpfulness: rowData.helpfulness,
          photos: photoData[rowData.id],
        }));
        if (batch.length === 100000) {
          console.log('storing batch....');
          Review.insertMany(batch);
          batch = [];
        }
      })
      .on('end', () => {
        Review.insertMany(batch)
          .then(() => {
            mongoose.connection.close();
            console.log('done');
          });
      });
  });

/*
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
*/
