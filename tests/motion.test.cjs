const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '../motion.js'), 'utf8');
function setup(reduced, supported = true, narrow = false) {
  const classes = new Set();
  const element = { classList: { add: key => classes.add(key), remove: key => classes.delete(key) }, getBoundingClientRect: () => ({ top: 2000, bottom: 2400 }) };
  let intersect, change;
  const preference = { matches: reduced, addEventListener: (_, fn) => { change = fn; } };
  const mobile = { matches: narrow, addEventListener() {} };
  class Observer { constructor(fn) { intersect = fn; } observe() {} unobserve() {} disconnect() {} }
  vm.runInNewContext(source, { matchMedia: query => query.includes('max-width') ? mobile : preference, window: supported ? { IntersectionObserver: Observer } : {}, IntersectionObserver: Observer, innerHeight: 800, document: { querySelectorAll: () => [element], addEventListener() {} } });
  return { classes, element, preference, enter: () => intersect([{ target: element, isIntersecting: true }]), change: () => change() };
}
test('reduced motion and unsupported browsers keep content visible', () => {
  assert.equal(setup(true).classes.has('reveal-pending'), false);
  assert.equal(setup(false, false).classes.size, 0);
});
test('scroll reveals offscreen content when it intersects', () => {
  const state = setup(false);
  assert.equal(state.classes.has('reveal-pending'), true);
  state.enter();
  assert.equal(state.classes.has('reveal-pending'), false);
});
test('changing reduced motion reveals all pending content immediately', () => {
  const state = setup(false);
  state.preference.matches = true;
  state.change();
  assert.equal(state.classes.has('reveal-pending'), false);
});
test('mobile content stays visible without scroll reveal', () => {
  assert.equal(setup(false, true, true).classes.has('reveal-pending'), false);
});
