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

router.get('/:id/edit', async function (req, res) {
  const contentID = req.params.id;

  const result = await serviceContent.singleByID(contentID);

  //TODO: Kiểm tra author bài viết với đang người truy cập có là 1 không

  if (result === null) {
    return res.render('error', {
      layout: false,
      error: {
        code: 'Không tìm thấy bài viết này',
        status: `contentID: ${contentID}`
      }
    })
  }

  res.render('content_edit', {
    content: result
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