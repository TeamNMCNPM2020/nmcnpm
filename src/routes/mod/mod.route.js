const router = require('express').Router();
const serviceContent = require('../../models/model_service/singlecontent_service');

router.get('/', async function(req, res) {
  //type : loại news/ diễn đàn/ cơ hội
  let contentType = (+req.query.type) || 0;
  const selected_topic = (+req.query.topic) || 0;

  if (contentType < 0 || contentType > 2) {
    contentType = 1;
  }

  const resultContent = await serviceContent.listContent(contentType);

  res.render('mod_main', {
    layout: 'special_user_layout.hbs',
    forum_active: contentType === 0,
    news_active: contentType === 1,
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
router.post('/new', async function(req, res) {
  const result = await serviceContent.add(req.body);

  console.log(result);

  if (result._id) {
    res.redirect(`/mod/edit/${result._id}`);
    return;
  }

  res.redirect('/mod/new?err=true');
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