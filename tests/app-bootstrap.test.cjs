const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function makeClassList() {
  const names = new Set();
  return {
    add: (...tokens) => tokens.forEach(token => names.add(token)),
    remove: (...tokens) => tokens.forEach(token => names.delete(token)),
    toggle: (token, force) => {
      if (typeof force === 'undefined') {
        if (names.has(token)) {
          names.delete(token);
          return false;
        }
        names.add(token);
        return true;
      }

      if (force) names.add(token);
      else names.delete(token);
      return !!force;
    },
    contains: token => names.has(token),
  };
}

function makeElement(id) {
  return {
    id,
    hidden: false,
    style: {},
    dataset: {},
    value: '',
    disabled: false,
    innerHTML: '',
    textContent: '',
    classList: makeClassList(),
    setAttribute() {},
    appendChild() {},
    remove() {},
    click() {},
    focus() {},
    select() {},
    contains() { return false; },
    closest() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getBoundingClientRect() {
      return { left: 0, top: 0, width: 100, height: 100 };
    },
  };
}

function flushAsyncWork() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

test('app bootstrap renders quick links, open tabs, and saved-for-later without startup errors', async () => {
  const extensionDir = path.join(__dirname, '..', 'extension');
  const elementIds = [
    'greeting',
    'dateDisplay',
    'quickLinksSection',
    'quickLinksEmpty',
    'quickLinksScroller',
    'quickLinksGrid',
    'shortcutSyncBanner',
    'shortcutSyncTitle',
    'shortcutSyncText',
    'shortcutSyncExportBtn',
    'openTabsSection',
    'openTabsMissions',
    'openTabsSectionCount',
    'openTabsSectionTitle',
    'deferredColumn',
    'deferredList',
    'deferredEmpty',
    'deferredCount',
    'deferredArchive',
    'archiveCount',
    'archiveList',
    'tabOutDupeBanner',
    'tabOutDupeCount',
    'toast',
    'toastText',
    'shortcutModalShell',
    'shortcutLogoEditorShell',
  ];
  const elements = new Map(elementIds.map(id => [id, makeElement(id)]));
  const errors = [];

  const document = {
    body: {
      classList: makeClassList(),
      appendChild() {},
    },
    activeElement: null,
    getElementById(id) {
      return elements.get(id) || null;
    },
    addEventListener() {},
    createElement(tagName) {
      return makeElement(tagName);
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    contains() {
      return true;
    },
  };

  const chrome = {
    runtime: {
      id: 'test-extension',
    },
    tabs: {
      async query() {
        return [
          { id: 1, url: 'https://example.com/', title: 'Example', windowId: 1, active: false },
          { id: 2, url: 'https://claude.ai/', title: 'Claude', windowId: 1, active: false },
          { id: 3, url: 'chrome-extension://test-extension/index.html', title: 'Tab Out', windowId: 1, active: true },
        ];
      },
      async remove() {},
      async update() {},
    },
    windows: {
      async getCurrent() {
        return { id: 1 };
      },
      async update() {},
    },
    storage: {
      local: {
        _store: {
          shortcuts: [
            {
              id: 'local-only',
              url: 'https://local.example/',
              title: 'Local Only',
              domain: 'local.example',
              logoMode: 'auto',
              logoDataUrl: '',
              logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
              createdAt: '2026-04-16T00:00:00.000Z',
            },
          ],
          deferred: [
            {
              id: 'saved-1',
              url: 'https://openai.com/',
              title: 'OpenAI',
              savedAt: '2026-04-16T00:00:00.000Z',
              completed: false,
              dismissed: false,
            },
          ],
        },
        async get(key) {
          if (typeof key === 'string') {
            return { [key]: this._store[key] };
          }

          if (Array.isArray(key)) {
            const result = {};
            for (const item of key) result[item] = this._store[item];
            return result;
          }

          return { ...this._store };
        },
        async set(nextValues) {
          Object.assign(this._store, nextValues);
        },
      },
    },
  };

  const context = {
    Blob,
    Date,
    FileReader: class {},
    JSON,
    Math,
    Number,
    Object,
    Promise,
    RegExp,
    String,
    URL,
    Array,
    clearTimeout,
    chrome,
    confirm: () => true,
    console: {
      error: (...args) => errors.push(args.join(' ')),
      log() {},
      warn() {},
    },
    document,
    setTimeout,
    window: null,
  };
  context.window = {
    chrome,
    clearTimeout,
    confirm: () => true,
    document,
    location: { href: '' },
    matchMedia: () => ({ matches: false }),
    setTimeout,
  };
  context.globalThis = context;
  context.window.globalThis = context;

  for (const file of ['shortcuts-core.js', 'shortcuts.sync.js', 'app.js']) {
    const code = fs.readFileSync(path.join(extensionDir, file), 'utf8');
    vm.runInNewContext(code, context, { filename: file });
  }

  await flushAsyncWork();
  await flushAsyncWork();

  assert.deepEqual(errors, []);
  assert.equal(elements.get('quickLinksSection').style.display, 'block');
  assert.ok(elements.get('quickLinksGrid').innerHTML.length > 0);
  assert.equal(elements.get('openTabsSection').style.display, 'block');
  assert.ok(elements.get('openTabsMissions').innerHTML.length > 0);
  assert.equal(elements.get('deferredColumn').style.display, 'block');
  assert.ok(elements.get('deferredList').innerHTML.length > 0);
  assert.equal(chrome.storage.local._store.shortcuts.length > 0, true);
  assert.equal(chrome.storage.local._store.shortcuts.some(item => item.title === 'Local Only'), false);
  assert.equal(elements.get('shortcutSyncBanner').hidden, true);

  await vm.runInNewContext(`setShortcuts([
    {
      id: 'local-draft',
      url: 'https://draft.example/',
      title: 'Local Draft',
      domain: 'draft.example',
      logoMode: 'auto',
      logoDataUrl: '',
      logoTransform: { scale: 1, offsetX: 0, offsetY: 0 },
      createdAt: '2026-04-16T01:00:00.000Z'
    }
  ])`, context);
  await flushAsyncWork();
  await vm.runInNewContext('renderQuickLinks()', context);
  await flushAsyncWork();

  assert.equal(chrome.storage.local._store.shortcuts.length, 1);
  assert.equal(chrome.storage.local._store.shortcuts[0].title, 'Local Draft');
  assert.equal(elements.get('shortcutSyncBanner').hidden, false);
  assert.match(elements.get('shortcutSyncText').textContent, /repo snapshot/i);
});
