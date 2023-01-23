var API_KEY = "ba721f2092f93e85b33980477b5af61d"

function getAverageValue(arr){
    let total = 0
    arr.forEach(e => {
        total += e
    })

    return Math.round(total / arr.length)
}

function getMaxValue(arr){
    return Math.round(Math.max(...arr))
}

function getMinValue(arr){
    return Math.round(Math.min(...arr))
}

function getMostOccurringValue(arr){
    let obj = {}
    arr.forEach(e => {
        if(obj[e] == null){
            obj[e] = 1
        } else {
            obj[e] += 1
        }
    })
    return Object.keys(obj).reduce((a,b) => obj[a] > obj[b] ? a : b)
}

// retrieves city name based off of input and gets the forecast value from another function
function citySearchSubmitted(){
    let cityName = $("#citySearch").val()
    getForecastByCityName(cityName)
    $("#citySearch").val(null)
}

// if the city name has not been searched, populate new data
// if city name has been previously searched, pull data from local storage
async function getForecastByCityName(cityName){
    let forecast
    if(localStorage.getItem(cityName) == null){
        forecast = await getForecast(cityName)
    } else {
        forecast = JSON.parse(localStorage.getItem(cityName))
    }
    addRecentSearch(cityName, forecast)
}

// retrieve 5 day forecast based off coordinates for city
async function getForecast(cityName) {
    let { lat, lon } = await getCoordinates(cityName)
    let current = await getCurrentForecast(lat, lon)
    let five_day = await getFiveDayForecast(lat, lon)
    return {"current": current, "five_day": five_day}
}

// api call to fetch the coordinates for each city from the URL
async function getCoordinates(cityName){
    let url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
    let response = await fetch(url);
    let data = await response.json()
    let lat = data[0].lat // The best match is at index 0
    let lon = data[0].lon // The best match is at index 0
    return { lat, lon }
}

// api call to return the current forecast data from the URL
async function getCurrentForecast(lat, lon){
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    let response = await fetch(url);
    let data = await response.json()
    return data
}

// api call to return the five day forecast data from the URL
async function getFiveDayForecast(lat, lon){
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    let response = await fetch(url);
    let data = await response.json()
    return data
}

// if the city name isn't in local storage, then it will be added as a button in recent searches and will be saved in saved storage
function addRecentSearch(cityName, forecast){
    if(localStorage.getItem(cityName) == null){
        localStorage.setItem(cityName, JSON.stringify(forecast))
        $("#recentSearches").append(
            `<button class="btn btn-secondary" type="button" class='popularCityButton' onclick="getForecast('${cityName}')">${cityName}</button>`
        )
    }
    updatePage(cityName, forecast)
}

// update page display based off of selected city name 
function updatePage(cityName, forecast){
    $("#current").html(null)
    $("#forecast").html(null)
    $("#cityName").text(cityName)

    // get the current weather icon (day version)
    let current_weather = forecast.current.weather[0].icon
    current_weather = current_weather.replace("n", "d")

    // add the current date weather information
    $("#current").append(
        `<div class="card text-white bg-primary mb-3 mx-1" style="width: 80%;">
            <div class="card-header">${dayjs().format("dddd")}</div>
            <div class="card-body">
            <img src="https://openweathermap.org/img/wn/${current_weather}@2x.png" class="card-img-top" alt="...">
                <h5 class="card-title">${Math.round(forecast.current.main.temp)}°F</h5>
                <p>Wind Speed ${Math.round(forecast.current.wind.speed)} MPH</p>
                <p>Humidity ${Math.round(forecast.current.main.humidity)}%</p>
                <hr/>
                <div class="d-flex justify-content-around">
                    <div>Low <br/> ${Math.round(forecast.current.main.temp_min)}°F</div>
                    <div>High <br/> ${Math.round(forecast.current.main.temp_max)}°F</div>
                </div>

            </div>
        </div>`
    )

    // initialize all running lists that will be used to track data for a given day
    let temp = [] 
    let min_temp = [] 
    let max_temp = [] 
    let weather = [] 
    let wind = [] 
    let humidity = [] 

    // get the first most date and initialize temporary date variable
    let current_date = dayjs.unix(forecast.five_day.list[0].dt).format('dddd')
    let temp_date

    // loop over the 40 entries of forecast data
    for (var i = 0; i < forecast.five_day.list.length; i++){

        // set temporary date to the current entries date
        temp_date = dayjs.unix(forecast.five_day.list[i].dt).format('dddd')

        // if the current date is not equal to the temp date, we must be on a new date
        if (current_date != temp_date){

            // update the current date
            current_date = temp_date

            // get the current weather icon (day version)
            current_weather = getMostOccurringValue(weather)
            current_weather = current_weather.replace("n", "d")

            // append weather information for that specific date
            $("#forecast").append(
                `<div class="card text-white bg-secondary mb-3 mx-1" style="max-width: 18rem;">
                    <div class="card-header">${temp_date}</div>
                    <div class="card-body">
                    <img src="https://openweathermap.org/img/wn/${current_weather}@2x.png" class="card-img-top" alt="...">
                        <h5 class="card-title">${getAverageValue(temp)}°F</h5>
                        <p>Wind Speed ${getAverageValue(wind)} MPH</p>
                        <p>Humidity ${getAverageValue(humidity)}%</p>
                        <hr/>
                        <div class="d-flex justify-content-around">
                            <div>Low <br/> ${getMinValue(min_temp)}°F</div>
                            <div>High <br/> ${getMaxValue(max_temp)}°F</div>
                        </div>

                    </div>
                </div>`
            )
            // <p class="card-text">Low of ${getMinValue(min_temp)}°F and a High of ${getMaxValue(max_temp)}°F.</p>
            
            // reset all lists
            temp = [] 
            min_temp = [] 
            max_temp = [] 
            weather = [] 
            wind = [] 
            humidity = [] 
        }
        // add the current entry into our running lists
        temp.push(forecast.five_day.list[i].main.temp)
        min_temp.push(forecast.five_day.list[i].main.temp_min)
        max_temp.push(forecast.five_day.list[i].main.temp_max)
        weather.push(forecast.five_day.list[i].weather[0].icon)
        wind.push(forecast.five_day.list[i].wind.speed)
        humidity.push(forecast.five_day.list[i].main.humidity)

    }
}

// executed on page load
$(function () {
    // ensure a value is entered into the search bar
    $("#citySearch").on('input',function(){
        if ($(this).val().length > 0){
            $("#citySearchSubmit"). attr("disabled", false);
        } else {
            $("#citySearchSubmit"). attr("disabled", true);
        }
    });
    // create a button for each searched city by retrieving information from local storage
    const storedSearches = { ...localStorage };
    Object.keys(storedSearches).forEach(e => {
        $("#recentSearches").append(
            `<button class="btn btn-secondary" type="button" onclick="getForecastByCityName('${e}')">${e}</button>`
        )
    })
});
