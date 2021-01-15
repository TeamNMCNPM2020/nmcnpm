const router = require('express').Router();

router.get('/edit', function (req, res) {
  res.render('content_edit');
});

router.get('/:id', function (req,res) {
  res.render('content');
});

module.exports = router;