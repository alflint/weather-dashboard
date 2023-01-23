# Weather Dashboard
Boot Camp Challenge 6
Server Side APIs

## About
This project is a weather dashboard built on Javascript, HTML, CSS, Bootstrap v5.0, and utilizes OpenWeather's free API.

### Deployed URL
[weather-dashboard](https://alflint.github.io/weather-dashboard/)

## Summary
The application allows users retrieve weather information given a specific city. Once a user searches for a city, the page will be updated with the current weather for that city as well as the forecast for the following five days. The application utilizes local storage. On the first search of a new city, it will retrieve the information from OpenWeather's API and save the data retrieved to local storage. Moving forward, if a user is to click on the recent search or search for the same city again, it will check to see if data is persisted in local storage and if so it will retrieve it from their rather than making additional API calls.

## Initial Page Load
![Initial](/assets/img/initial.png)

## Searching for Salt Lake City
![Salt Lake City](/assets/img/saltlake.png)

## Searching for Reno
![Reno](/assets/img/reno.png)



## User Story
```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```