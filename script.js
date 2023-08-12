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
const getCountryDataP = function (country) {
  const requestP = fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => response.json())
    .then(data => {
      renderCountry(data[0]);
      // get neighbour countries promise
      const [...neighboursP] = data[0].borders;

      if (neighboursP.length === 0) return;

      // country 2 promise
      const neighbourPromises = neighboursP.map(neighbourP => {
        return fetch(`https://restcountries.com/v3.1/alpha/${neighbourP}`).then(
          response => response.json()
        );
      });
      Promise.all(neighbourPromises).then(dataItems => {
        dataItems.forEach(dataItem => {
          renderCountry(dataItem[0], 'neighbour');
        });
      });
    })
    .catch(err => {
      console.error(`${err}`);
      renderError(`Something went wrong ${err.message}. Please try again.`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryDataP('Nigeria');
});
