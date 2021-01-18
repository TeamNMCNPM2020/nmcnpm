const router = require('express').Router();
const serviceContent = require('../../models/model_service/singlecontent_service');
const serviceTopic = require('../../models/model_service/singletopic_service');

router.get('/', async function(req, res) {
  //type : loại news/ diễn đàn/ cơ hội
  let contentType = (+req.query.type) || 0;
  const topic = (req.query.topic) || 0;

  if (contentType < 0 || contentType > 2) {
    contentType = 1;
  }

  const resultContent = await serviceContent.listContent(contentType, topic);
  const resultTopic = await serviceTopic.list();

  if (topic != 0) {
    resultTopic.map(singleTopic => {
      if (singleTopic._id.toString() == topic) {
        singleTopic.selected = true;
      }
      return singleTopic;
    });
  }

  //console.log(resultTopic);

  res.render('mod_main', {
    layout: 'special_user_layout.hbs',
    forum_active: contentType === 0,
    news_active: contentType === 1,
    oppor_active: contentType === 2,
    contents: resultContent,
    topics: resultTopic
  });
});

//Hiển thị trang đăng bài viết mới
router.get('/new', async function(req, res) {
  const resultTopic = await serviceTopic.list();

  res.render('mod_content_management', {
    layout: 'special_user_layout.hbs',
    topics: resultTopic,
    is_new: true
  });
});

//Xử lý Đăng bài viết mới
router.post('/new', async function(req, res) {
  const result = await serviceContent.add(req.body);

  //console.log(result);

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
  const resultTopic = await serviceTopic.list();

  resultTopic.map(topic => {  
    if (resultContent.topicID) {//block null
      topic.selected = resultContent.topicID.toString() == topic._id.toString();
    }
    
    return topic;
  });

  res.render('mod_content_management', {
    layout: 'special_user_layout.hbs',
    content: resultContent,
    topics: resultTopic,
  });
});

//Xử lý Chỉnh sửa bài viết
router.post('/edit/:id', async function(req, res) {
  const result = await serviceContent.patch(req.body);

  res.redirect(req.headers.referer);
});



//TOPIC POST PROCESSING-----------------------------------------

//Tạo chủ đề mới
router.post('/topic/new', async function(req, res) {
  const entity = {
    'topicName': req.body.topicName
  }

  const result = await serviceTopic.add(entity);
  res.redirect(req.headers.referer);
});
//Chỉnh sửa tên chủ đề
router.post('/topic/patch', async function(req, res) {
  const entity = {
    '_id': req.body._id,
    'topicName': req.body.topicName
  }
  // console.log(req.body);
  // console.log(entity);

  const result = await serviceTopic.patch(entity);
  res.redirect(req.headers.referer);
});
//Xóa chủ đề
router.post('/topic/del', async function(req, res) {
  const topicID = req.body._id;
  // console.log(req.body);
  // console.log(topicID);

  const result = await serviceTopic.del(topicID);
  res.redirect(req.headers.referer);
})

module.exports = router;