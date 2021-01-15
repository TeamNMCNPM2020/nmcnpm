const router = require('express').Router();
const serviceContent = require('../models/model_service/singlecontent_service');

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

module.exports = router;