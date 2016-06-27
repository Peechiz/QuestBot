console.log('The QuestGiverNPC is alive');

var Twit = require('twit');
var Client = require('node-rest-client').Client;
require('dotenv');

var client = new Client();

var wordnikApi = process.env.WORDNIK_API_KEY;

var T = new Twit({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY
  , consumer_secret:      process.env.TWITTER_CONSUMER_SECRET
  , access_token:         process.env.TWITTER_ACCESS_TOKEN
  , access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
});


// ------------------------------------------------------------------------ //


function tweetQuest(quest) {
	var tweet = quest

	function tweeted(err, data, response) {
		if (err) {
			console.log("Something went terribly wrong, and I didn't tweet.");
			console.log('error: '+ err);
			console.log('data: ' + data);
		} else {
			console.log("I tweeted.");
		}
	}

	T.post('statuses/update', {status: tweet}, tweeted);

};


// ------------------------------------------------------------------------ //


var reltype = 'same-context';
var locationRoots = ['plateau', 'swamp', 'forest', 'cavern', 'palace'];

var getLocationUrl = 	"http://api.wordnik.com:80/v4/word.json/" +
											locationRoots[Math.floor(Math.random()*locationRoots.length)] +
											"/relatedWords?useCanonical=false&relationshipTypes=" +
											reltype +
											"&limitPerRelationshipType=30&api_key=" +
											wordnikApi
;

var getAdjsURL =  "http://api.wordnik.com/v4/words.json/randomWords?" +
                  "hasDictionaryDef=true&includePartOfSpeech=adjective&limit=2&" +
                  "minCorpusCount=100&api_key=" +
                  wordnikApi
;

var getNounPl = "http://api.wordnik.com:80/v4/words.json/randomWord?" +
								"hasDictionaryDef=true&includePartOfSpeech=noun-plural&excludePartOfSpeech=proper-noun-plural&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key="
								+ wordnikApi
;


function fetchQuest() {
	tweet = '';
	client.get(getAdjsURL,
	function(data, response){
		//console.log(data)
		//console.log(response)
		adj1 = data[0].word
		//console.log("Adjective is: " + adj1)

		client.get(getNounPl,
			function(data2, response){
				//console.log(data2)
				nounpl1 = data2.word
				//console.log("Noun Pl is: " + nounpl1)

			client.get(getAdjsURL,
				function(data3, response){
					//console.log(data3)
					adj2 = data3[0].word
					//console.log("Adj2 is: " + adj2)

				client.get(getLocationUrl,
				function(data4,response){
					//console.log(data4)
					location = data4[0].words[Math.floor(Math.random()*data4[0].words.length)]
					//console.log("location is: " + location)

					tweet += "Bring me " + Math.floor(Math.random()*100+2).toString() + " "+ adj1 +
						" " + nounpl1 + " " + "from the " + adj2 + " " + location + "!";

					console.log(tweet)
					tweetQuest(tweet);
				})
			})
		})
	})
};



// TEST
//fetchQuest();
// TEST




function favRTs () {
  T.get('statuses/retweets_of_me', {}, function (e,r) {
    for(var i=0;i<r.length;i++) {
      T.post('favorites/create/'+r[i].id_str,{},function(){});
    }
    console.log('harvested some RTs');
  });
}

function followReply(txt) {

	var tweet = {
		status: txt
	}

	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response){
		if (err) {
			console.log("Something went terribly wrong, and I didn't tweet.");
			console.log('error: '+ err);
			console.log('data: ' + data);
		} else {
			console.log("I tweeted.")
		}
	}
};

// // Setting up a user stream
// var stream = T.stream('user');

// // Anytime someone follows me
// stream.on('follow', followed);

// function followed(event){
// 	console.log("Someone followed me!")
// 	var name = event.source.name;
// 	var screenName = event.source.screen_name;
// 	followReply('.@' + screenName + ' Thanks for your help, adventurer.');
// };

// // every 5 hours, check for people who have RTed a quest, and favorite that quest
// setInterval(function() {
//   try {
//     favRTs();
//   }
//  catch (e) {
//     console.log(e);
//   }
// },60000*60*5);

//every hour, tweet a quest
setInterval(function() {
  try {
    fetchQuest();
  }
  catch (e) {
    console.log(e);
  }
},1000*60*15);
