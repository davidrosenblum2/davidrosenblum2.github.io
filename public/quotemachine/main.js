(function(){
    var currQuote = null,
        quoteElement = null,
        sourceElement = null;

    var AJAX_OPTS = {
        "Access-Control-Allow-Origin": "*, twitter.com"
    };

    // oops could have use jquery's ajax
    var ajax = function(url, options, callback){
        options = (!options) ? {} : options;

        var headers = (typeof options.headers === "object" && options.headers !== null) ? options.headers : {},
            method = (typeof options.method === "string") ? options.method : "GET",
            data = options.data || undefined;

        var xhr = new XMLHttpRequest();

        xhr.onload = function(){
            if(typeof callback === "function"){
                callback(xhr.response, xhr.status);
            }
        };

        xhr.open(method, url, true);
        for(var h in headers){
            xhr.setRequestHeader(h, headers[h]);
        }
        xhr.send(data);
    };

    var tweetQuote = function(evt){
        if(currQuote){
            window.open("http://twitter.com/intent/tweet?text=" + encodeURIComponent(currQuote));
        }
    };

    var nextQuote = function(evt){
        ajax(
            window.location.protocol + "//" + window.location.host  + "/quote/get", 
            AJAX_OPTS, 
            function(res, status){
                if(status === 200){
                    try{
                        var json = JSON.parse(res);

                        if(currQuote === json.quote){
                            nextQuote();
                            return;
                        }

                        display(json.quote, json.source);
                        currQuote = json.quote;
                    }
                    catch(err){
                        display("Error displaying JSON data.");
                    }
                }
                else{
                    display("Quote server not available.");
                }
            }
        );
    };

    var display = function(quote, source){
        if(quote){
            quoteArea.innerHTML = '"'+ quote + '"';

            if(source){
                sourceElement.innerHTML = " - " + source;
            }
        }
        else{
            quoteArea.innerHTML = "Bad JSON response.";
        }
    };

    var init = function(){
        quoteArea = document.querySelector("#quote-area");
        sourceElement = document.querySelector("#source-area");

        document.querySelector("#twitter-btn").addEventListener("click", tweetQuote);
        document.querySelector("#nxt-btn").addEventListener("click", nextQuote);
        nextQuote();
    };
    window.addEventListener("load", init);
})();