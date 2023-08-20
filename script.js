'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

///////////////////////////////////////
const renderCountry = function (data, className = ' ') {
  const html = `
    <article class="country ${className}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              data.population / 1000000
            ).toFixed(2)}M people</p>
            <p class="country__row"><span>🗣️</span>${
              Object.values(data.languages)[0]
            }</p>
            <p class="country__row"><span>💰</span>${
              Object.values(data.currencies)[0].name
            }</p>
        </div>
    </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    // render country 1
    renderCountry(data);

    // get neighbour country 2
    const [...neighbours] = data.borders;

    if (neighbours.lenght === 0) return;

    // AJAX call country 2

    neighbours.forEach(neighbour => {
      const request2 = new XMLHttpRequest();
      request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
      request2.send();
      request2.addEventListener('load', function () {
        const [data2] = JSON.parse(this.responseText);

        console.log(data2);
        // render neighbours
        renderCountry(data2, 'neighbour');
      });
    });
  });
};

// getCountryData('nigeria');

// using promise
const getJson = function (url) {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`Country not found ${response.status}`);
    return response.json();
  });
};
const getCountryDataP = function (country) {
  // fetch(`https://restcountries.com/v3.1/name/${country}`)
  //   .then(response => {
  //     if (!response.ok) throw new Error(`Country not found ${response.status}`);
  //     return response.json();
  //   })
  getJson(`https://restcountries.com/v3.1/name/${country}`)
    .then(data => {
      renderCountry(data[0]);
      if (!data[0].borders) throw new Error('No neighbours found');
      // get neighbour countries promise
      const [...neighboursP] = data[0].borders;

      // if (neighboursP.length === 0) return;

      // country 2 promise
      const neighbourPromises = neighboursP.map(neighbourP => {
        // return fetch(`https://restcountries.com/v3.1/alpha/${neighbourP}`).then(
        //   response => {
        //     if (!response.ok)
        //       throw new Error(`Country not found ${response.status}`);

        //     return response.json();
        //   }
        // );
        return getJson(`https://restcountries.com/v3.1/alpha/${neighbourP}`);
      });
      Promise.all(neighbourPromises)
        .then(dataItems => {
          dataItems.forEach(dataItem => {
            renderCountry(dataItem[0], 'neighbour');
          });
        })
        .catch(err => {
          console.error(`${err}`);
          renderError(`Something went wrong ${err.message}. Please try again.`);
        });
    })
    .catch(err => {
      renderError(`Something went wrong ${err.message}. Please try again.`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryDataP('nigeria');
});

const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('lottery draw is happening');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You win!!!');
    } else {
      reject(new Error('You lose!!!'));
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.log(err));

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(2)
  .then(() => {
    console.log('I waited for 2 seconds');
    return wait(1);
  })
  .then(() => {
    console.log('I waited for 1 second');
  });

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      err => reject(err)
    );
  });
};

getPosition().then(pos => console.log(pos));

const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then(response => {
      if (!response.ok) throw new Error(`Too fast ${response.status}`);
      console.log(response);
      return response.json();
    })
    .then(data => {
      console.log(data);
      console.log(data.statename);
      console.log(`You are in ${data.state}, ${data.country}`);
      return data.country;
    })
    .then(country => {
      getCountryDataP(country);
    })
    .catch(err => {
      console.log(`Something went wrong ${err.message}. Please try again`);
    });
};

btn.addEventListener('click', whereAmI);

const whereAreYou = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    const geoRes = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!geoRes.ok) throw new Error('Problem gettin location info');
    const geoData = await geoRes.json();

    const res = await fetch(
      `https://restcountries.com/v3.1/name/${geoData.country}`
    );

    if (!res.ok) throw new Error('Problem gettin country');

    const data = await res.json();
    renderCountry(data[0]);

    return `You are in ${geoData.city}, ${geoData.country}`;
  } catch (error) {
    // console.error(error);
    renderError(`something went wrong ${error}`);
  }
};

console.log('will get location');
// const city = whereAreYou();
// console.log(city);

(async function () {
  try {
    const city = await whereAreYou();
    console.log(city);
  } catch (error) {
    console.log(error);
  } finally {
    console.log('finished getting location');
  }
})();

console.log('FIRST');

const getThreeCountries = async function (
  firstCountry,
  secondCountry,
  thirdCountry
) {
  try {
    const [firstCountryData] = await getJson(
      `https://restcountries.com/v3.1/name/${firstCountry}`
    );
    // const [secondCountryData] = await getJson(
    //   `https://restcountries.com/v3.1/name/${secondCountry}`
    // );
    // const [thirdCountryData] = await getJson(
    //   `https://restcountries.com/v3.1/name/${thirdCountry}`
    // );

    // console.log(
    //   firstCountryData.capital,
    //   secondCountryData.capital,
    //   thirdCountryData.capital
    // );
    const data = await Promise.all([
      getJson(`https://restcountries.com/v3.1/name/${firstCountry}`),
      getJson(`https://restcountries.com/v3.1/name/${secondCountry}`),
      getJson(`https://restcountries.com/v3.1/name/${thirdCountry}`),
    ]);
    console.log(data.map(d => d[0].capital));
  } catch (error) {
    console.log(error);
  }
};

getThreeCountries('nigeria', 'israel', 'canada');

(async function () {
  const res = await Promise.race([
    getJson(`https://restcountries.com/v3.1/name/nigeria`),
    getJson(`https://restcountries.com/v3.1/name/israel`),
    getJson(`https://restcountries.com/v3.1/name/canada`),
  ]);
  console.log(res[0]);
})();
