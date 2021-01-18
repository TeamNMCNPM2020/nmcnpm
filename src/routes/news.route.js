const router = require('express').Router();
const serviceContent = require('../models/model_service/singlecontent_service');

router.get('/', async function(req, res) {
  const resultContent = await serviceContent.listContent(1);

  res.render('news.hbs', {
    news_active: true,
    contents: resultContent,
  });
});

module.exports = router;