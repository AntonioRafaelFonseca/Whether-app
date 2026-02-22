const tempDisp = document.querySelector('#temp');
const rainDisp = document.querySelector('#rain');
const windDisp= document.querySelector('#wind1');
const dirDispl = document.querySelector('#wind2');
const arrow = document.querySelector('.arr');
const bg = document.querySelector('.bg')

const APIURL = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,is_day,wind_direction_10m,wind_speed_10m,precipitation,rain,weather_code'

function update(temp='None', rain='none', kn='none', dir='none'){
  tempDisp.textContent = temp + 'º';
  rainDisp.textContent = rain + 'mm';
  windDisp.textContent = kn + 'kn'
  dirDispl.textContent = dir + 'º';
}

async function get()
{
  let data;

  await fetch(APIURL)
  .then((res) => {return res.json()})
  .then((d) => {data = d})
  .catch((e) => {console.log(e)})

  weather = {
    cel: data.current.temperature_2m,
    mm: data.current.precipitation,
    kn: data.current.wind_speed_10m,
    dir: data.current.wind_direction_10m,

    isDay: data.current.is_day,
    code: data.current.weather_code
  }
  return weather
}

async function init()
{
  let obj = await get();
  if(obj)
  {
    update(obj.cel, obj.mm, obj.kn, obj.dir)
    arrow.style.transform = `rotate(${obj.dir}deg)`;
    showImg(obj.code)
  }
}

function classifyWeather(code) {
  if (code === 0) return 0;
  if (code >= 1 && code <= 3) return 1;
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return 2;
  if (code >= 95 && code <= 99) return 3;
  return 404;
}

function showImg(code) {
  const c = classifyWeather(code);

  let newBg;

  if (c === 2 || c === 3) {
    newBg = document.createElement("video");
    newBg.src = c === 2 ? "assets/rain.mp4" : "assets/storm.mp4";
    newBg.autoplay = true;
    newBg.loop = true;
    newBg.muted = true;
  } else {
    newBg = document.createElement("img");

    switch (c) {
      case 1:
        newBg.src = "assets/clouds.jpg";
        break;
      default:
        newBg.src = "assets/clearSky.jpg";
    }
  }

  newBg.className = "bg";

  // Replace old background
  bg.replaceWith(newBg);
}
init();
let interval = 6*1000 *20
setInterval(init, interval)