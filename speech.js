function setup(){
    noCanvas();
    let lang = navigator.language || 'en-US';   //define speech recognition language
    let speechRec = new p5.SpeechRec(lang, gotSpeech);  //set callback function
    var socket = io();

     $("#mic").click(function(e){   //start recording on button click
         e.preventDefault();
         console.log("Recording Started");
         speechRec.start();
     });
    
    function gotSpeech() {  //send message to be processed
        console.log(speechRec);
        if (speechRec.resultValue){
            let mes = speechRec.resultString;
            console.log(mes);
            socket.emit("chat message", mes);

        }
    
}


}