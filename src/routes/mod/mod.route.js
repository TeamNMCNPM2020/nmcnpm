const router = require('express').Router();
const { singleByID } = require('../../models/model_service/singlecontent_service');
const serviceContent = require('../../models/model_service/singlecontent_service');

router.get('/', async function(req, res) {
  //type : loại news/ diễn đàn/ cơ hội
  const contentType = (+req.query.type) || 0;
  const selected_topic = (+req.query.topic) || 0;
  const resultContent = await serviceContent.listContent();

  res.render('mod_main', {
    layout: 'special_user_layout.hbs',
    news_active: contentType === 0,
    forum_active: contentType === 1,
    oppor_active: contentType === 2,
    contents: resultContent,
  });
});

//Hiển thị trang đăng bài viết mới
router.get('/new', function(req, res) {

  res.render('mod_content_management', {
    layout: 'special_user_layout.hbs',
    is_new: true
  });
});

//Xử lý Đăng bài viết mới
router.post('/new', function(req, res) {
  console.log(req.body);

  res.render('mod_content_management', {
    layout: 'special_user_layout.hbs',
    is_new: true
  });
});



//Hiển thị trang chỉnh sửa bài viết
router.get('/edit/:id', async function(req, res) {
  const contentID = req.params.id;
  const resultContent = await serviceContent.singleByID(contentID);

  res.render('mod_content_management', {
    layout: 'special_user_layout.hbs',
    content: resultContent,
  });
});

//Xử lý Chỉnh sửa bài viết
router.post('/edit/:id', async function(req, res) {
  const result = await serviceContent.patch(req.body);

  res.redirect(req.headers.referer);
});

module.exports = router;