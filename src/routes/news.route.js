const router = require('express').Router();
const serviceContent = require('../models/model_service/singlecontent_service');
const serviceTopic = require('../models/model_service/singletopic_service');

router.get('/', async function(req, res) {
  const topic = (req.query.topic) || 0;
  const resultContent = await serviceContent.listContent(1, topic);
  const resultTopic = await serviceTopic.list();

  if (topic != 0) {
    resultTopic.map(singleTopic => {
      if (singleTopic._id.toString() == topic) {
        singleTopic.selected = true;
      }
      return singleTopic;
    });
  }  

  res.render('news.hbs', {
    news_active: true,
    contents: resultContent,
    topics: resultTopic,
    all: topic == 0,
  });
});

module.exports = router;