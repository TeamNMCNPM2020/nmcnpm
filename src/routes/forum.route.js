const router = require('express').Router();
const serviceContent = require('../models/model_service/singlecontent_service');
const serviceTopic = require('../models/model_service/singletopic_service');

router.get('/', async function(req, res) {
  const topic = (req.query.topic) || 0;

  const result = await serviceContent.listContent(0, topic);
  const resultTopic = await serviceTopic.list();

  if (topic != 0) {
    resultTopic.map(singleTopic => {
      if (singleTopic._id.toString() == topic) {
        singleTopic.selected = true;
      }
      return singleTopic;
    });
  }

  res.render('forum', {
    forum_active: true,
    contents: result,
    topics: resultTopic,
    all: topic == 0,
  });
});

router.get('/new_content', async function(req, res) {
  const resultTopic = await serviceTopic.list();

  res.render('content_edit', {
    forum_active: true,
    topics: resultTopic
  });
});

router.post('/new_content', async function(req, res) {
  let newContent = req.body;
  newContent.typeID = 0;    //Post new content in forum then typeID is type of forum(0)
  newContent.author = req.session.authUser._id;
  const result = await serviceContent.add(newContent);

  res.redirect(`/c/${result._id}`)
});

module.exports = router;