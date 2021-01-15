const express = require('express');

module.exports = function(app) {
  app.get('/news', function(req, res) {
    res.render('news.hbs', {
      news_active: true,
    });
  });
  app.get('/forum', function(req, res) {
    res.render('forum.hbs', {
      forum_active: true,
    });
  });
  app.get('/opportunities', function(req, res) {
    res.render('news.hbs', {
      oppor_active: true,
    });
  });

  app.use('/c', require('../routes/content.route'));
  app.use('/u', require('../routes/sn.route'));
  app.use('/account', require('../routes/account.route'));
  app.use('/p', express.static('./public'));
}