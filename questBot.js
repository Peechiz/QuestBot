console.log('The QuestGiverNPC is alive');

var Twit = require('twit');
var rp = require('request-promise');
require('dotenv').load();

var wordnikApi = process.env.WORDNIK_API_KEY;

var T = new Twit({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
});


// ------------------------------------------------------------------------ //


function tweetQuest(quest) {

	function tweeted(err, data, response) {
		if (err) {
			console.log("Something went terribly wrong, and I didn't tweet.");
			console.log('error: '+ err);
			console.log('data: ' + data);
		} else {
			console.log("I tweeted:",quest);
		}
	}

	T.post('statuses/update', {status: quest}, tweeted);

};


// ------------------------------------------------------------------------ //

var locationRoots = ['plateau', 'swamp', 'forest', 'cavern', 'palace'];

function randomItem(arr) {
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
}

function randomNumber() {
  return Math.ceil(Math.random()*100+1).toString()
}

var getAdj = {
  uri: 'http://api.wordnik.com/v4/words.json/randomWords',
  qs: {
      hasDictionaryDef: true,
      includePartOfSpeech: 'adjective',
      limit: 2,
      minCorpusCount: 100,
      api_key: wordnikApi
  },
  headers: {
      'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response
};

var getNounPl = {
  uri: 'http://api.wordnik.com:80/v4/words.json/randomWord',
  qs: {
    hasDictionaryDef: true,
    includePartOfSpeech: 'noun-plural',
    excludePartOfSpeech: 'proper-noun-plural',
    minCorpusCount: 0,
    maxCorpusCount: -1,
    minDictionaryCount: 1,
    maxDictionaryCount: -1,
    minLength: 5,
    maxLength: -1,
    api_key: wordnikApi
  },
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response
}

var getLocation = {
  uri: `http://api.wordnik.com:80/v4/word.json/${randomItem(locationRoots)}/relatedWords`,
  qs: {
    useCanonical: false,
    relationshipTypes: 'same-context',
    limitPerRelationshipType: 30,
    api_key: wordnikApi
  },
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response
}

function quest(){
  var adj1 = rp(getAdj),
  adj2 = rp(getAdj),
  nounPl = rp(getNounPl),
  location = rp(getLocation);

  Promise.all([adj1,adj2,nounPl,location])
  .then(values => {
    var adj1 = values[0][0].word,
    adj2 = values[1][0].word,
    nounPl = values[2].word,
    location = randomItem(values[3][0].words);

    var fetch = [
      `Bring me ${randomNumber()} ${adj1} ${nounPl} from the ${adj2} ${location}!`,
      `Hero! Can you get me ${randomNumber()} ${adj1} ${nounPl}? I am far too ${adj2}.`,
      `Alas! Without ${randomNumber()} ${nounPl}, our village is doomed!`
    ]

    var quest = randomItem(fetch);
    tweetQuest(quest);
  })
}


// ------------------------------------------------------------------------ //
quest()
setInterval(function() {
  try {
    quest();
  }
  catch (e) {
    console.log(e);
  }
},1000*60*15);
