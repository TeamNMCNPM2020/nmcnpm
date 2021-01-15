const router = require('express').Router();

router.get('/edit', function(req, res) {
  res.render('content_edit');
});

module.exports = router;