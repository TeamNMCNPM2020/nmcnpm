const router = require('express').Router();
const serviceContent = require('../models/model_service/singlecontent_service');

router.get('/', async function(req, res) {
  const result = await serviceContent.listContent();

  res.render('forum', {
    forum_active: true,
    contents: result
  });
});

router.get('/new_content', function(req, res) {
  res.render('content_edit', {
    forum_active: true,
  });
});

router.post('/new_content', async function(req, res) {
  const result = await serviceContent.add(req.body);

  res.redirect(`/c/${result._id}`)
});

module.exports = router;