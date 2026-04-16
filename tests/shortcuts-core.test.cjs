const test = require('node:test');
const assert = require('node:assert/strict');

const {
  DEFAULT_SHORTCUT_LOGO_TRANSFORM,
  areShortcutSyncItemsEqual,
  buildShortcutSyncSource,
  normalizeShortcutLogoTransform,
  normalizeShortcutSyncItems,
  normalizeShortcutUrl,
  inferShortcutDomain,
  inferShortcutTitle,
  moveShortcutItem,
  getShortcutInitial,
  getShortcutSyncSignature,
  mergeShortcutImports,
  buildShortcutRecord,
  resolveShortcutSyncState,
} = require('../extension/shortcuts-core.js');

test('normalizeShortcutUrl adds https when the protocol is missing', () => {
  assert.equal(
    normalizeShortcutUrl('github.com/openai/codex'),
    'https://github.com/openai/codex'
  );
});

test('normalizeShortcutUrl preserves explicit localhost ports', () => {
  assert.equal(
    normalizeShortcutUrl('localhost:3000/dashboard'),
    'https://localhost:3000/dashboard'
  );
});

test('normalizeShortcutUrl rejects invalid or unsupported URLs', () => {
  assert.throws(() => normalizeShortcutUrl('nota url'), /valid URL/i);
  assert.throws(() => normalizeShortcutUrl('ftp://example.com'), /http/i);
});

test('inferShortcutDomain returns hostname without www prefix', () => {
  assert.equal(
    inferShortcutDomain('https://www.notion.so/My-workspace-123'),
    'notion.so'
  );
});

test('inferShortcutTitle uses friendly names for known domains', () => {
  assert.equal(inferShortcutTitle('https://github.com'), 'GitHub');
  assert.equal(inferShortcutTitle('https://www.youtube.com'), 'YouTube');
});

test('inferShortcutTitle creates a readable title for unknown domains', () => {
  assert.equal(
    inferShortcutTitle('https://docs.example-site.dev/reference'),
    'Docs Example Site'
  );
});

test('moveShortcutItem reorders items and keeps others in place', () => {
  const shortcuts = [
    { id: 'a', title: 'A' },
    { id: 'b', title: 'B' },
    { id: 'c', title: 'C' },
    { id: 'd', title: 'D' },
  ];

  const reordered = moveShortcutItem(shortcuts, 'd', 'b');
  assert.deepEqual(reordered.map(item => item.id), ['a', 'd', 'b', 'c']);
});

test('moveShortcutItem inserts before the drop target when dragging forward', () => {
  const shortcuts = [
    { id: 'a', title: 'A' },
    { id: 'b', title: 'B' },
    { id: 'c', title: 'C' },
    { id: 'd', title: 'D' },
  ];

  const reordered = moveShortcutItem(shortcuts, 'b', 'd');
  assert.deepEqual(reordered.map(item => item.id), ['a', 'c', 'b', 'd']);
});

test('getShortcutInitial falls back to a stable single-letter badge', () => {
  assert.equal(getShortcutInitial({ title: 'GitHub', domain: 'github.com' }), 'G');
  assert.equal(getShortcutInitial({ title: '', domain: 'x.com' }), 'X');
});

test('mergeShortcutImports appends only missing shortcut URLs in incoming order', () => {
  const existing = [
    { id: '1', url: 'https://claude.ai/', title: 'Claude' },
    { id: '2', url: 'https://chatgpt.com/', title: 'ChatGPT' },
  ];
  const incoming = [
    { id: 'a', url: 'https://chatgpt.com/', title: 'ChatGPT' },
    { id: 'b', url: 'https://notebooklm.google.com/?hl=en', title: 'NotebookLM' },
    { id: 'c', url: 'https://www.perplexity.ai/', title: 'Perplexity' },
  ];

  const merged = mergeShortcutImports(existing, incoming);
  assert.deepEqual(
    merged.map(item => item.url),
    [
      'https://claude.ai/',
      'https://chatgpt.com/',
      'https://notebooklm.google.com/?hl=en',
      'https://www.perplexity.ai/',
    ]
  );
});

test('normalizeShortcutLogoTransform returns a clamped identity transform by default', () => {
  assert.deepEqual(
    normalizeShortcutLogoTransform(),
    DEFAULT_SHORTCUT_LOGO_TRANSFORM
  );
  assert.deepEqual(
    normalizeShortcutLogoTransform({ scale: '9', offsetX: '-2', offsetY: 3 }),
    { scale: 2.5, offsetX: -1, offsetY: 1 }
  );
});

test('buildShortcutRecord preserves normalized logo transform data', () => {
  const record = buildShortcutRecord({
    url: 'https://claude.ai',
    title: 'Claude',
    logoTransform: {
      scale: '1.35',
      offsetX: '-0.12',
      offsetY: '0.08',
    },
  });

  assert.deepEqual(record.logoTransform, {
    scale: 1.35,
    offsetX: -0.12,
    offsetY: 0.08,
  });
});

