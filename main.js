let myLineChart;

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
                    let CircularBar = document.getElementsByClassName("circular-bar");
                    console.log(CircularBar.item(0))
                    let PercentValue = document.getElementsByClassName("percent");

                    let InitialValue = 0;

                    let pm10Value = data.pm10 * 10;
                    let nh3Value = data.nh3 * 10;
                    let so2Value = data.so2 * 10;

                    let finaleValue = data.pm2_5 * 10;
                    let speed = 40;

                    let timer = setInterval(() => {
                        InitialValue += 1;

                        CircularBar.item(0).style.background = `conic-gradient(#8DE074 ${InitialValue/100 * 360}deg, #e8f0f7 0deg)`;
                        PercentValue.item(0).innerHTML =  `PM 2.5 <br>${data.pm2_5}`;

                        if(InitialValue >= finaleValue){
                            clearInterval(timer);
                        }
                    }, speed)


                    let timerTwo = setInterval(() => {
                        InitialValue += 1;

                        CircularBar.item(1).style.background = `conic-gradient(#8DE074 ${InitialValue/100 * 360}deg, #e8f0f7 0deg)`;
                        PercentValue.item(1).innerHTML =  `PM 10 <br>${data.pm10}`;

                        if(InitialValue >= pm10Value){
                            clearInterval(timerTwo);
                        }
                    }, speed)

                    let timerThree = setInterval(() => {
                        InitialValue += 1;

                        CircularBar.item(2).style.background = `conic-gradient(#8DE074 ${InitialValue/100 * 360}deg, #e8f0f7 0deg)`;
                        PercentValue.item(2).innerHTML =  `NH3 <br>${data.nh3}`;

                        if(InitialValue >= nh3Value){
                            clearInterval(timerThree);
                        }
                    }, speed)

                    let timerFour = setInterval(() => {
                        InitialValue += 1;

                        CircularBar.item(2).style.background = `conic-gradient(#8DE074 ${InitialValue/100 * 360}deg, #e8f0f7 0deg)`;
                        PercentValue.item(2).innerHTML =  `SO2 <br>${data.so2}`;

                        if(InitialValue >= so2Value){
                            clearInterval(timerFour);
                        }
                    }, speed)


                    /*document.getElementById("dynamicPm25").innerHTML = "<b>"+data.pm2_5+" &#956;g/m&sup3;</b>";
                    document.getElementById("dynamicPm10").innerHTML = "<b>"+data.pm10+" &#956;g/m&sup3;</b>";
                    document.getElementById("dynamicNh3").innerHTML = "<b>"+data.nh3+" ppb</b>";
                    document.getElementById("dynamicSo2").innerHTML = "<b>"+data.so2+" ppb</b>";*/
                })
        }
    
        function error(){
            reject('Error while retrieving the location')
        }
    
        navigator.geolocation.getCurrentPosition(success, error)
    })
}

function getForecast(){
    let button = document.getElementById("temperatureTrendButton");
    graph('temperature');
    document.getElementById("forecastContainer").style.height = "150px";
    button.value = "CLOSE GRAPH";
    button.onclick = closeGraph;  
}

function graph(content){
    const requestUrl = `http://localhost:3000/forecast`;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data =>{
            labels = []
            axis = []
            axisSrc = (content === 'temperature')?data.temperature:data.humidity;
            title = (content === 'temperature')?'AVG. TEMPERATURE':'AVG. HUMIDITY';
            yLabel = (content === 'temperature')?'Temperature in C':'Humidity in %';

            for(let i = 0; i<data.date.length; i++){
                labels.push(data.date[i].slice(data.date[i].length-2, data.date[i].length));
                axis.push(axisSrc[i]);
            }
            if (typeof myLineChart != undefined){
                if (myLineChart) {
                    myLineChart.destroy();
                }  
            }  

            // Creating line chart
            let ctx = document.getElementById('myLineChart').getContext('2d');
            myLineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: title,
                            data: axis,
                            borderColor: 'gray',
                            borderWidth: 2,
                            fill: false,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date',
                                font: {
                                    padding: 4,
                                    size: 10,
                                    weight: 'bold',
                                    family: 'Arial'
                                },
                                color: 'black'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: yLabel,
                                font: {
                                    size: 10,
                                    weight: 'bold',
                                    family: 'Arial'
                                },
                                color: 'black'
                            },
                            beginAtZero: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Values',
                            }
                        }
                    }
                }
            });
        })    
}

function closeGraph(){
    let button = document.getElementById("temperatureTrendButton");

    document.getElementById("forecastContainer").style.height = '0px';
    button.value = "CHECK TREND";
    button.onclick = getForecast;
}

function getHumidityForecast(){
    let button = document.getElementById("humidityTrendButton");
    graph('humidity');
    document.getElementById("forecastContainer").style.height = "150px";
    button.value = "CLOSE GRAPH";
    button.onclick = closeHumidityGraph;  
}

function closeHumidityGraph(){
    let button = document.getElementById("humidityTrendButton");

    document.getElementById("forecastContainer").style.height = '0px';
    button.value = "CHECK TREND";
    button.onclick = getHumidityForecast;
}

// Get the textbox element
const textbox = document.getElementById('searchBar');

// Add an event listener for the 'keydown' event
textbox.addEventListener('keydown', function(event) {
    // Check if the pressed key is 'Enter'
    if (event.key === 'Enter') {
        // Get the value of the textbox
        const inputValue = textbox.value;

        // Display the value or use it as needed
        console.log("Hello, world!");

        // Optionally, clear the textbox
        textbox.value = '';
    }
});
