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
