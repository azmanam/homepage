(function() {
  const weatherDiv = document.getElementById('weather-display');
  
  function loadWeather() {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=39.1031&longitude=-84.512&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=fahrenheit&timezone=America/New_York&forecast_days=5')
      .then(r => r.json())
      .then(data => {
        const codes = {0:'Clear',1:'Mostly Clear',2:'Partly Cloudy',3:'Overcast',45:'Foggy',48:'Fog',51:'Light Drizzle',53:'Drizzle',55:'Heavy Drizzle',61:'Light Rain',63:'Rain',65:'Heavy Rain',71:'Light Snow',73:'Snow',75:'Heavy Snow',80:'Light Showers',81:'Showers',82:'Heavy Showers',95:'Thunderstorm'};
        const icons = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌧️',53:'🌧️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',71:'🌨️',73:'❄️',75:'❄️',80:'🌦️',81:'🌦️',82:'⛈️',95:'⛈️'};
        const curr = data.current;
        const daily = data.daily;
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        let html = '<div class="weather-current"><span class="weather-icon">' + (icons[curr.weather_code]||'🌡️') + '</span><strong>Cincinnati</strong> <span class="weather-temp">' + Math.round(curr.temperature_2m) + '°F</span> <span class="weather-condition">' + (codes[curr.weather_code]||'') + '</span></div>';
        html += '<div class="weather-forecast">';
        for(let i=0; i<5; i++) {
          const d = new Date(daily.time[i] + 'T00:00:00');
          const dayIcon = icons[daily.weather_code[i]] || '🌡️';
          html += '<span class="forecast-day"><span class="day-name">' + days[d.getDay()] + ' ' + d.getDate() + '</span><span class="day-icon">' + dayIcon + '</span><span class="temps">' + Math.round(daily.temperature_2m_max[i]) + '°/' + Math.round(daily.temperature_2m_min[i]) + '°</span></span>';
        }
        html += '</div>';
        weatherDiv.innerHTML = html;
      })
      .catch(() => { weatherDiv.innerHTML = '<div class="weather-error">Weather unavailable</div>'; });
  }
  
  // Load weather immediately when page loads
  loadWeather();
  
  // Refresh weather every 15 minutes
  setInterval(loadWeather, 15 * 60 * 1000);
  
  // Refresh weather when tab becomes visible (browser opens or switches to tab)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      loadWeather();
    }
  });
  
  // Also refresh when page gets focus (additional trigger for browser opening)
  window.addEventListener('focus', function() {
    loadWeather();
  });
})();
