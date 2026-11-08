// Checks the current validation functions and text contrast; browser behavior lives in tests/ux.cjs.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');
function extract(from, to) {
  const start = source.indexOf(from), end = source.indexOf(to, start + from.length);
  assert(start >= 0 && end > start, `Source markers: ${from}`);
  return source.slice(start, end);
}
const fields = {
  frequency: { value: '10,5' }, 'start-time': { value: '0' },
  'end-time': { value: '2' }, sensitivity: { valueAsNumber: 22 }
};
const context = vm.createContext({ state: { duration: 3 }, $: id => fields[id], MAX_FRAMES: 300,
  number: n => n.toLocaleString('de-DE') });
vm.runInContext(extract('function samplingTimes(', '/** An odd'), context);
vm.runInContext(extract('function parseTime(', 'function resultIsStale('), context);
assert.equal(vm.runInContext('settings().frequency', context), 10.5);
assert.equal(vm.runInContext("parseTime('10.5')", context), 10.5);
for (const [id, input, field, pattern] of [
  ['start-time', 'abc', 'start-time', /Zahl/],
  ['start-time', '-1', 'start-time', /negativ/],
  ['start-time', '4', 'start-time', /Videoende/],
  ['end-time', '0', 'end-time', /nach dem Start/],
  ['end-time', '4', 'end-time', /Videoende/],
  ['frequency', '0', 'frequency', /120/],
]) {
  const before = fields[id].value; fields[id].value = input;
  assert.throws(() => vm.runInContext('settings()', context), e => e.field === field && pattern.test(e.message));
  fields[id].value = before;
}
fields.frequency.value = '120'; fields['end-time'].value = '3';
assert.throws(() => vm.runInContext('settings()', context), /höchstens 300/);
function luminance(hex) {
  const rgb = hex.match(/[a-f\d]{2}/gi).map(n => parseInt(n, 16) / 255)
    .map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function cssColor(name) {
  return source.match(new RegExp(`--${name}: (#[a-f\\d]{6});`, 'i'))[1].slice(1);
}
for (const [fg, bg] of [['faint', 'surface'], ['muted', 'accent-soft']]) {
  const a = luminance(cssColor(fg)), b = luminance(cssColor(bg));
  const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  assert(ratio >= 4.5); console.log(`PASS ${fg}/${bg}: ${ratio.toFixed(2)}:1`);
}
console.log('PASS original validation functions: decimal comma/point, invalid values, video bounds, interval ordering, frame limit.');
