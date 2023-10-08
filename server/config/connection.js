const mongoose = require("mongoose");
require("dotenv").config();

const url = `mongodb+srv://lkalliance:${process.env.DB_PASSWORD}@lkalliance.jkjosg0.mongodb.net/br4_db?retryWrites=true&w=majority`;

mongoose.connect(
  // process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/b4r_db",
  url,
  { useNewUrlParser: true },
  { useUnifiedTopology: true }
);

// mongoose.connect(url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// });

module.exports = mongoose.connection;
