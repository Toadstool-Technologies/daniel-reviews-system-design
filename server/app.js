const express = require('express');
const routes = require('./router');

const app = express();

app.use(express.json());
app.use('/reviews', routes);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

module.exports = app;
