/* eslint-disable quotes */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const request = require('supertest');
const app = require('./app');

// eslint-disable-next-line quotes
describe('can get a review by product id and post a review', () => {
  const GET_PATH = '/reviews/?product_id=309241';
  test(`GET ${GET_PATH}`, (done) => {
    request(app)
      .get('/reviews/?product_id=309241')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        res.body.product = 309241;
        res.body.page = 0;
        res.body.count = 5;
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  test('POST /reviews/', (done) => {
    request(app)
      .post('/reviews/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .send({
        product_id: 44466,
        rating: 5,
        summary: 'This is a great review',
        body: "Best I've ever seen at least. This review is unreal!",
        recommend: true,
        reviewer_name: 'daniel',
        characteristics: {
          Size: 5,
          Width: 5,
          Comfort: 4,
          Quality: 1,
        },
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});
