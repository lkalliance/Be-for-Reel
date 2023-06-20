const mongoose = require("mongoose");
require("dotenv").config();

const url = `mongodb+srv://lkalliance:${process.env.DB_PASSWORD}@lkalliance.jkjosg0.mongodb.net/shelf_life_db?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;
