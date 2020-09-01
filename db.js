const mongodb = require("mongodb");

const connectionString =
  "mongodb+srv://abc:abc@cluster0-luxcw.azure.mongodb.net/JSFullStackNodeByAndy?retryWrites=true&w=majority";

mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    //client.db() will return the exact database object we work in
    module.exports = client.db();
    const app = require("./app");
    app.listen(3000);
  }
);
