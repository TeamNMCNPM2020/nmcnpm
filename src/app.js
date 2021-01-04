const express = require('express');
const mongoose = require('mongoose');

//Keys for every important credentials
// If deployed to real db or use anything requiring credentials, 
//.gitignore this file
const keys = require('./config/keys.json');

require('express-async-errors');    //Async error handling

//Dependencies
const app = express();

require('./setup/viewengine_setup')(app);

//For using POST method
app.use(express.urlencoded({
  extended: true
}));

//Connect to DB
mongoose.connect(keys.mongodb.dbURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}, function(err) {
  if (err) {
    console.log('Unable to connect to db');
    return;
  }
  console.log('Connected to DB successfully');
});

require('./setup/route_setup')(app);

const PORT = 3060;
app.listen(PORT, _ => {
  console.log(`App listening on PORT ${PORT}`)
});