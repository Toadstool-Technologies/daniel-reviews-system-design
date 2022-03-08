const request = require('supertest');
const assert = require('assert');
const express = require('express');

const app = express();

app.get('/reviews/', (req, res) => {
  res.status(200).json({ product_id: 309241 });
});

request(app)
  .get('/reviews/')
  .expect('Content-Type', /json/)
  .expect(200)
  .end((err) => {
    if (err) throw err;
  });
