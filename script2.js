// importing module
// import { addToCart, totalPrice as price, tq } from './shoppingCart.js';

// addToCart('bread', 20);

// console.log(price, tq);

import shoppingCart, * as ShoppingCart from './shoppingCart.js';
import remove from './shoppingCart.js';
console.log('importing module');

ShoppingCart.addToCart('bread', 20);
ShoppingCart.addToCart('apple', 20);
ShoppingCart.addToCart('orange', 20);

remove('beer', 5);

console.log(ShoppingCart.cart);

const ShoppingCart2 = (function () {
  const cart = [];
  const totalPrice = 237;
  const totalQuantity = 23;

  const addToCart = function (product, quantity) {
    cart.push({ product, quantity });
    console.log(`${quantity} ${product} added to cart`);
  };

  const whatIsYourName = function (name) {
    console.log(`My name is ${name}`);
  };

  return { addToCart, whatIsYourName, cart, totalQuantity };
})();

ShoppingCart2.addToCart('akara', 20);

console.log(ShoppingCart2.totalPrice);

import cloneDeep from 'lodash-es/cloneDeep.js';

const state = {
  cart: [
    { product: 'bread', quantity: 5 },
    { product: 'pizza', quantity: 5 },
  ],
  user: { loggedIn: true },
};

const stateClone = Object.assign({}, state);
const stateDeepClone = cloneDeep(state);

state.user.loggedIn = false;
console.log(stateClone);

console.log(stateDeepClone);

if (module.hot) {
  module.hot.accept();
}
