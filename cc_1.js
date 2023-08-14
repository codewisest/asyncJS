'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

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
    })
    .catch(err => {
      console.log(`Something went wrong ${err.message}. Please try again`);
    });
};

btn.addEventListener('click', function () {
  whereAmI(51.50354, -0.12768);
});
