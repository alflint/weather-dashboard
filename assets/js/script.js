var API_KEY = "ba721f2092f93e85b33980477b5af61d"

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
    forecast = await getForecast(cityName)
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
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
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
    let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    let response = await fetch(url);
    let data = await response.json()
    return data
}

// if the city name isn't in local storage, then it will be added as a button in recent searches and will be saved in saved storage
function addRecentSearch(cityName, forecast){
    $("#recentSearches").append(
        `<button class="btn btn-secondary" type="button" class='popularCityButton' onclick="getForecast('${cityName}')">${cityName}</button>`
    )
    updatePage(cityName, forecast)
}

// update page display based off of selected city name 
function updatePage(cityName, forecast){
    //TODO update the page
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
});
