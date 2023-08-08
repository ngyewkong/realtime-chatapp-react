import axios from "axios";


let realTimeWeatherData; 
 async function getSgWeather() {
    const realTimeWeatherJSON = await axios.get("https://api.data.gov.sg/v1/environment/4-day-weather-forecast");
    realTimeWeatherData = realTimeWeatherJSON;

    console.log(realTimeWeatherData);  
    return realTimeWeatherData; 
 }

 getSgWeather();

export const realTimeWeatherInfo = realTimeWeatherData;

console.log(realTimeWeatherInfo);

export const weatherData = `
<city>
<loc>Singapore</loc>
<desc>Weekly Forecast is cloudy, with heavy thunderstorms in the afternoon.</desc>
</city>
<city>
<loc>Johor</loc>
<desc>Weekly Forecast is cloudy, with heavy thunderstorms in the afternoon.</desc>
</city>
<city>
<loc>Hong Kong</loc>
<desc>Weekly Forecast is sunny, with temperatures reaching 34 deg celsius.</desc>
</city>
<city>
<loc>Taiwan</loc>
<desc>Weekly Forecast is sunny, with temperatures reaching 34 deg celsius.</desc>
</city>
<city>
<loc>London</loc>
<desc>Weekly Forecast is scattered clouds, with light showers.</desc>
</city>
<city>
<loc>New York</loc>
<desc>Weekly Forecast is foggy, with visibility of 5m radius.</desc>
</city>
<city>
<loc>Los Angeles</loc>
<desc>Weekly Forecast is clear and sunny, with daily high temperatures reaching 38 deg celsius.</desc>
</city>
<city>
<loc>Osaka</loc>
<desc>Weekly Forecast is clear and sunny, with daily high temperatures reaching 38 deg celsius.</desc>
</city>
<city>
<loc>Toronto</loc>
<desc>Weekly Forecast is snowy, with temperatures as low as sub 15 deg celsius.</desc>
</city>
<city>
<loc>Melbourne</loc>
<desc>Weekly Forecast is hazy & sunny, with PMI levels at 80-100 (Bad).</desc>
</city>
`