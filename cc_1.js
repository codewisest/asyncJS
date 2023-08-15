'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const whereAmI = function (lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
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
};

// using promise
const getJson = function (url) {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`Country not found ${response.status}`);
    return response.json();
  });
};

const getCountryDataP = function (country) {
  getJson(`https://restcountries.com/v3.1/name/${country}`)
    .then(data => {
      renderCountry(data[0]);
      if (!data[0].borders) throw new Error('No neighbours found');
      // get neighbour countries promise
      const [...neighboursP] = data[0].borders;

      // country 2 promise
      const neighbourPromises = neighboursP.map(neighbourP => {
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
  whereAmI(4.54308, 7.2443);
  whereAmI(4.54308, 7.2443);
  whereAmI(4.54308, 7.2443);
});
