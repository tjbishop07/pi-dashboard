var _ = require('lodash');
var blessed = require('blessed'),
    contrib = require('blessed-contrib');
const config = require('../config');
const weather = require('../services/weather');

var updating = false;

function updateWeatherData(data, temperature, wind, sky) {
  let weatherData = _.head(data.list);

  temperature.setContent(weatherData.main.temp + ' C');
  wind.setContent(weatherData.wind.speed + ' m/s');
  sky.setContent(_.get(_.head(weatherData.weather), 'main'));
  
  temperature.screen.render();
}

function draw(screen) {
  return () => {
    let label = config.weatherLocation;
    let grid = new contrib.grid({
      rows: 1,
      cols: 9,
      label,
      screen
    });

    let temperatureText = grid.set(0, 0, 1, 3, blessed.box, {
      align: 'center',
      label: `Temperature for ${config.weatherLocation}`
    });
    
    let windText = grid.set(0, 3, 1, 3, blessed.box, {
      align: 'center',
      label: 'Wind'
    });

    let skyText = grid.set(0, 6, 1, 3, blessed.box, {
      align: 'center',
      label: 'Sky'
    });
    
    weather.getWeather()
      .then(data => {

	updateWeatherData(data, temperatureText, windText, skyText);
	
	setInterval(() => {
	  weather.getWeather()
	    .then(data => {
	      updateWeatherData(data, temperatureText, windText, skyText);
	    });
	}, 60000);
      });
    

    temperatureText.screen.render();
  };
}

module.exports = {
  drawWeatherScreen: draw
};