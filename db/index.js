const mongoose = require('mongoose');
const { ReviewTemplate, MetaTemplate } = require('../db-designs/MongoSchema');

mongoose.connect('mongodb://localhost/reviews', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Review = mongoose.model('Review', ReviewTemplate);
const Metadata = mongoose.model('Metadata', MetaTemplate);

module.exports = {
  Review,
  Metadata,
};
