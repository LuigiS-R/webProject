const express = require('express')
const axios = require('axios')
const app = express()

app.use( (req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*')
    next()
})

//Setting a json response from the homepage
app.get('/', (req, res) => res.json({
    'message' : 'Hello World'
}))

app.get('/weather', (req, resp)=>{
    axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat: req.query.lat,
          lon: req.query.lon,
          appid: 'c1348e246938f5fa78a450f0e4f8a755'
        }
      })
      .then(response => {
        resp.json({
            'location': response.data.name,
            'temperature': response.data.main.temp,
            'humidity': response.data.main.humidity
            
        })
        console.log(response)
      })
      .catch(error => {
        console.error('Error:', error);
      });
})

app.get('/pollution', (req, resp)=>{
    axios.get('http://api.openweathermap.org/data/2.5/air_pollution', {
        params: {
          lat: req.query.lat,
          lon: req.query.lon,
          appid: 'c1348e246938f5fa78a450f0e4f8a755'
        }
      })
      .then(response => {
        resp.json({
            'pm2_5': response.data.list[0].components.pm2_5,
            'pm10': response.data.list[0].components.pm10,
            'nh3': response.data.list[0].components.nh3,
            'so2': response.data.list[0].components.so2
            
        })
      })
      .catch(error => {
        console.log('error: ', error);
      });
})

app.get('/forecast', (req, resp)=>{
  axios.get('http://api.weatherapi.com/v1/forecast.json', {
    params:{
      key: '3337f5c175c64ed3a28113820241411',
      q: 'Pusan',
      days:10
    }
  })
  .then(response =>{
    var dates = []
    var temperatures = []
    var humidity = []
    console.log("This is what I am interested in" + response.data.forecast.forecastday.length);
    for(let i = 0; i<3; i++){
      dates.push(response.data.forecast.forecastday[i].date);
      temperatures.push(response.data.forecast.forecastday[i].day.avgtemp_c);
      humidity.push(response.data.forecast.forecastday[i].day.avghumidity);
    }
    resp.json({
      'date' : dates,
      'temperature': temperatures,
      'humidity': humidity
    })
  })
  .catch(error =>{
    console.log("Error:", error)
  })
})

app.listen(3000, ()=>{
    console.log('Listening on port 3000')
})