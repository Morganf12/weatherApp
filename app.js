const yargs = require ('yargs');
const request = require ('request');


const argv = yargs
.options({
	a: {
		demand: true,
		alias: 'address',
		describe: 'address used for fetching weather',
		string: true
	}
}).help()
.alias('help', 'h')
.argv;

var geocodeAddress = (address, callback)=>{
	var location=encodeURIComponent(address);
	request({
		url: 'https://maps.googleapis.com/maps/api/geocode/json?address=${address}',
		json: true
	},(error,response,body)=>{
		if (error){
			callback ('Error with googlemaps');
		}
		else{
			callback (undefined, {
				address: body.results[0].formatted_address,
				lat: body.results[0].geometry.location.lat,
				lng: body.results[0].geometry.location.lng,
			});
		}
	})
}

var getWeather = (lat, lng, callback)=>{
	request({
		url: 'https://api.darksky.net/forecast/41c73172c9b00a44ab7bfad8f73cbfbf/${lat},${lng}',
		json: true
	},(error,response,body)=>{
		if (error){
			callback ('Error with darksky')
		}
		else{
			callback (undefined, {
				summary: body.currently.summary,
				precipitation: body.currently.precipProbability,
				temp: body.currently.temperature,
				apparentTemp: body.currently.apparentTemperature,
				windSpeed: body.currently.windSpeed,
				humidity: body.currently.humidity,
				cloudCover: body.currently.cloudCover
			});
		}
	}) 
}


geocodeAddress(argv.address,(errorMessage, results)=>{
	if (errorMessage){
		console.log ('Program did not work', errorMessage);

	}
	else{
		console.log ('Thanks for using weather app');
		console.log (results.address);
		getWeather(results.lat, results.lng, (err, weatherResults)=>{
			if (err){
				console.log ('Program did not work', err);
			}
			else{
				console.log ('summary: ${weatherResults.summary}');
				console.log ('precipitation: ${weatherResults.precipitation} percent');
				console.log ('temperature: ${weatherResults.temp}');
				console.log ('apparent temperature: ${weatherResults.apparentTemp}');
				console.log ('wind speed: ${weatherResults.windSpeed}');
				console.log ('humidity: ${weatherResults.humidity} percent');
				console.log ('cloud cover: ${weatherResults.cloudCover percent');
			}

		});

	}


})

