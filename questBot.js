console.log('The QuestGiverNPC is alive');

var Twit = require('twit');
var rp = require('request-promise');
require('dotenv').load();
require('locus');

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

var locations = ['plateau', 'swamp', 'forest', 'cavern', 'palace', 'sewer'];
var occupations = ['king','duke', 'witch', 'blacksmith', 'tyrant', 'vagabond', 'warrior'];
var loot = ['head','arm','sword','soul','amulet','goblet','sigil','shield','hide'];
var animal = ['yak','lion','dragon','elephant','gorilla','snake','rat'];

var names = ['Abrielle ' ,'Adair' ,'Adara' ,'Adriel' ,'Aiyana' ,'Alissa' ,'Alixandra' ,'Altair' ,'Amara' ,'Anatola' ,'Anya' ,'Arcadia' ,'Ariadne' ,'Arianwen' ,'Aurelia' ,'Aurelian' ,'Aurelius' ,'Avalon' ,'Acalia' ,'Alaire' ,'Auristela' ,'Bastian' ,'Breena' ,'Brielle' ,'Briallan' ,'Briseis' ,'Cambria' ,'Cara' ,'Carys' ,'Caspian' ,'Cassia' ,'Cassiel' ,'Cassiopeia' ,'Cassius' ,'Chaniel' ,'Cora' ,'Corbin' ,'Cyprian' ,'Daire' ,'Darius' ,'Destin' ,'Drake' ,'Drystan' ,'Dagen' ,'Devlin' ,'Devlyn' ,'Eira' ,'Eirian' ,'Elysia' ,'Eoin' ,'Evadne' ,'Eliron' ,'Evanth' ,'Fineas' ,'Finian' ,'Fyodor' ,'Gareth' ,'Gavriel' ,'Griffin' ,'Guinevere' ,'Gaerwn' ,'Ginerva' ,'Hadriel' ,'Hannelore' ,'Hermione' ,'Hesperos' ,'Iagan' ,'Ianthe' ,'Ignacia' ,'Ignatius' ,'Iseult' ,'Isolde' ,'Jessalyn' ,'Kara' ,'Kerensa' ,'Korbin' ,'Kyler' ,'Kyra' ,'Katriel' ,'Kyrielle' ,'Leala' ,'Leila' ,'Lilith' ,'Liora' ,'Lucien' ,'Lyra' ,'Leira' ,'Liriene' ,'Liron' ,'Maia' ,'Marius' ,'Mathieu' ,'Mireille' ,'Mireya' ,'Maylea' ,'Meira' ,'Natania' ,'Nerys' ,'Nuriel' ,'Nyssa' ,'Neirin' ,'Nyfain' ,'Oisin' ,'Oralie' ,'Orion' ,'Orpheus' ,'Ozara' ,'Oleisa' ,'Orinthea' ,'Peregrine' ,'Persephone' ,'Perseus' ,'Petronela' ,'Phelan' ,'Pryderi' ,'Pyralia' ,'Pyralis' ,'Qadira' ,'Quintessa' ,'Quinevere' ,'Raisa' ,'Remus' ,'Rhyan' ,'Rhydderch' ,'Riona' ,'Renfrew' ,'Saoirse' ,'Sarai' ,'Sebastian' ,'Seraphim' ,'Seraphina' ,'Sirius' ,'Sorcha' ,'Saira' ,'Sarielle' ,'Serian' ,'Séverin' ,'Tavish' ,'Tearlach' ,'Terra' ,'Thalia' ,'Thaniel' ,'Theia' ,'Torian' ,'Torin' ,'Tressa' ,'Tristana' ,'Uriela' ,'Urien' ,'Ulyssia' ,'Vanora' ,'Vespera' ,'Vasilis' ,'Xanthus' ,'Xara' ,'Xylia' ,'Yadira' ,'Yseult' ,'Yakira' ,'Yeira' ,'Yeriel' ,'Yestin' ,'Zaira' ,'Zephyr' ,'Zora' ,'Zorion' ,'Zaniel' ,'Zarek'];


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

function getRelated(wordArr) {
  return {
    uri: `http://api.wordnik.com:80/v4/word.json/${randomItem(wordArr)}/relatedWords`,
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
}

function quest(){
  var adj1 = rp(getAdj),
  adj2 = rp(getAdj),
  nounPl = rp(getNounPl),
  location = rp(getRelated(locations)),
  occupation = rp(getRelated(occupations)),
  prize = rp(getRelated(loot)),
  beast = rp(getRelated(animal));

  Promise.all([adj1,adj2,nounPl,location, occupation,prize, beast])
  .then(values => {

    var adj1 = values[0][0].word,
        adj2 = values[1][0].word,
        nounPl = values[2].word,
        name = randomItem(names),
        location = randomItem(values[3][0].words),
        occupation = randomItem(values[4][0].words),
        prize = randomItem(values[5][0].words),
        beast = randomItem(values[6][0].words);


    var fetch = [
      `Bring me ${randomNumber()} ${adj1} ${nounPl} from the ${adj2} ${location}!`,
      `#Hero! Can you get me ${randomNumber()} ${adj1} ${nounPl}? I am far too ${adj2}.`,
      `Alas! Without ${randomNumber()} ${nounPl}, our #village is doomed!`,
      `Our #village can have no peace until ${name} the ${adj1} ${occupation} is destroyed!`,
      `Bring me the ${prize} of ${name} the ${occupation}!`,
      `Hunt ${randomNumber()} ${adj1} ${location} ${beast}, and your reward will be great`,
      `The festival cannot commence without ${randomNumber()} ${adj1} ${nounPl}.`,
      `You there, ${occupation}! Make yourself useful and kill these ${location} ${beast}.`
    ]

    var quest = randomItem(fetch);
    // eval(locus)
    tweetQuest(quest);
    // console.log(quest);
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
