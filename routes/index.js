const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Index működik');
});

module.exports = router;
