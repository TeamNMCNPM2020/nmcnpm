const router = require('express').Router();
const serviceContent = require('../models/model_service/singlecontent_service');

router.get('/', async function(req, res) {
  const resultContent = await serviceContent.listContent(2);

  res.render('news.hbs', {
    oppor_active: true,
    contents: resultContent,
  });
});

module.exports = router;