/* eslint-disable no-console */
const mongoose = require('mongoose');
const parse = require('csv-parser');
const fs = require('fs');
const { Review, Metadata } = require('../db/index');

const REVIEWS_PATH = './csv_data/reviews.csv';
const REVIEWS_PHOTOS_PATH = './csv_data/reviews_photos.csv';
const CHARACTERISTICS_PATH = './csv_data/characteristics.csv';
const CHAR_REVIEWS_PATH = './csv_data/characteristic_reviews.csv';

mongoose.connect('mongodb://localhost/reviews', {
  useNewUrlParser: true,
});

let lastProductId;
let lastProductMeta;
let batch = [];
const charMetas = {};
const charMetaArray = [];
const photoData = {};
const characteristics = {};
const charReviews = {};

const pushToArrayIfProductIdHasChanged = (product, currentProductId, prevProductId) => {
  if (!prevProductId) return;
  if (currentProductId !== prevProductId) {
    charMetaArray.push({
      product_id: prevProductId,
      characteristics: product,
    });
  }
};

// Parse characteristics data
fs.createReadStream(CHARACTERISTICS_PATH)
  .on('error', (err) => {
    throw err;
  })
  .pipe(parse({ delimiter: ',' }))
  .on('data', (rowData) => {
    // POPULATE CHAR OBJECT
    const currentProductId = rowData.product_id;
    characteristics[rowData.id] = { name: rowData.name };
    characteristics[rowData.id].productId = rowData.product_id;

    if (!charMetas[rowData.product_id]) charMetas[rowData.product_id] = {};
    charMetas[rowData.product_id][rowData.name] = {
      id: rowData.id,
      value: null,
    };

    pushToArrayIfProductIdHasChanged(
      charMetas[lastProductId],
      currentProductId,
      lastProductId,
    );

    lastProductId = rowData.product_id;
    lastProductMeta = [rowData.product_id, charMetas[rowData.product_id]];
  })
  .on('end', () => {
    Metadata.insertMany(charMetaArray)
      .then(() => {
        Metadata.create({
          product_id: lastProductMeta[0],
          characteristics: lastProductMeta[1],
        });
        console.log('finished inserting Metadata');
      });
    console.log('characteristics object populated.... matching to reviews');
    fs.createReadStream(CHAR_REVIEWS_PATH)
      .on('error', (err) => {
        throw err;
      })
      .pipe(parse({ delimiter: ',' }))
      .on('data', (rowData) => {
        // POPULATE CHAR REVIEWS OBJECT
        const charId = rowData.characteristic_id;
        const reviewId = rowData.review_id;

        if (!charReviews[reviewId]) charReviews[reviewId] = {};
        charReviews[reviewId][characteristics[charId].name] = rowData.value;
      })
      .on('end', () => {
        console.log('characteristics reviews object populated.... populating photos object');
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
            fs.createReadStream(REVIEWS_PATH)
              .on('error', (err) => {
                throw err;
              })
              .pipe(parse({ delimiter: ',' }))
              .on('data', async (rowData) => {
                const reviewLink = rowData.id;
                batch.push(new Review({
                  review_id: reviewLink,
                  product_id: rowData.product_id,
                  rating: rowData.rating,
                  date: (new Date(Number(rowData.date))).toISOString(),
                  summary: rowData.summary,
                  response: rowData.response,
                  body: rowData.body,
                  recommend: rowData.recommend,
                  reported: rowData.reported,
                  reviewer_name: rowData.reviewer_name,
                  helpfulness: rowData.helpfulness,
                  photos: photoData[rowData.id],
                  characteristics: charReviews[reviewLink],
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
