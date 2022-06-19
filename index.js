const express = require("express");
const Say = require('say');
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http); //chat application
var langProc = require("./languageProc.js");
var voiceToggle = false;
app.use(express.static(__dirname));
var long = 1.0;
var lat = 1.0;

//serve the static html files
app.get("/", function (req, res) {
  var path = require("path");
  res.sendFile(path.resolve("HTML/index.html"));
});

//send map of nearby restaurants
app.get("/map", function(req, res){
  var path = require("path");
  res.sendFile(path.resolve("HTML/GMap.html"));
});

//events emitters
io.on("connection", function (socket) {
  langProc.botstr();
  console.log("a user connected");
  
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  //handle voice output toggle request
  socket.on("voice toggle", function(){
    voiceToggle = !voiceToggle;
  });

  //export user location coordinates when received
  socket.on("coords", function(coords){
    module.exports.long = coords[0];
    module.exports.lat = coords[1];
  })

  socket.on("chat message", function (msg) {
    console.log("message: " + msg);
    io.emit("chat message", msg);
    //process user input
    langProc.botAnswer(msg).then((result) => {
      //display message if answer is undefined
      if (result == `undefined`|| result == null) {
        io.emit(
          "chat message",
          "Sorry... I don't quite understand that."
        );
        //speak if toggle
        if (voiceToggle) Say.speak("Sorry, I don't quite understand that.", "Alex");

      } else {
        //Voice and text output are different if voice is toggled on
        var resultText = result.split("Voice:")[0] || result;
        if (voiceToggle) {
          try {
            var resultVoice = result.split("Voice:")[1] || null;
            Say.speak(resultVoice, 'Alex');
          } catch (e) {
            console.log(e);
          }
        }
        //send text message
        io.emit("chat message", resultText);
      }
    });
  });
});
//server start
http.listen(8000, function () {
  console.log("listening on *:8000");
});
module.exports = {
  io,
  long,
  lat
}
