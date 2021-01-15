const router = require('express').Router();

router.get('/', function(req, res) {
  res.render('mod_main', {
    layout: 'special_user_layout.hbs'
  });
});

module.exports = router;