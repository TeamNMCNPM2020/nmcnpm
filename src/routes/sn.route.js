const router = require('express').Router();

//TODO: multiple account
//Placeholder: need to access by account id 
router.get('/', function(req, res){
  res.render('profile');
});

router.get('/edit', function(req, res){
  res.render('profile_edit');
});

module.exports = router