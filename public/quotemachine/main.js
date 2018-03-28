(function(){
    // cache the html elements to prevent redundant queries
    var currQuote = null,
        quoteArea = null,
        sourceArea = null;

    // store interval ID for write FX
    var sourceIntervalId = 0,
        quoteIntervalId = 0;

    // ajax options (used for CORS)
    var AJAX_OPTS = {
        "Access-Control-Allow-Origin": "*, twitter.com"
    };

    // oops could have use jquery's ajax
    var ajax = function(url, options, callback){
        // default options
        options = (!options) ? {} : options;

        // extact fields from options
        var headers = (typeof options.headers === "object" && options.headers !== null) ? options.headers : {},
            method = (typeof options.method === "string") ? options.method : "GET",
            data = options.data || undefined;

        // use the web api 
        var xhr = new XMLHttpRequest();

        // load handler
        xhr.onload = function(){
            if(typeof callback === "function"){
                callback(xhr.response, xhr.status);
            }
        };

        // open the request, set headers
        xhr.open(method, url, true);
        for(var h in headers){
            xhr.setRequestHeader(h, headers[h]);
        }

        // send the request
        xhr.send(data);
    };

    // opens the twitter page with the quote 
    var tweetQuote = function(evt){
        if(currQuote){
            window.open("http://twitter.com/intent/tweet?text=" + encodeURIComponent(currQuote));
        }
    };

    // loads and displays a quote, makes sure the quote is not a duplicate 
    var nextQuote = function(evt){
        // async load...
        ajax(
            window.location.protocol + "//" + window.location.host  + "/quote/get", 
            AJAX_OPTS, 
            function(res, status){
                if(status === 200){
                    // 200 status code, success 
                    try{
                        // attempt to parse
                        var json = JSON.parse(res);

                        if(currQuote === json.quote){
                            // duplicate detected, try again
                            nextQuote();
                            return;
                        }

                        // no dupe, display quote and store 
                        display(json.quote, json.source);
                        currQuote = json.quote;
                    }
                    catch(err){
                        // bad json 
                        display("Error displaying JSON data.");
                    }
                }
                else{
                    // 400 status code, request failed
                    display("Quote server not available.");
                }
            }
        );
    };

    // displays quote data in the webpage
    var display = function(quote, source){
        if(quote){
            // display the quote
           
            // clear conflicting text write
            if(quoteIntervalId > 0){
                clearInterval(quoteIntervalId);
            }
            quoteIntervalId = writeTextFX(quoteArea, '"' + quote + '"');

            if(source){
                // display the source

                // clear conflicting text write
                if(sourceIntervalId > 0){
                    clearInterval(sourceIntervalId);
                }
                sourceIntervalId = writeTextFX(sourceArea, " - " + source);
            }
        }
        else{
            quoteArea.innerHTML = "Bad JSON response.";
        }
    };

    // writes text inside an element over a fixed duration
    // adjusts write speed based on text size
    var writeTextFX = function(element, text){
        element.innerHTML = "";

        var time = 500 / text.length,
            index = 0;

        var intervalId = setInterval(function(){
            element.innerHTML += text[index];

            index++;

            if(index === text.length){
                clearInterval(intervalId);
            }
        }, time);

        return intervalId;
    };

    // when the page loads...
    var init = function(){
        // cache display containers
        quoteArea = document.querySelector("#quote-area");
        sourceArea = document.querySelector("#source-area");

        // (I prefer native JS, but could use jquery
        // quoteArea = $("#quote-area");

        // attach click listeners
        document.querySelector("#twitter-btn").addEventListener("click", tweetQuote);
        document.querySelector("#nxt-btn").addEventListener("click", nextQuote);

        // auto get first quote
        nextQuote();
    };
    window.addEventListener("load", init);
})();