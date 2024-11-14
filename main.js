function onLoad(){
    const requestUrl = `http://localhost:3000/weather`;
    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data.name)
        })
}