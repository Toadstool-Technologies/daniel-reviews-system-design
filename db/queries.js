const { Review, Metadata } = require('./index');

module.exports = {
  findByProductId: (req, res) => {
    let sort = '-date';
    if (req.query.sort === 'helpful') sort = '-helpfulness';
    Review.find({ product_id: req.query.product_id, reported: false })
      .sort(sort)
      .catch((err) => {
        res.status(500).send(err);
      })
      .then((data) => {
        const { page = 0, count = 5 } = req.query;
        const outgoing = {
          product: req.query.product_id,
          page: Number(page),
          count: Number(count),
          results: [],
        };
        const index = page > 0 ? (page - 1) * 5 : 0;
        let filteredData = data;
        if (page && count) {
          filteredData = data.slice(index, index + count);
        }
        if (page) filteredData = data.slice(index, count);
        if (count) filteredData = data.slice(0, count);

        filteredData.forEach((review) => {
          const { _id } = review;
          const formattedPhotos = [];
          review.photos.forEach((photo) => {
            formattedPhotos.push({
              id: photo.id,
              url: photo.url,
            });
          });
          outgoing.results.push({
            review_id: _id,
            rating: review.rating,
            summary: review.summary,
            recommend: review.recommend,
            response: review.response === 'null' ? null : review.response,
            body: review.body,
            date: review.date,
            reviewer_name: review.reviewer_name,
            helpfulness: review.helpfulness,
            photos: formattedPhotos,
          });
        });
        res.send(outgoing);
      });
  },
  getMetaDataByProductId: async (req, res) => {
    const id = req.query.product_id;
    const reviewData = await Review.find({ product_id: id })
      .catch((err) => {
        res.status(500).send(err);
      });
    const metaIncoming = await Metadata.find({ product_id: id })
      .catch((err) => {
        res.status(500).send(err);
      });
    const metaOutgoing = {
      product_id: id,
      ratings: {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      },
      recommended: {
        true: 0, false: 0,
      },
      characteristics: {},
    };

    Object.keys(metaIncoming[0].characteristics).forEach((charName) => {
      const current = metaIncoming[0].characteristics[charName];
      metaOutgoing.characteristics[charName] = { id: current.id, value: null };
    });

    reviewData.forEach((review) => {
      metaOutgoing.ratings[review.rating] += 1;
      metaOutgoing.recommended[String(review.recommend)] += 1;
      Object.entries(review.characteristics).forEach((char) => {
        const charName = char[0];
        const charVal = Number(char[1]);
        metaOutgoing.characteristics[charName].value += charVal / reviewData.length;
      });
    });
    res.status(200).send(metaOutgoing);
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
      reported: false,
      reviewer_name: reviewData.reviewer_name,
      helpfulness: reviewData.helpfulness,
      photos: reviewData.photos || [],
      characteristics: reviewData.characteristics,
    }));
    res.send('review posted');
  },
};
