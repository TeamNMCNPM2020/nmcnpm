const router = require('express').Router();

router.get('/', function(req, res) {
  //type : loại người dùng (chưa cần)
  const userType = (+req.query.type) || 0;
  //admin: nếu user session là admin thì bật flag
  const admin = true;

  res.render('admin_main', {
    layout: 'special_user_layout.hbs',
    admin
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
router.post('/new', function(req, res) {
  console.log(req.body);

  res.render('admin_account_management', {
    layout: 'special_user_layout.hbs',
    is_new: true
  });
});



//Hiển thị trang chỉnh sửa bài viết
router.get('/edit/:id', function(req, res) {
  const contentID = req.params.id;

  res.render('admin_account_management', {
    layout: 'special_user_layout.hbs',
  });
});

//Xử lý Chỉnh sửa bài viết
router.post('/edit/:id', function(req, res) {
  const contentID = req.params.id;
  console.log(req.body);

  res.render('admin_account_management', {
    layout: 'special_user_layout.hbs',
  });
});

module.exports = router;