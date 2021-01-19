const router = require('express').Router();
const serviceUser = require('../models/model_service/user_service');
const serviceReaction = require('../models/model_service/reaction_service');
const bcrypt = require('bcrypt');

//TODO: multiple account
//Placeholder: need to access by account id 
router.get('/', async function(req, res){
  res.redirect(`/u/${req.session.authUser._id}`)
});


router.get('/edit', async function(req, res){
  const code = (+req.query.code) || 0;
  const message = [
    'no err',
    'Update success!',
    'Wrong password',
    'Error'
  ]
  const UID = req.session.authUser._id;
  const result = await serviceUser.singleByID(UID);

  res.render('profile_edit', {
    account: result,
    message: (code == 0)?null:message[code]
  });
});

router.post('/edit', async function(req, res){
  //console.log(req.body);
  const account = {
    _id: req.body._id,
    FullName: req.body.FullName
  }
  //console.log(account);
  const result = await serviceUser.patchInfo(account);
  const updated = await serviceUser.singleByID(req.session.authUser._id);

  //Update user session
  req.session.authUser = updated;

  res.redirect(req.headers.referer);
});

router.post('/reset', async function(req, res){
  //console.log(req.body);
  const account = {
    _id: req.body._id,
    currentPassword: req.body.currentPassword,
    HashPassword: req.body.Password
  }
  //console.log(account);
  const result = await serviceUser.singleByIDAll(account._id);
  if (result == null) {
    res.redirect(`/u/`);
    return;
  }
  
  const ret = bcrypt.compareSync(account.currentPassword, result.HashPassword);
  if (!ret) {
    res.redirect(`/u/edit?code=2`);
    return;
  }
  
  account.HashPassword = bcrypt.hashSync(req.body.Password, 10, null);
  const resultPatch = await serviceUser.patchPassword(account);
  if (resultPatch) {
    res.redirect(`/u/edit?code=1`);
    return;
  }

  res.redirect(`/u/edit?code=3`)
});

//Lấy tài khoản có id...
router.get('/:id', async function(req, res){
  const UID = req.params.id;
  let enableEdit = false;
  const result = await serviceUser.singleByID(UID);
  const resultListReaction = await serviceReaction.listReaction(UID, 1);

  if (result === null) {
    return res.render('error', {
      layout: false,
      error: {
        code: 'Không tìm thấy người dùng này',
        status: `UID: ${UID}`
      }
    })
  }

  if (result._id.toString() == req.session.authUser._id) {
    enableEdit = true;
  }

  res.render('profile', {
    account: result,
    reactions: resultListReaction,
    enableEdit
  });
});

//User comment profile
router.post('/:id', async function (req, res) {
  const profileID = req.params.id;
  const reaction = {
    profileID,
    author: req.body.author,
    body: req.body.body
  }
  
  const result = await serviceReaction.add(reaction);

  res.redirect(`/u/${profileID}`);
})

module.exports = router