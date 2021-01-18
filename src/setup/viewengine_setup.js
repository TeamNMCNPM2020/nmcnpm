const exphbs = require('express-handlebars');
const exphbs_section = require('express-handlebars-sections');

//View engine setup
module.exports = function(app) {
  app.engine('hbs', exphbs({
    //Options
    defaultLayout: 'main.layout.hbs',
    extname: 'hbs',
    helpers: {
      section: exphbs_section(),
      equals(val1, val2) {
        return val1 === val2;
      }
    },
  }));

  app.set('view engine', 'hbs');
}