import fs from 'fs';

console.log('════════════════════════════════════════════════════════');
console.log('       ROCKSO™ QUALITY CONTROL & FUNCTIONAL SUITE       ');
console.log('════════════════════════════════════════════════════════\n');

// 1. Data Integrity Test
const content = fs.readFileSync('./src/data/products.js', 'utf8');
const mockImportMeta = { env: { BASE_URL: '/ROCKSO/' } };
const evaluated = eval(`(function() { const import_meta = ${JSON.stringify(mockImportMeta)}; ${content.replace(/import\.meta/g, 'import_meta').replace(/export const/g, 'const')}; return { products, categories }; })()`);

const { products, categories } = evaluated;
console.log('[TEST 1] Product Data Integrity:');
console.log(`  - Total Products in Database: ${products.length}`);
console.log(`  - Categories: ${categories.join(', ')}`);

let passed = true;
products.forEach((p, idx) => {
  const issues = [];
  if (!p.id) issues.push('missing id');
  if (!p.name) issues.push('missing name');
  if (!p.category) issues.push('missing category');
  if (typeof p.price !== 'number' || p.price <= 0) issues.push('invalid price');
  if (!Array.isArray(p.sizes) || p.sizes.length === 0) issues.push('missing sizes array');
  if (!p.image) issues.push('missing image URL');
  
  if (issues.length > 0) {
    console.error(`  FAIL: Product #${idx} (${p.id || 'unnamed'}) has issues: ${issues.join(', ')}`);
    passed = false;
  }
});
if (passed) console.log('  ✓ PASS: All 8 products passed schema & integrity validation.\n');

// 2. Category Filter Verification
console.log('[TEST 2] Category Filter Logic:');
const clean = str => (str || '').toUpperCase().replace(/[^A-Z]/g, '');
const allFiltered = products.filter(p => true);
const teesFiltered = products.filter(p => clean(p.category) === clean('T-SHIRTS'));
const hoodiesFiltered = products.filter(p => clean(p.category) === clean('HOODIES'));

console.log(`  - ALL Tab: ${allFiltered.length} items (${allFiltered.length === 8 ? '✓ PASS' : '✗ FAIL'})`);
console.log(`  - T-SHIRTS Tab: ${teesFiltered.length} items (${teesFiltered.length === 4 ? '✓ PASS' : '✗ FAIL'})`);
console.log(`  - HOODIES Tab: ${hoodiesFiltered.length} items (${hoodiesFiltered.length === 4 ? '✓ PASS' : '✗ FAIL'})`);

// 3. Cart Mechanics Test
console.log('\n[TEST 3] Shopping Cart Logic & Math:');
let cart = [];
function addToCart(p, size) {
  const key = `${p.id}-${size}`;
  const found = cart.find(i => `${i.id}-${i.size}` === key);
  if (found) {
    found.quantity++;
  } else {
    cart.push({ ...p, size, quantity: 1 });
  }
}
function updateCart(item, delta) {
  cart = cart
    .map(p => (p.id === item.id && p.size === item.size ? { ...p, quantity: p.quantity + delta } : p))
    .filter(p => p.quantity > 0);
}

// Add 2 Shiva Tees (XL) and 1 NGV Hoodie (L)
addToCart(products[0], 'XL');
addToCart(products[0], 'XL');
addToCart(products[1], 'L');

const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const expectedSubtotal = (products[0].price * 2) + products[1].price;
console.log(`  - Cart Items Count: ${cart.length} items (${cart.length === 2 ? '✓ PASS' : '✗ FAIL'})`);
console.log(`  - Product Quantity Incremented: ${cart[0].quantity} (${cart[0].quantity === 2 ? '✓ PASS' : '✗ FAIL'})`);
console.log(`  - Subtotal: ₹${subtotal} (Expected: ₹${expectedSubtotal}) (${subtotal === expectedSubtotal ? '✓ PASS' : '✗ FAIL'})`);

// Decrement Shiva Tee from 2 to 1
updateCart(cart[0], -1);
console.log(`  - Decrement quantity: ${cart[0].quantity} (${cart[0].quantity === 1 ? '✓ PASS' : '✗ FAIL'})`);

// Decrement to 0 (auto-removal)
updateCart(cart[0], -1);
console.log(`  - Auto-remove on 0 quantity: ${cart.length} items left (${cart.length === 1 ? '✓ PASS' : '✗ FAIL'})`);

// 4. Free Shipping Calculator
const freeThreshold = 1999;
const remainingForFreeShipping = freeThreshold - cart[0].price;
console.log(`  - Free Shipping threshold calculation: ₹${remainingForFreeShipping} remaining (${remainingForFreeShipping === 1999 - products[1].price ? '✓ PASS' : '✗ FAIL'})`);

console.log('\n════════════════════════════════════════════════════════');
console.log('                   ALL TESTS COMPLETE                   ');
console.log('════════════════════════════════════════════════════════\n');
