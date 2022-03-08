const router = require('express').Router();
const queries = require('../db/queries');

router.get('/', queries.findByProductId);
router.get('/meta/*', queries.getMetaDataByProductId);

router.post('/', queries.postNewReview);

module.exports = router;
