var deasync = require('deasync');
const { SerpApiKey } = require("./apiKeys.json");
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch(SerpApiKey);
const { getAllLecs } = require("./databaseClient.js");
const http = require('http');

class qHandler {

    constructor() {

    }
    /**
     * Function to handle user queries which may require additional api/database calls
     * @param {*} response The response initially provided by the nlp
     * @returns an appropiate answer to user query
     */
    async handleAnswer(response) {
        if (response.intent == 'info.clubs.events') {
            //Fetch club events and display as string
            return await this.#FindClubEvents(response.entities);
        } else if (response.intent == 'info.lecturer') {
            return await this.#findLecturerInfo(response.entities);
        } else if (response.intent == 'info.restaurant') {
            return await this.#findRestaurantMenu(response.entities);
        } else if (response.intent == 'info.bus.departures') {
            const { long, lat } = require('./index.js');
            return this.#findBusStops(lat, long);;
        }
    }
    /**
     * Function to find club events
     * @param entities  This refers to the clubs specified by the user
     * @returns         Results for a few events at the specified club formatted for the chat application
     */
    async #FindClubEvents(entities) {
        if (entities.length != 0) {
            var club = entities[0].option + " club events Canterbury";
        } else {
            return "Please specify a club you would like to find out events for."
        }
        //set up parameters for request
        var params = {
            //engine: "google_search",
            q: club,
            google_domain: "google.co.uk",
            hl: "en",
            gl: "uk",
            location: "Canterbury, England, United Kingdom"
        }
        var result = null;
        //perform request to api for results
        search.json(params, (data) => {
            var eventList;
            var eventTitle;
            var eventDate;
            var eventTime;
            if (data.events_results) {
                for (var i = 0; i < Object.keys(data.events_results).length; i++) {
                    var event = data.events_results[i];

                    eventTitle = event.title || "I couldn't retrieve the title!";
                    eventDate = event.date.when || event.date || "Sorry! I couldn't retrieve the date.";
                    eventTime = event.time || "Sorry! I couldn't retrieve the time of the event. Maybe check the link?";
                    eventList += "<br>" + eventTitle + "<br>" + eventDate + "<br> " + eventTime + "<br><a href = " + event.link + ">Link</a><br>"; //format result in html
                    if (i == 5) {
                        break;
                    }
                }
            } else {
                eventList = "No results found";
            }

            eventList += "Voice: Here are some upcoming events. " + eventTitle + " on " + eventDate + " at " + eventTime;
            result = eventList;
        })
        //deasync and wait for result before returning (possible performance overhead)
        while ((result == null)) {
            deasync.runLoopOnce();
        }
        return result;
    }
    /**
     * Function to find lecturer details
     * @param entities  This refers to the lecturer specified by the user
     * @returns         Results with details about the specified lecturer (email, office location)
     */
    async #findLecturerInfo(entities) {
        var result = null;
        var results = await getAllLecs('lecturerInfo', entities[0].option); //get information from database
        result = "Name: " + results[0].FullName + "<br>Email: " + results[0].Email + "<br>Location: " + results[0].Location; //formalise text response
        result += " Voice: " + results[0].FullName + " email is " + results[0].Email + " and they are located at " + results[0].Location; //formalise voice response
        return result;
    }
    /**
     * Function to find restaurant menus
     * @param entities  This refers to the restaurant specified by the user
     * @returns         Results with a link to the menu for the specific restaurant
     */
    async #findRestaurantMenu(entities) {
        var result = null;
        var results = await getAllLecs('RestaurantInfo', entities[0].option);
        console.log(results);
        result = `<br>Restaurant Name: ${results[0].Name} Menu: <a href = ${results[0].Menu}>Menu</a>`;
        result += " Voice: here is the menu for " + results[0].Name;
        return result
    }
    /**
     * Function to find nearby bus stops and bus departures
     * @param lat  This refers to the user's current latitude coordinate
     * @param long This refers to the user's current latitude coordinate
     * @returns    Results which include nearby bus stops and their next bus departure times
     */
    async #findBusStops(lat, long) {
        let data = '';
        var end = false;
        var retString = ""; //initialise return string

        //api call to get nearby bus stops
        http.get(`http://transportapi.com/v3/uk/places.json?lat=${lat}&lon=${long}&type=bus_stop&app_id=a30e2a28&app_key=25de0c5478e9fe35581f01c41d65943b`, (resp) => {
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                end = true;
            })

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
        //wait for response before continuing
        while (!end) {
            deasync.runLoopOnce();
        }
        var json = JSON.parse(data);
        var stopName = "";
        var atocode = "";
        if (json) {     //Api call worked
            for (var i = 0; i < Object.keys(json.member).length; i++) {
                stopName = json.member[i].name || "No stop name found";
                atocode = json.member[i].atcocode || "No atocode found";
                var apiUrl = `http://transportapi.com/v3/uk/bus/stop/${atocode}/live.json?app_id=a30e2a28&app_key=25de0c5478e9fe35581f01c41d65943b&group=route&nextbuses=yes`;
                data = '';
                retString += `${stopName} Departures: <br> `;
                end = false;
                http.get(apiUrl, (resp) => {    //Api call to get departure times for the nearby bus stops
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
                    resp.on('end', () => {
                        end = true;
                    })

                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                });
                while (!end) {
                    deasync.runLoopOnce();
                }
                var json2 = JSON.parse(data);
                let busses = json2.departures;
                console.log(busses);
                var j = 0;
                var direction = "";
                var time = "";

                for (var attr in busses) {
                    direction = busses[attr][0].direction;
                    time = busses[attr][0].best_departure_estimate;
                    retString += `<p>${attr} to ${direction} : ${time} </p>`
                    j++
                    if (j == 5) {   //only next 5 busses for each bus stop
                        break;
                    }
                }

                if (i == 3) {   //only 3 closest bus stops
                    break;
                }
                retString += `<br>`;
            }
        } else {
            retString = "I had trouble retrieving bus information Voice: I had trouble retrieving bus information";
            return retString;
        }
        retString += ` Voice: Here are a list of nearby bus stops`; //voice output
        return retString;
    }


}

module.exports = qHandler;
