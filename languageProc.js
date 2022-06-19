
var { NlpManager } = require('node-nlp');       //natural language processing for chatbot
const manager = new NlpManager({ languages: ['en'], forceNER: true});
const {getAllLecs} = require("./databaseClient.js");
const qHandler = require("./qHandler.js");
const questHandle = new qHandler();


async function botstr(){
    const addCompLecs = function(results){
        //var lecsArr = [];
        for (i = 0; i<results.length ; i++){
            var firstName = results[i].FullName.split(" ")[1] || "";
            var lastName = results[i].FullName.split(" ")[2] || "";
            var name = firstName + " " + lastName;
            manager.addNamedEntityText('lecturer', results[i].FullName, ['en'], [results[i].FullName, name]);
        }
    };
    getAllLecs('lecturers').then(function(results){
        addCompLecs(results);
    }).catch(function(err){
        console.log("Promise rejection error: " + err);
    });

    const addRes = function(results){
        for(i = 0 ; i <results.length ; i++){
            var name  = results[i].Name;
            manager.addNamedEntityText('restaurant', name, ['en'], name);
        }

    };
    getAllLecs('Restaurants').then(function(results){
        addRes(results);
    }).catch(function(err){
        console.log("Promise rejection error: " + err);
    });


    
    
    //manager.addNamedEntityText('lecturer', 'computing', ['en'], ['David Barnes']);
    manager.addNamedEntityText('clubs', 'Chemistry', ['en'], ['Chemistry', 'chem', 'Chemistry club']);
    manager.addNamedEntityText('clubs', 'Tokyo tea rooms', ['en'], ['Tokyo', 'Tokyo tea rooms', 'tokyo-tea-rooms', 'tea rooms']);

    //train the chatbot

    //GREETINGS
    manager.addDocument('en', 'goodbye for now', 'greetings.bye');
    manager.addDocument('en', 'bye bye take care', 'greetings.bye');
    manager.addDocument('en', 'okay see you later', 'greetings.bye');
    manager.addDocument('en', 'bye for now', 'greetings.bye');
    manager.addDocument('en', 'i must go', 'greetings.bye');

    manager.addDocument('en', 'hello', 'greetings.hello');
    manager.addDocument('en', 'hi there', 'greetings.hello');
    manager.addDocument('en', 'hello', 'greetings.hello');
    manager.addDocument('en', 'howdy', 'greetings.hello');
    manager.addDocument('en', 'hiya', 'greetings.hello');
    manager.addDocument('en', 'hi-ya', 'greetings.hello');
    manager.addDocument('en', 'howdy-do', 'greetings.hello');
    manager.addDocument('en', 'aloha', 'greetings.hello');
    manager.addDocument('en', 'hey', 'greetings.hello');

    manager.addDocument('en', 'good day', 'greetings.goodDay');
    manager.addDocument('en', 'good night', 'greetings.goodNight');
    manager.addDocument('en', 'good morning', 'greetings.goodMorning');
    manager.addDocument('en', 'good evening', 'greetings.goodevening');
    manager.addDocument('en', 'good afternoon', 'greetings.goodafternoon');

    //SENTIMENT CONVERSATIONS
    manager.addDocument('en', 'Nice!', 'sentiment.nice');
    manager.addDocument('en', "That'nice!", 'sentiment.nice');
    manager.addDocument('en', "Very nice", 'sentiment.nice');
    manager.addDocument('en', "Really nice", 'sentiment.nice');
    manager.addDocument('en', "Great work", 'sentiment.compliment');
    manager.addDocument('en', "Nice job", 'sentiment.compliment');
    manager.addDocument('en', "Amazing work", 'sentiment.compliment');
    manager.addDocument('en', "Well done", 'sentiment.compliment');
    manager.addDocument('en', "Thank you", 'sentiment.thanks');
    manager.addDocument('en', "Thanks", 'sentiment.thanks');
    manager.addDocument('en', "Cheers", 'sentiment.thanks');

    //USER DETAILS
    manager.addDocument('en', "my name is ", 'user.details');

    manager.addDocument('en', "What is your you name details ?", 'my.name');
    manager.addDocument('en', "How shall I call you ?", 'my.name');
    manager.addDocument('en', "Where do you live ?", 'my.address');
    manager.addDocument('en', "Who are you", 'my.me');

    manager.addDocument('en', "Play music songs", 'songs.list');

    //BOOKS
    manager.addDocument('en', "Read books", 'books.list');
    manager.addDocument('en', "Read novels", 'books.list');

    manager.addDocument('en', "boredom", 'bored');
    manager.addDocument('en', "I am getting bored", 'bored');
    manager.addDocument('en', "I am feeling bored", 'bored');
    manager.addDocument('en', "I am not feeling to do anything", 'bored');
    manager.addDocument('en', "I am feeling low", 'bored');
    manager.addDocument('en', "I am not feeling high", 'bored');

    manager.addDocument('en', "facts new fact interesting", 'fact');



    //RESTAURANT INFORMATION
    manager.addDocument('en', "I want to know more about the restaurants", 'info.restaurant.question');
    manager.addDocument('en', "Can you tell me about menus", 'info.restaurant.question');
    manager.addDocument('en', "Can you tell me about restaurants", 'info.restaurant.question');

    manager.addDocument('en', "Tell me more about %restaurant%", 'info.restaurant');
    manager.addDocument('en', "%restaurant%", 'info.restaurant');
    manager.addDocument('en', "What is the menu for %restaurant%", 'info.restaurant');
    manager.addDocument('en', "%restaurant% details", 'info.restaurant');

    manager.addDocument('en', "Restaurants around me", 'info.restaurant.location');
    manager.addDocument('en', "Where can I find a restaurant", 'info.restaurant.location');
    manager.addDocument('en', "Can you show me restaurants", 'info.restaurant.location');
    manager.addDocument('en', "Show me restaurants", 'info.restaurant.location');
    manager.addDocument('en', "Can you tell me where I can find restaurants", 'info.restaurant.location');
    //LECTURER INFORMATION
    manager.addDocument('en', "I want to know more about a lecturer", 'info.lecturer.question');
    manager.addDocument('en', "lecturer", 'info.lecturer.question');
    manager.addDocument('en', "I want to find out about someone", 'info.lecturer.question');
    manager.addDocument('en', "Which lecturers can you tell me about?", 'info.lecturer.schools');
    manager.addDocument('en', "Can you tell me about lecturers from any school?", 'info.lecturer.schools');
    manager.addDocument('en', "Can you tell me about lecturers from any department?", 'info.lecturer.schools');

    manager.addDocument('en', "I want to know where %lecturer% office is", 'info.lecturer');
    manager.addDocument('en', "Where is %lecturer% office", 'info.lecturer');
    manager.addDocument('en', "Where can I find %lecturer%", 'info.lecturer');
    manager.addDocument('en', "%lecturer%", 'info.lecturer');
    manager.addDocument('en', "%lecturer% contact details", 'info.lecturer');
    manager.addDocument('en', "%lecturer% email", 'info.lecturer');
    manager.addDocument('en', "Can you tell me about %lecturer%", 'info.lecturer');

    //CLUB INFORMATION
    manager.addDocument('en', "%clubs%", 'info.clubs.events');
    manager.addDocument('en', "%clubs%%clubs%", 'info.clubs.events');
    manager.addDocument('en', "What is going on at %clubs% tonight", "info.clubs.events");
    manager.addDocument('en', "What is going on at %clubs% today", "info.clubs.events");
    manager.addDocument('en', "What is going on at %clubs%", "info.clubs.events");
    manager.addDocument('en', "What events are at %clubs%", "info.clubs.events");
    manager.addDocument('en', "Events at %clubs%", "info.clubs.events");
    manager.addDocument('en', "Can I go to a club?", 'info.clubs.question');
    manager.addDocument('en', "Do you know anything about club events?", 'info.clubs.list');
    manager.addDocument('en', "Which clubs do you know about?", "info.clubs.list");
    manager.addDocument('en', "Which clubs can you tell me about?", "info.clubs.list");


    
    manager.addDocument('en', "latest Kent news", 'KentNews');
    manager.addDocument('en', "Uni news", 'KentNews');
    manager.addDocument('en', "University news", 'KentNews');
    manager.addDocument('en', "kent news", 'KentNews');
    manager.addDocument('en', "University of Kent news", 'KentNews');


    //BUS INFORMATION
    manager.addDocument('en', "When is the next bus from ", 'info.bus.departures');
    manager.addDocument('en', "busses", 'info.bus.departures');
    manager.addDocument('en', "bus stops near me", 'info.bus.departures');
    manager.addDocument('en', "busses near me", 'info.bus.departures');
    manager.addDocument('en', "bus schedule", 'info.bus.departures');
    manager.addDocument('en', "busses schedule", 'info.bus.departures');
    manager.addDocument('en', "what busses come to stop", 'info.bus.departures');
    manager.addDocument('en', "where can I get a bus from", 'info.bus.departures');

    //TESTING SITE
    manager.addDocument('en', "Near by Restaurants", "info.restaurant.location");
    manager.addDocument('en', "Places I can eat in", "info.restaurant.location");
    manager.addDocument('en', "Places I can grab food from", "info.restaurant.location");
    manager.addDocument('en', "Places I can dine at", "info.restaurant.location");
    manager.addDocument('en', "Where can I eat", "info.restaurant.location");
    manager.addDocument('en', "Restaurants around me", "info.restaurant.location");
    manager.addDocument('en', "Restaurants near me", "info.restaurant.location");
    //***********************************************************************************//
    //************************************************************************************//
    //************************************************************************************//
    //************************************************************************************//
    //************************************************************************************//
    //************************************************************************************//
    //************************************************************************************//
    // Train the NLG

    manager.addAnswer('en', 'KentNews', 'You can find news on the Univeristy of Kent here:<br><iframe width="100%" height="500px" src="https://www.kent.ac.uk/news" frameborder="0"></iframe>');

    manager.addAnswer('en', 'greetings.bye', 'Till next time :) Voice: Till next time!');
    manager.addAnswer('en', 'greetings.bye', 'see you soon! Voice: see you soon!');

    manager.addAnswer('en', 'greetings.hello', 'Hey there! Voice: Hey there!');
    manager.addAnswer('en', 'greetings.hello', 'Greetings! Voice: Greetings!');
    manager.addAnswer('en', 'greetings.hello', 'Hey buddy! Voice: Hey Buddy!');

    manager.addAnswer('en', 'greetings.goodNight', 'Good Night. Voice: Good Night.');
    manager.addAnswer('en', 'greetings.goodDay', 'Good Day! Voice: Good Day!');
    manager.addAnswer('en', 'greetings.goodMorning', 'Have a very happy morning! Voice: Have a very happy morning!');
    manager.addAnswer('en', 'greetings.goodevening', 'Good evening. Voice: Good evening.');
    manager.addAnswer('en', 'greetings.goodafternoon', 'Good afternoon. Voice: Good afternoon.');

    //SENTIMENT ANSWERS
    manager.addAnswer('en', 'sentiment.nice', 'Great! Voice: Great!');
    manager.addAnswer('en', 'sentiment.nice', 'Amazing! Voice: Amazing!');
    manager.addAnswer('en', 'sentiment.thanks', "Tried my best! Voice: Tried my best!");
    manager.addAnswer('en', 'sentiment.thanks', "No problem Voice: No problem");
    manager.addAnswer('en', 'sentiment.thanks', "Always here Voice: Always here");
    manager.addAnswer('en', 'sentiment.thanks', "You're welcome! Voice: You're welcome!");
    manager.addAnswer('en', 'sentiment.compliment', "Thank you! Voice: Thank you!");
    manager.addAnswer('en', 'sentiment.compliment', "Thanks! Voice: Thanks!");

    manager.addAnswer('en', 'user.details', 'Nice to know that! Voice: Nice to know that.');

    manager.addAnswer('en', 'my.name', 'You can call me Kenny. Voice: You can call me Kenny.');
    manager.addAnswer('en', 'my.name', 'I prefer to be called Kenny :) Voice: I prefer to be called Kenny!');
    manager.addAnswer('en', 'my.address', 'I live in this beautiful world created by nature Voice: I live in this beautiful world created by nature');
    manager.addAnswer('en', 'my.me', 'I am a friend of yours. Voice: I am a friend of yours.');


    manager.addAnswer('en', 'songs.list', '<a href="https://www.youtube.com/watch?v=mWRsgZuwf_8" target="_blanck">This</a> song will make you a fan of Imagine Dragons.<br>I personally like it :)');
    manager.addAnswer('en', 'songs.list', 'Although, <a href="https://www.youtube.com/watch?v=JGwWNGJdvx8" target="_blanck">this</a> song is old, but old is Gold! This song is a beauty :)');
    manager.addAnswer('en', 'songs.list', 'I donno, why do I keep listening to <a href="https://www.youtube.com/watch?v=4fndeDfaWCg" target="_blanck">this</a> song.');
    manager.addAnswer('en', 'songs.list', 'Did you listen <a href="https://www.youtube.com/watch?v=sx5PJyzGEpc" target="_blanck">On my way</a> by Alan Walker?');
    

    manager.addAnswer('en', 'bored', 'Some riddles will keep you entertained. Check <a href = "https://www.riddles.com/good-riddles" target="_blanck">this</a> out. Voice: Here is a site with some riddles you could try.');
    manager.addAnswer('en', 'bored', 'Try reading a book Voice: Try reading a book.');

    manager.addAnswer('en', 'info.lecturer.question', 'Who do you want to know more about? Voice: Who do you want to know more about?');
    manager.addAnswer('en', 'info.lecturer', 'Here are some details, if they are the wrong lecturer try typing their full name!<br>');

    manager.addAnswer('en', 'info.clubs.list', "I can tell you about events going on at: Tokyo Tea Rooms and Chemistry. Which would you like to know about? Voice: I can tell you about events going on at: Tokyo Tea Rooms and Chemistry. Which would you like to know about?");
    manager.addAnswer('en', 'info.clubs.events', 'Searching events...');
    manager.addAnswer('en', 'info.clubs.question', 'Sure, which club would you like to go to?');



  // Restaurants


  manager.addAnswer('en', 'info.restaurant.question', 'What restaurant would you like to know about');
  manager.addAnswer('en', 'info.restaurant', ' ');
  manager.addAnswer('en', 'info.restaurant.location', `<form action = "/map" method = "GET"><button type="submit" class="btn btn-outline-light">Check Restaurants</button></form>`);
  
  // Busses
  manager.addAnswer('en', 'info.bus.departures', "Searching busses near you... Please wait!<br>");

  manager.addAnswer('en', 'info.lecturer.schools', "I can tell you about lecturers from any school, just give me their name. Voice: I can tell you about lecturers from any school, just give me their name.");
 
    await manager.train();
    manager.save();
}

/**
 * Function to process and return response to given user input
 * @param {*} findStr User input
 * @returns Response
 */
async function botAnswer(findStr){
    var response = await manager.process('en', findStr);
    console.log(response);
    
    res = await questHandle.handleAnswer(response);
    if (res){
        return `${response.answer} \n ${res}`;
    }else{
        console.log(response.answer);
        return `${response.answer}`;
    }
    
}

module.exports = {
    botstr: botstr,
    botAnswer: botAnswer
}
