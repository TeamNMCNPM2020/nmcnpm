const router = require('express').Router();

router.get('/login', function(req, res) {
  res.render('login', {
    layout: false
  });
});

module.exports = router;