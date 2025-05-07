function updateClock() {
  const now = new Date();

  const timeZones = {
    'local': Intl.DateTimeFormat().resolvedOptions().timeZone,
    'New-York': 'America/New_York',
    'London': 'Europe/London',
    'Paris': 'Europe/Paris',
    'Tokyo': 'Asia/Tokyo',
  };

  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  
  const isMobile = window.innerWidth <= 500;
  
  Object.keys(timeZones).forEach(city => {
    const cityTime = new Date(new Date().toLocaleString("en-US", { timeZone: timeZones[city] }));

    const hours = cityTime.getHours();
    const minutes = cityTime.getMinutes();
    const seconds = cityTime.getSeconds();

    const day = cityTime.getDate();
    const month = months[cityTime.getMonth()];
    const year = cityTime.getFullYear();
    
    const monthDisplay = isMobile ? month.slice(0, 3) : month;
    document.getElementById(`date-${city}`).textContent = `${day} ${monthDisplay} ${year}`;
    
    document.getElementById(`time-${city}`).textContent = 
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const hourDeg = (360 / 12) * (hours % 12) + (360 / 12) * (minutes / 60);
    const minuteDeg = (360 / 60) * minutes;
    const secondDeg = (360 / 60) * seconds;

    document.getElementById(`hour-${city}`).style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
    document.getElementById(`minute-${city}`).style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
    document.getElementById(`second-${city}`).style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
  });
}

function setLocalCityName() {
  const localElement = document.querySelector('.date-time:nth-child(3) h2');
  if (localElement) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) {
      const parts = timezone.split('/');
      if (parts.length > 1) {
        localElement.textContent = parts[parts.length - 1].replace(/_/g, ' ');
      } else {
        localElement.textContent = 'Local Time';
      }
    }
  }
}

window.onload = function() {
  setLocalCityName();
  setInterval(updateClock, 1000);
  updateClock();
};
