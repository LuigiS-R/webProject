function onLoad(){

    const currentDate = new Date();
    const time = currentDate.getHours();
    console.log(time);

    var coordinates = {latitude:0, coordinates:0}

    var getLocation = new Promise((resolve, reject)=>{
        if (!navigator.geolocation){
            console.log('Error, Geolocation not available')
        }
    
        function success(pos){
            coordinates.latitude = pos.coords.latitude
            coordinates.longitude = pos.coords.longitude

            const requestUrl = `http://localhost:3000/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
            fetch(requestUrl)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    document.getElementById("locationName").textContent = (data.location).toUpperCase();
                    if (time >= 6 && time < 18){
                        document.getElementById('timeImage').src = './Images/sun.png'
                    }
                    else{
                        document.getElementById('timeImage').src = './Images/moon.svg'
                    }
                    document.getElementById("dynamicTemperature").innerHTML ="<b>" + parseInt(data.temperature - 273.15, 10)+ "&#176;C</b>";
                    document.getElementById("dynamicHumidity").innerHTML ="<b>" + parseInt(data.humidity)+ "%</b>";
                })

            const requestUrl2 = `http://localhost:3000/pollution?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
            fetch(requestUrl2)
                .then(response => response.json())
                .then(data => {
                    document.getElementById("dynamicPm25").innerHTML = "<b>"+data.pm2_5+" &#956;g/m&sup3;</b>";
                    document.getElementById("dynamicPm10").innerHTML = "<b>"+data.pm10+" &#956;g/m&sup3;</b>";
                    document.getElementById("dynamicNh3").innerHTML = "<b>"+data.nh3+" ppb</b>";
                    document.getElementById("dynamicSo2").innerHTML = "<b>"+data.so2+" ppb</b>";
                })
        }
    
        function error(){
            reject('Error while retrieving the location')
        }
    
        navigator.geolocation.getCurrentPosition(success, error)
    })
}

function getForecast(){
    console.log("getForecast");
    document.getElementById("forecastContainer").style.height = "100px";
}