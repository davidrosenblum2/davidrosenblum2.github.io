var client = (function(){
    // html elements, query selected + stored if null
    var status = null,
        temp = null,
        tempRange = null;

    var jsonData = null,  // store the json from the weather API
        tempSystem = "F"; // keep track for toggling 


    // http request
    var ajax = function(url, options, callback){
        options = (!options) ? {} : options;

        var method = (typeof options.method === "string") ? options.method : "GET",
            headers = (typeof options.headers === "object" && options.headers) ? options.headers : {},
            data = (typeof options.data !== "undefined") ? options.data : null;

        var xhr = new XMLHttpRequest();

        xhr.onload = function(){
            callback(xhr.response, xhr.status);
        };

        xhr.open(method, url, true);
        for(var h in headers){
            xhr.setRequestHeader(h, headers[h]);
        }
        xhr.send(data);
    };

    var celsius = function(f){
        var fn = parseFloat(f);
        if(typeof fn !== "number"){
            return f;
        }
        return ((fn + 32) + (5/9)).toFixed(2);
    };

    var fahrenheit = function(c){
        var cn = parseFloat(c);
        if(typeof cn !== "number"){
            return c;
        }
        return (cn * (9/5) + 32).toFixed(2);
    };

    var changeToCelsius = function(){
        temp = (!temp) ? document.querySelector("#temp") : temp,
        tempRange = (!tempRange) ? document.querySelector("#temp-range") : tempRange;

        // already celsius
        if(tempSystem === "C"){
            return;
        }

        // temp is delivered in celsisus 
        temp.innerHTML = jsonData.main.temp + " &deg;C";
        tempRange.innerHTML = jsonData.main.temp_min + " - " + jsonData.main.temp_max + " &deg;C";

        tempSystem = "C";
    };

    var changeToFahrenheit = function(){
        temp = (!temp) ? document.querySelector("#temp") : temp,
        tempRange = (!tempRange) ? document.querySelector("#temp-range") : tempRange;

        // already celsius
        if(tempSystem === "F"){
            return;
        }

        temp.innerHTML = fahrenheit(jsonData.main.temp) + " &deg;F";
        tempRange.innerHTML = fahrenheit(jsonData.main.temp_min) + " - " + fahrenheit(jsonData.main.temp_max) + " &deg;F";

        tempSystem = "F";
    };

    // async getGeolocation -> async weatherAPI -> display 
    var retrieveWeatherData = function(callback){
        if(!navigator.geolocation){
            console.error("Geolocation not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(function(position){
            //console.log(position);    
            var lon = position.coords.longitude,
                lat = position.coords.latitude;

            ajax(
                window.location.protocol + "//fcc-weather-api.glitch.me/api/current?lon=" + lon + "&lat=" + lat,
                //"https://fcc-weather-api.glitch.me/api/current?lon=" + lon + "&lat=" + lat,
                null,
                callback
            );
        });
    };

    var displayLocationData = function(){
        status = document.querySelector("#status");

        retrieveWeatherData(function(info, httpStatus){
            if(httpStatus === 200){
                document.querySelector("#app-body").style.display = "block";
                document.querySelector("#loading").style.display = "none";

                // good response
                var json;
                try{
                    // attempt to parse
                    json = JSON.parse(info);
                }
                catch(err){
                    // response is bad json (should be impossible)
                    status.innerHTML = "Weather API responded with bad JSON.";
                    console.error("Weather API had bad json.");
                    return;
                }

                // display data
                var weather = json.weather[0],
                    main = json.main;

                jsonData = json; // store outside of the scope of this function 

                //console.log(jsonData);
                status.innerHTML = 
                "<img src='" + weather.icon + "' alt='" + weather.description + "'>\
                <span id='temp'>" + fahrenheit(main.temp) + " &deg;F</span> \
                <br><br><table id='tbl' class='table table-striped table-dark'><thead></thead><tbody>\
                <tr><th>Location</th><td>" + json.name + "</td></tr>\
                <tr><th>Temp Range</th><td id='temp-range'>" + fahrenheit(main.temp_min) + " - " + fahrenheit(main.temp_max) + " &deg;F</td></tr>\
                <tr><th>Humidity</th><td>" + main.humidity + "</td></tr>\
                </tbody></table><br>\
                Expect to experience <span id='description'>" + weather.description + "</span> today.";
            }
            else{
                // bad response
                status.innerHTML = "Weather API unresponsive.";
                console.error("No response from weather API (bad status code).");
            }
        });
    };

    var init = function(){
        displayLocationData();

        document.querySelector("#c-btn").addEventListener("click", changeToCelsius);
        document.querySelector("#f-btn").addEventListener("click", changeToFahrenheit);
    };
    window.addEventListener("load", init);
})();