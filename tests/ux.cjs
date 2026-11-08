const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');
const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core');
const root = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'strobo-ux-'));
function video(name, size, duration = 3, sound = false) {
  const file = path.join(tmp, name + '.webm');
  const args = ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', `testsrc2=size=${size}:rate=20:duration=${duration}`];
  if (sound) args.push('-f', 'lavfi', '-i', `sine=frequency=440:duration=${duration}`, '-c:a', 'libopus');
  args.push('-c:v', 'libvpx-vp9', '-b:v', '200k', file);
  execFileSync('ffmpeg', args);
  return file;
}
(async () => {
  const motion = video('motion', '320x180', 3, true);
  const portrait = video('portrait', '720x1280', 1);
  const large = video('large', '1920x1080', .3);
  const invalid = path.join(tmp, 'invalid.webm'); fs.writeFileSync(invalid, 'invalid media');
  const browser = await chromium.launch({ headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--no-sandbox'] });
  const errors = [];
  const context = await browser.newContext({ reducedMotion: 'reduce', locale: 'de-DE', viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  context.on('page', p => { p.setDefaultTimeout(10000); p.on('pageerror', e => errors.push(e.message)); });
  const page = await context.newPage();
  const url = pathToFileURL(path.join(root, 'index.html')).href;
  const visible = id => page.locator('#' + id).isVisible();
  const text = id => page.locator('#' + id).textContent();
  async function load(file) { await page.locator('#file-input').setInputFiles(file); await page.waitForFunction(() => !document.getElementById('create-button').disabled); }
  async function create() { await page.locator('#create-button').click(); await page.waitForFunction(() => !document.getElementById('download-button').disabled && document.getElementById('progress-overlay').hidden); }
  async function keyMeasurement() {
    await page.locator('#measure-canvas').focus(); await page.keyboard.press('Enter');
    await page.keyboard.press('Shift+ArrowRight'); await page.keyboard.press('Shift+ArrowRight'); await page.keyboard.press('Enter');
  }
  try {
    await page.goto(url);
    await load(motion);
    await page.locator('#video-tab').click();
    await page.evaluate(() => { document.getElementById('video-player').currentTime = .5; });
    await page.locator('#use-start').click();
    assert.equal(await page.locator('#start-time').inputValue(), '0,5');
    await page.locator('#end-time').fill('abc');
    assert.match(await text('end-time-error'), /Zahl/);
    await page.locator('#end-time').fill('1,5'); await page.locator('#start-time').fill('-1'); assert.match(await text('start-time-error'), /negativ/);
    await page.locator('#start-time').fill('20'); assert.match(await text('start-time-error'), /Videoende/);
    await page.locator('#start-time').fill('.5'); await page.locator('#end-time').fill('.4'); assert.match(await text('end-time-error'), /nach dem Start/);
    await page.locator('#end-time').fill('20'); assert.match(await text('end-time-error'), /Videoende/);
    await page.locator('#end-time').fill('1,5'); await page.locator('#frequency').fill('10,5');
    assert.equal(await page.locator('#frequency').getAttribute('aria-invalid'), null);
    await page.locator('#frequency').fill('10');
    await create();
    assert.match(await text('result-parameters'), /10 Hz/);
    assert.match(await page.locator('.frame-item').first().getAttribute('aria-label'), /0,000 Sekunden seit Abschnittsbeginn, 0,500 Sekunden im Video/);
    await page.locator('.frame-item').first().click();
    assert.equal(await page.locator('.frame-item').first().getAttribute('aria-pressed'), 'true');
    assert.equal(await visible('show-result'), true);
    await page.locator('#show-result').click();
    await page.locator('#frequency').fill('20');
    assert.equal(await visible('stale-result'), true);
    assert.match(await text('download-label'), /Vorheriges Ergebnis/);
    await page.locator('#frequency').fill('10'); assert.equal(await visible('stale-result'), false);
    await page.locator('#grid-overlay').check(); assert.equal(await visible('stale-result'), false);
    console.log('PASS settings, validation, decimal comma, video position, time basis, stale result and overlays');

    await page.locator('#measure-button').click();
    await keyMeasurement();
    assert.match(await text('measurement-value'), /20,0 px/);
    await page.locator('.measurement-name').fill('Referenz');
    await page.locator('#known-distance').fill('10,5'); await page.locator('#calibrate-button').click();
    assert.match(await text('measurement-value'), /10,50 cm/);
    await page.locator('.measurement-select').focus(); await page.keyboard.press('Enter');
    assert.equal(await page.locator('.measurement-select').evaluate(el => document.activeElement === el), true);
    // Numeric correction of reference keeps the known physical length, updates all derived scales.
    const ax = Number((await page.locator('#point-ax').inputValue()).replace(',', '.'));
    await page.locator('#point-bx').fill(String(ax + 40)); await page.locator('#apply-points').click();
    assert.match(await text('measurement-value'), /10,50 cm/);
    // Drag an endpoint using actual pointer events and retain the calibrated reference length.
    const canvasBox = await page.locator('#measure-canvas').boundingBox();
    const ay = Number((await page.locator('#point-ay').inputValue()).replace(',', '.'));
    const oldBx = await page.locator('#point-bx').inputValue();
    await page.mouse.move(canvasBox.x + (ax + 40) / 320 * canvasBox.width, canvasBox.y + ay / 180 * canvasBox.height);
    await page.mouse.down(); await page.mouse.move(canvasBox.x + (ax + 60) / 320 * canvasBox.width, canvasBox.y + ay / 180 * canvasBox.height, { steps: 5 }); await page.mouse.up();
    assert.notEqual(await page.locator('#point-bx').inputValue(), oldBx);
    assert.equal(await page.locator('#measurement-list li').count(), 1);
    assert.match(await text('measurement-value'), /10,50 cm/);
    await page.locator('#label-position').focus(); await page.keyboard.press('ArrowRight');
    await page.locator('#clear-measurements').click(); assert.equal(await page.locator('#measurement-list li').count(), 0);
    await page.locator('#undo-measurement').click();
    assert.equal(await page.locator('#measurement-list li').count(), 1);
    assert.equal(await page.locator('.measurement-name').inputValue(), 'Referenz');
    assert.match(await text('calibration-note'), /Referenz entspricht 10,50 cm/);
    await page.locator('.measurement-remove').click(); await page.locator('#undo-measurement').click();
    assert.equal(await page.locator('#measurement-list li').count(), 1);
    // Visible dialog feedback, not an obscured body toast.
    await page.locator('#reset-measurement').click(); await page.keyboard.press('Enter'); await page.keyboard.press('Enter');
    assert.match(await text('measurement-feedback'), /unterschiedliche Punkte/);
    await page.keyboard.press('Backspace');
    console.log('PASS keyboard measurement, calibration, coordinate and label correction, focus, deletion undo, dialog feedback');
    await page.locator('[aria-label="Messwerkzeug schließen"]').click();
    const before = await text('result-parameters');
    page.once('dialog', d => d.dismiss()); await page.locator('#create-button').click();
    assert.equal(await text('result-parameters'), before); assert.equal(await page.locator('#measurement-list li').count(), 1);
    page.once('dialog', d => d.dismiss()); await page.locator('#remove-video').click();
    assert.equal(await page.locator('#measurement-list li').count(), 1);
    // A failed replacement must preserve the previous result, not just require another upload.
    page.once('dialog', d => d.dismiss()); await page.locator('#file-input').setInputFiles(motion);
    assert.equal(await page.locator('#file-input').inputValue(), '');
    assert.equal(await text('result-parameters'), before);
    page.once('dialog', d => d.accept()); await page.locator('#file-input').setInputFiles(invalid);
    await page.waitForFunction(() => !document.getElementById('file-error').hidden);
    assert.equal(await text('result-parameters'), before);
    assert.equal(await page.locator('#measurement-list li').count(), 1);
    console.log('PASS cancelled destructive actions and unreadable replacement preserve work');
    // Abort keeps an existing result and clearly marks newly edited settings.
    await page.locator('#frequency').fill('120'); await page.locator('#end-time').fill('2,5');
    page.once('dialog', d => d.accept()); await page.locator('#create-button').click();
    await page.locator('#cancel-button').click();
    await page.waitForFunction(() => document.getElementById('progress-overlay').hidden);
    assert.equal(await visible('stale-result'), true); assert.equal(await page.locator('#measurement-list li').count(), 1);
    // Actual PNG pixels must equal the visible decorated canvas.
    const downloadPromise = page.waitForEvent('download'); await page.locator('#download-button').click();
    const download = await downloadPromise; const saved = path.join(tmp, 'result.png'); await download.saveAs(saved);
    const buffer = fs.readFileSync(saved);
    assert.match(download.suggestedFilename(), /10Hz/);
    const equal = await page.evaluate(async base64 => {
      const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const image = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
      const source = document.getElementById('result-canvas');
      const copy = document.createElement('canvas'); copy.width = image.width; copy.height = image.height;
      const ctx = copy.getContext('2d'); ctx.drawImage(image, 0, 0);
      const a = ctx.getImageData(0, 0, image.width, image.height).data;
      const b = source.getContext('2d').getImageData(0, 0, source.width, source.height).data;
      return source.width === image.width && source.height === image.height && a.length === b.length && a.every((n, i) => n === b[i]);
    }, buffer.toString('base64'));
    assert.equal(equal, true);
    // Native unload protection remains after an export, since editability is not saved by PNG.
    const leave = page.waitForEvent('dialog'); const reload = page.reload(); const leaveDialog = await leave;
    assert.equal(leaveDialog.type(), 'beforeunload'); await leaveDialog.dismiss(); await reload.catch(() => {});
    assert.equal(await page.locator('#measurement-list li').count(), 1);
    console.log('PASS abort retains work, exported PNG pixel equality, unload protection after export');
    // A deliberately accepted recreation replaces measurements only on success.
    await page.locator('#frequency').fill('10'); await page.locator('#end-time').fill('1,5');
    page.once('dialog', d => d.accept()); await create();
    assert.equal(await page.locator('#measurement-list li').count(), 0);
    await page.locator('#video-tab').click(); await page.evaluate(() => document.getElementById('video-player').play());
    await page.locator('#measure-button').click();
    assert.equal(await page.locator('#video-player').evaluate(el => el.paused), true);
    await page.locator('[aria-label="Messwerkzeug schließen"]').click();
    page.once('dialog', d => d.accept()); await page.locator('#remove-video').click();
    assert.equal(await page.locator('#dropzone').evaluate(el => document.activeElement === el), true);
    await load(large); assert.equal(await visible('output-note'), true);
    await page.locator('#file-info').evaluate((el, data) => {
      const transfer = new DataTransfer(); transfer.items.add(new File([Uint8Array.from(atob(data), c => c.charCodeAt(0))], 'dropped.webm', { type: 'video/webm' }));
      el.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }));
    }, fs.readFileSync(motion).toString('base64'));
    await page.waitForFunction(() => document.getElementById('file-name').textContent === 'dropped.webm');
    console.log('PASS successful recreation clears measurements, audio pauses, removal focus, output resolution');
    // Mobile layout and genuine touch events in a dedicated context.
    const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce', locale: 'de-DE' });
    const m = await mobile.newPage(); m.on('pageerror', e => errors.push(e.message));
    await m.goto(url);
    assert.equal(await m.locator('.local-note').isVisible(), true); assert.match(await m.locator('.scene-label').textContent(), /Beispiel mit 10 Hz/);
    await m.locator('#file-input').setInputFiles(portrait); await m.waitForFunction(() => !document.getElementById('create-button').disabled);
    await m.locator('#create-button').click(); await m.waitForFunction(() => !document.getElementById('download-button').disabled);
    const fits = await m.locator('#result-canvas').evaluate(canvas => {
      const a = canvas.getBoundingClientRect(), b = canvas.parentElement.getBoundingClientRect();
      return a.top >= b.top - 1 && a.bottom <= b.bottom + 1 && a.left >= b.left - 1 && a.right <= b.right + 1;
    });
    assert.equal(fits, true);
    for (const viewport of [{ width: 375, height: 640 }, { width: 768, height: 1024 }]) {
      await m.setViewportSize(viewport);
      for (const timeline of [true, false]) {
        await m.locator('#time-labels').setChecked(timeline);
        for (const [tab, media] of [['result-tab', 'result-canvas'], ['video-tab', 'video-player']]) {
          await m.locator('#' + tab).click();
          assert.equal(await m.locator('#' + media).evaluate(el => {
            const a = el.getBoundingClientRect(), b = el.parentElement.getBoundingClientRect();
            return a.top >= b.top - 1 && a.bottom <= b.bottom + 1 && a.left >= b.left - 1 && a.right <= b.right + 1;
          }), true);
        }
      }
    }
    await m.setViewportSize({ width: 375, height: 812 }); await m.locator('#result-tab').click();
    await m.locator('#measure-button').tap();
    let rect = await m.locator('#measure-canvas').boundingBox();
    await m.touchscreen.tap(rect.x + rect.width * .25, rect.y + rect.height * .25);
    await m.touchscreen.tap(rect.x + rect.width * .75, rect.y + rect.height * .75);
    assert.equal(await m.locator('#measurement-list li').count(), 1);
    await m.locator('#zoom-in').tap(); assert.match(await m.locator('#zoom-value').textContent(), /200/);
    assert.equal(await m.locator('.measurement-image').evaluate(el => el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight), true);
    assert.equal(await m.locator('#pan-image').getAttribute('aria-pressed'), 'true');
    rect = await m.locator('.measurement-image').boundingBox();
    const session = await mobile.newCDPSession(m);
    const cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2;
    const priorScroll = await m.locator('.measurement-image').evaluate(el => el.scrollTop);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx, y: cy }] });
    for (let i = 1; i <= 6; i++) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx, y: cy - i * 10 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await m.waitForFunction(old => document.querySelector('.measurement-image').scrollTop !== old, priorScroll);
    assert.equal(await m.locator('#measurement-list li').count(), 1);
    await m.locator('#zoom-fit').tap();
    const x = await m.locator('#point-ax').inputValue(); await m.locator('#point-ax').fill('10'); await m.locator('#apply-points').tap();
    assert.notEqual(await m.locator('#point-ax').inputValue(), x);
    assert.equal(await m.locator('#point-ax').evaluate(el => getComputedStyle(el).fontSize), '16px');
    await m.screenshot({ path: path.join(tmp, 'mobile.png') });
    await mobile.close();
    console.log('PASS mobile portrait fits, touch measurement, zoom/scroll, point correction, 16px input');
    // Persistent quality warning on a deliberately one-frame interval.
    page.once('dialog', d => d.accept()); await page.locator('#file-input').setInputFiles(motion);
    await page.waitForFunction(() => !document.getElementById('create-button').disabled);
    await page.locator('#end-time').fill('0,01'); await create();
    assert.match(await text('quality-text'), /Nur ein Bild/);
    await page.locator('#quality-settings').click(); assert.equal(await page.locator('#start-time').evaluate(el => el === document.activeElement), true);
    await page.locator('#fullscreen-button').click(); await page.waitForFunction(() => !!document.fullscreenElement);
    await page.locator('#exit-fullscreen').waitFor({ state: 'visible' }); assert.equal(await visible('exit-fullscreen'), true); await page.locator('#exit-fullscreen').click();
    await page.waitForFunction(() => !document.fullscreenElement);
    await page.waitForFunction(() => document.activeElement === document.getElementById('fullscreen-button'));
    await page.locator('#measure-button').click();
    await keyMeasurement();
    for (let i = 0; i < 2; i++) {
      await page.locator('#reset-measurement').click();
      await page.keyboard.press('Shift+ArrowDown'); await page.keyboard.press('Shift+ArrowDown'); await page.keyboard.press('Enter');
      await page.keyboard.press('Shift+ArrowLeft'); await page.keyboard.press('Shift+ArrowLeft'); await page.keyboard.press('Enter');
    }
    for (let i = 0; i < 3; i++) await page.locator('.measurement-name').nth(i).fill('Messung ' + (i + 1));
    await page.locator('.measurement-visibility').nth(1).click();
    await page.locator('.measurement-label-controls input').nth(2).uncheck();
    await page.locator('.measurement-select').first().click();
    await page.locator('#known-distance').fill('10'); await page.locator('#calibrate-button').click();
    const snapshot = () => page.locator('#measurement-list li').evaluateAll(items => items.map(el => ({
      name: el.querySelector('input').value, visible: el.dataset.visible,
      lengthShown: el.querySelector('[type=checkbox]').checked,
      selected: el.querySelector('.measurement-select').getAttribute('aria-pressed'),
      length: el.querySelector('strong').textContent,
    })));
    const three = await snapshot(); assert.equal(three.length, 3);
    await page.locator('#clear-measurements').click(); await page.locator('#undo-measurement').click();
    assert.deepEqual(await snapshot(), three);
    assert.match(await text('calibration-note'), /Messung 1 entspricht 10,00 cm/);
    assert.deepEqual(errors, []);
    console.log('PASS persistent quality guidance, visible fullscreen exit, three-measurement undo preserves names, visibility, length labels, selection and calibration, no runtime exceptions');
    console.log('Artifacts: ' + tmp);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
