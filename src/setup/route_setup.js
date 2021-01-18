const express = require('express');

module.exports = function(app) {
  app.use('/news', require('../routes/news.route'));
  app.use('/opportunities', require('../routes/oppor.route'));
  app.use('/forum', require('../routes/forum.route'));

  app.use('/mod', require('../routes/mod/mod.route'));
  app.use('/admin', require('../routes/mod/admin.route'));

  app.use('/c', require('../routes/content.route'));
  app.use('/u', require('../routes/sn.route'));
  app.use('/account', require('../routes/account.route'));


  app.use('/p', express.static('./public'));
}