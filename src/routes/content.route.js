const router = require('express').Router();
const serviceContent = require('../models/model_service/singlecontent_service');
const serviceTopic = require('../models/model_service/singletopic_service');

router.get('/edit', function (req, res) {
  res.render('content_edit');
});

router.get('/:id', async function (req, res) {
  const contentID = req.params.id

  const result = await serviceContent.singleByID(contentID);

  if (result === null) {
    return res.render('error', {
      layout: false,
      error: {
        code: 'Không tìm thấy bài viết này',
        status: `contentID: ${contentID}`
      }
    })
  }

  res.render('content', {
    content: result
  });
});

router.get('/:id/edit', async function (req, res) {
  const contentID = req.params.id;

  const resultContent = await serviceContent.singleByID(contentID);
  const resultTopic = await serviceTopic.list();

  resultTopic.map(topic => {  
    if (resultContent.topicID) {//block null
      topic.selected = resultContent.topicID.toString() == topic._id.toString();
    }
    
    return topic;
  });

  //TODO: Kiểm tra author bài viết với đang người truy cập có là 1 không

  if (resultContent === null) {
    return res.render('error', {
      layout: false,
      error: {
        code: 'Không tìm thấy bài viết này',
        status: `contentID: ${contentID}`
      }
    })
  }

  res.render('content_edit', {
    content: resultContent,
    topics: resultTopic
  });
});

//Chỉ sửa đc bài diễn đàn
router.post('/:id/edit', async function (req, res) {
  const contentID = req.params.id;
  
  //console.log(req.body);
  const result = await serviceContent.patch(req.body);

  res.redirect(req.headers.referer);
});

module.exports = router;