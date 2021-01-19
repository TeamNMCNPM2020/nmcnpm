const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../../models/model_service/user_service');

router.get('/', async function(req, res) {
  //type : loại người dùng (chưa cần)
  const userType = (+req.query.type) || 0;
  //admin: nếu user session là admin thì bật flag
  const admin = true;
  const resultUsers = await User.list();

  res.render('admin_main', {
    layout: 'special_user_layout.hbs',
    account_active: true,
    accounts: resultUsers
  });
});

//Hiển thị trang đăng bài viết mới
router.get('/new', function(req, res) {

  res.render('admin_account_management', {
    layout: 'special_user_layout.hbs',
    is_new: true
  });
});

//Xử lý Đăng bài viết mới
router.post('/new', async function(req, res) {
  //console.log(req.body);
  const newUser = {
    Username: req.body.Username,
    FullName: req.body.FullName,
    Permission: req.body.Permission,
    HashPassword: bcrypt.hashSync(req.body.Password, 10, null)
  }

  //console.log(newUser);
  const result = await User.add(newUser);

  if (result._id) {
    res.redirect('/admin/new?success=1');
    return;
  }
  res.redirect('/admin/new?success=0');
});



//Hiển thị trang chỉnh sửa tho6ng tin user
router.get('/edit/:id', async function(req, res) {
  const userID = req.params.id;
  const result = await User.singleByID(userID);

  res.render('admin_account_management', {
    layout: 'special_user_layout.hbs',
    account: result
  });
});

//Xử lý Chỉnh sửa tho6ng tin user
router.post('/edit/:id', async function(req, res) {
  const contentID = req.params.id;
  //console.log(req.body);
  const result = await User.patchInfo(req.body);

  res.redirect(`/admin/edit/${contentID}`);
});

//Xử lý reset password
router.post('/reset/:id', async function(req, res) {
  const contentID = req.params.id;
  //console.log(req.body);
  const patch = {
    _id: req.body._id,
    HashPassword: bcrypt.hashSync(req.body.Password, 10, null)
  }
  const result = await User.patchPassword(patch);

  if (result) {
    res.redirect(`/admin/edit/${contentID}?success=true`);
    return;
  }
  res.redirect(`/admin/edit/${contentID}?success=false`);
});

module.exports = router;