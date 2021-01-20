const router = require('express').Router();
const serviceContent = require('../models/model_service/singlecontent_service');
const serviceTopic = require('../models/model_service/singletopic_service');
const serviceReaction = require('../models/model_service/reaction_service');
const serviceUser = require('../models/model_service/user_service');

router.get('/:id', async function (req, res) {
  const contentID = req.params.id

  const result = await serviceContent.singleByID(contentID);
  const resultListReaction = await serviceReaction.listReaction(contentID);

  if (result === null) {
    return res.render('error', {
      layout: false,
      error: {
        code: 'Không tìm thấy bài viết này',
        status: `contentID: ${contentID}`
      }
    })
  }

  console.log(resultListReaction);
  res.render('content', {
    content: result,
    reactions: resultListReaction,
    isAuthor: (result.author._id.toString() == req.session.authUser._id)
  });
});

//User comment bài viết
router.post('/:id', async function (req, res) {
  const contentID = req.params.id;
  const reaction = {
    contentID,
    author: req.body.author,
    body: req.body.body
  }
  
  const result = await serviceReaction.add(reaction);

  res.redirect(`/c/${contentID}`);
})

router.get('/:id/edit', async function (req, res) {
  const contentID = req.params.id;

  const resultContent = await serviceContent.singleByID(contentID);
  const resultTopic = await serviceTopic.list();

  //Kiểm tra author bài viết với đang người truy cập có là 1 không
  if (resultContent.author._id.toString() !== req.session.authUser._id) {
    return res.redirect(`/c/${contentID}`);
  };

  resultTopic.map(topic => {  
    if (resultContent.topicID) {//block null
      topic.selected = resultContent.topicID.toString() == topic._id.toString();
    }
    
    return topic;
  });

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
