const router = require('express').Router();
const queries = require('../db/queries');

router.get('/*', queries.findByProductId);
// router.get('/meta/*');
router.post('/', queries.postNewReview);

module.exports = router;
