const { Review } = require('./index');

module.exports = {
  findByProductId: (req, res) => {
    let count = Infinity;
    let sort = '-date';
    // let page = 0;

    if (req.query.count) {
      count = req.query.count;
    }
    if (req.query.sort === 'helpful') sort = '-helpfulness';
    // gotta figure out how to handle relevant and page
    // if (req.query.sort === 'relevant') sort = '-relevant';
    // if (req.qeuery.page) page = req.query.page;
    Review.find({ product_id: req.query.product_id })
      .limit(count)
      .sort(sort)
      .catch((err) => {
        throw err;
      })
      .then((data) => {
        res.send(data);
      });
  },
  postNewReview: (req, res) => {
    const reviewData = req.body;
    let formattedDate;
    if (reviewData.date) formattedDate = (new Date(Number(reviewData.date))).toISOString();
    Review.create(new Review({
      product_id: reviewData.product_id,
      rating: reviewData.rating,
      date: formattedDate,
      summary: reviewData.summary,
      body: reviewData.body,
      recommend: reviewData.recommend,
      reported: reviewData.reported,
      reviewer_name: reviewData.reviewer_name,
      helpfulness: reviewData.helpfulness,
      photos: reviewData.photos || [],
      characteristics: reviewData.characteristics,
    }));
    res.send('review posted');
  },
};
