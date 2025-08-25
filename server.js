const form = document.querySelector(".top-banner");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".info-section .cities");
//API key for weather
const apiKey = "df0a849234be69b6d4f9eeed7f06ef66";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = input.value.trim().toLowerCase();

  const cityItems = list.querySelectorAll(".city");
  const cityArray = Array.from(cityItems);

  //flag to check duplicate
  let isDuplicate = false;

  //check for duplicate city
  cityArray.forEach((cityEl) => {
    //retrieve the city-name in the html span
    let cityName = cityEl.querySelector("span").textContent.toLowerCase();

    //check duplicate
    if (cityName === inputValue.toLowerCase()) {
      isDuplicate = true;
    }
  });

  if (isDuplicate) {
    msg.textContent = `You're already know the weather for ${inputValue}.`;
    form.reset();
    input.focus();
    return;
  }

  //Fetch weather
  getWeather(inputValue);
});

//Fetch api data

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      msg.textContent = "City not found";
      return;
    }
    //Ensure data are safe to fetch 
    const data = await response.json();
    showWeather(data);
    msg.textContent = "";
    form.reset();

  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

//Render data to DOM
function showWeather(data) {
  //Retrieve the list element to display info
  const li = document.createElement("li");
  li.classList.add("city");

  //Display info
  li.innerHTML = `
    <h2 class="city-name"> 
     <span>${data.name}</span>, <span>${data.sys.country}
    </h2>
    <div class="city-temp">${Math.round(data.main.temp)}°C</div>
    <figure>
      <img class="city-icon" src="https://openweathermap.org/img/wn/${
        data.weather[0].icon
      }@2x.png" alt="${data.weather[0].description}">
      <figcaption>${data.weather[0].description}</figcaption>
    </figure>
    `;

  list.appendChild(li);
}
