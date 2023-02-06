let apiKey = "06ad0b2d050e046ea309068e507e408b";
let api;
const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
textInfo = inputPart.querySelector(".info-txt"),
inputValid = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
wIcon = document.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");
inputValid.addEventListener("keyup", e => {
    if (e.key === "Enter" && inputValid.value != "") {
        requestApi(inputValid.value);
    };
});
locationBtn.addEventListener("click", () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onErorr);
    } else {
        alert("Your browser not support geolocation api");
    }
});
function onSuccess(position) {
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}
function onErorr(erorr) {
    textInfo.innerText = erorr.message;
    textInfo.classList.add("error");
}
function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}
function fetchData() {
    textInfo.innerText = "Getting weather details...";
    textInfo.classList.add("padding");
    fetch(api)
    .then(resp => resp.json())
    .then(result => weatherDetails(result));
}
function weatherDetails(info) {
    if(info.cod === "404") {
        textInfo.innerText = `${inputValid.value} isn't Valid City`;
        textInfo.classList.replace("padding", "error");
    } else {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;
        if (id == 800) {
            wIcon.src = "icons/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "icons/storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "icons/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "icons/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "icons/cloud.svg";
        } else if (id >= 300 && id <= 321 || id >= 500 && id <= 531) {
            wIcon.src = "icons/rain.svg";
        }
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humiditry span").innerText = `${humidity}%`;
        textInfo.classList.remove("padding", "error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});