test('normalizeShortcutSyncItems strips derived fields and keeps stable sync fields', () => {
  const normalized = normalizeShortcutSyncItems([
    {
      id: 'shortcut-1',
      title: 'Claude',
      url: 'claude.ai',
      domain: 'claude.ai',
      createdAt: '2026-01-01T00:00:00.000Z',
      logoTransform: { scale: 9, offsetX: -2, offsetY: 3 },
    },
  ]);

  assert.deepEqual(normalized, [
    {
      id: 'shortcut-1',
      title: 'Claude',
      url: 'https://claude.ai/',
      logoMode: 'auto',
      logoDataUrl: '',
      logoTransform: { scale: 2.5, offsetX: -1, offsetY: 1 },
    },
  ]);
});

test('normalizeShortcutSyncItems skips invalid entries instead of failing the whole snapshot', () => {
  const normalized = normalizeShortcutSyncItems([
    { id: 'bad', title: 'Bad', url: 'nota url' },
    { id: 'good', title: 'Claude', url: 'https://claude.ai/' },
  ]);

  assert.deepEqual(normalized.map(item => item.id), ['good']);
});

test('areShortcutSyncItemsEqual ignores derived local-only fields', () => {
  assert.equal(
    areShortcutSyncItemsEqual(
      [
        {
          id: 'shortcut-1',
          title: 'Claude',
          url: 'https://claude.ai/',
          domain: 'claude.ai',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      [
        {
          id: 'shortcut-1',
          title: 'Claude',
          url: 'https://claude.ai/',
          logoMode: 'auto',
          logoDataUrl: '',
          logoTransform: DEFAULT_SHORTCUT_LOGO_TRANSFORM,
        },
      ]
    ),
    true
  );
});

test('getShortcutSyncSignature changes when item order changes', () => {
  const first = [
    { id: 'a', title: 'A', url: 'https://a.example/' },
    { id: 'b', title: 'B', url: 'https://b.example/' },
  ];
  const second = [
    { id: 'b', title: 'B', url: 'https://b.example/' },
    { id: 'a', title: 'A', url: 'https://a.example/' },
  ];

  assert.notEqual(
    getShortcutSyncSignature(first),
    getShortcutSyncSignature(second)
  );
});

test('resolveShortcutSyncState reports clean when local matches repo', () => {
  const items = [
    { id: 'shortcut-1', title: 'Claude', url: 'https://claude.ai/' },
  ];

  const resolved = resolveShortcutSyncState({
    repoItems: items,
    localItems: items,
    lastAppliedRepoSignature: '',
  });

  assert.equal(resolved.mode, 'clean');
});

test('resolveShortcutSyncState treats a missing repo snapshot as no-repo', () => {
  const localItems = [
    { id: 'shortcut-1', title: 'Claude', url: 'https://claude.ai/' },
  ];

  const resolved = resolveShortcutSyncState({
    hasRepoSnapshot: false,
    repoItems: [],
    localItems,
    lastAppliedRepoSignature: getShortcutSyncSignature(localItems),
  });

  assert.equal(resolved.mode, 'no-repo');
});

test('resolveShortcutSyncState applies the repo snapshot when local diverges', () => {
  const repoItems = [
    { id: 'shortcut-1', title: 'Claude', url: 'https://claude.ai/' },
  ];
  const localItems = repoItems.concat({
    id: 'shortcut-2',
    title: 'ChatGPT',
    url: 'https://chatgpt.com/',
  });
  const lastAppliedRepoSignature = getShortcutSyncSignature(repoItems);

  const resolved = resolveShortcutSyncState({
    repoItems,
    localItems,
    lastAppliedRepoSignature,
  });

  assert.equal(resolved.mode, 'apply-repo');
});

test('resolveShortcutSyncState applies the repo snapshot even without a previous signature', () => {
  const repoItems = [
    { id: 'shortcut-1', title: 'Claude', url: 'https://claude.ai/' },
    { id: 'shortcut-2', title: 'ChatGPT', url: 'https://chatgpt.com/' },
  ];
  const localItems = [
    { id: 'shortcut-9', title: 'GitHub', url: 'https://github.com/' },
  ];

  const resolved = resolveShortcutSyncState({
    repoItems,
    localItems,
    lastAppliedRepoSignature: '',
  });

  assert.equal(resolved.mode, 'apply-repo');
});

test('resolveShortcutSyncState auto-applies an empty repo snapshot when local matches the last applied repo', () => {
  const previousItems = [
    { id: 'shortcut-1', title: 'Claude', url: 'https://claude.ai/' },
  ];

  const resolved = resolveShortcutSyncState({
    repoItems: [],
    localItems: previousItems,
    lastAppliedRepoSignature: getShortcutSyncSignature(previousItems),
  });

  assert.equal(resolved.mode, 'apply-repo');
});

test('buildShortcutSyncSource renders a repo-ready sync file', () => {
  const source = buildShortcutSyncSource([
    { id: 'shortcut-1', title: 'Claude', url: 'https://claude.ai/' },
  ], 'tab-out-sync');

  assert.match(source, /const SYNC_SHORTCUTS_SOURCE_ID = "tab-out-sync";/);
  assert.match(source, /const SYNC_SHORTCUTS = \[/);
  assert.match(source, /"title": "Claude"/);
});
