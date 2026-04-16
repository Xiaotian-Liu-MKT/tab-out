/* ================================================================
   Tab Out — Dashboard App (Pure Extension Edition)

   This file is the brain of the dashboard. Now that the dashboard
   IS the extension page (not inside an iframe), it can call
   chrome.tabs and chrome.storage directly — no postMessage bridge needed.

   What this file does:
   1. Reads open browser tabs directly via chrome.tabs.query()
   2. Groups tabs by domain with a landing pages category
   3. Renders domain cards, banners, and stats
   4. Handles all user actions (close tabs, save for later, focus tab)
   5. Stores "Saved for Later" tabs in chrome.storage.local (no server)
   ================================================================ */

'use strict';

const ShortcutCore = globalThis.TabOutShortcutsCore || null;


/* ----------------------------------------------------------------
   CHROME TABS — Direct API Access

   Since this page IS the extension's new tab page, it has full
   access to chrome.tabs and chrome.storage. No middleman needed.
   ---------------------------------------------------------------- */

// All open tabs — populated by fetchOpenTabs()
let openTabs = [];

/**
 * fetchOpenTabs()
 *
 * Reads all currently open browser tabs directly from Chrome.
 * Sets the extensionId flag so we can identify Tab Out's own pages.
 */
async function fetchOpenTabs() {
  try {
    const extensionId = chrome.runtime.id;
    // The new URL for this page is now index.html (not newtab.html)
    const newtabUrl = `chrome-extension://${extensionId}/index.html`;

    const tabs = await chrome.tabs.query({});
    openTabs = tabs.map(t => ({
      id:       t.id,
      url:      t.url,
      title:    t.title,
      windowId: t.windowId,
      active:   t.active,
      // Flag Tab Out's own pages so we can detect duplicate new tabs
      isTabOut: t.url === newtabUrl || t.url === 'chrome://newtab/',
    }));
  } catch {
    // chrome.tabs API unavailable (shouldn't happen in an extension page)
    openTabs = [];
  }
}

/**
 * closeTabsByUrls(urls)
 *
 * Closes all open tabs whose hostname matches any of the given URLs.
 * After closing, re-fetches the tab list to keep our state accurate.
 *
 * Special case: file:// URLs are matched exactly (they have no hostname).
 */
async function closeTabsByUrls(urls) {
  if (!urls || urls.length === 0) return;

  // Separate file:// URLs (exact match) from regular URLs (hostname match)
  const targetHostnames = [];
  const exactUrls = new Set();

  for (const u of urls) {
    if (u.startsWith('file://')) {
      exactUrls.add(u);
    } else {
      try { targetHostnames.push(new URL(u).hostname); }
      catch { /* skip unparseable */ }
    }
  }

  const allTabs = await chrome.tabs.query({});
  const toClose = allTabs
    .filter(tab => {
      const tabUrl = tab.url || '';
      if (tabUrl.startsWith('file://') && exactUrls.has(tabUrl)) return true;
      try {
        const tabHostname = new URL(tabUrl).hostname;
        return tabHostname && targetHostnames.includes(tabHostname);
      } catch { return false; }
    })
    .map(tab => tab.id);

  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}

/**
 * closeTabsExact(urls)
 *
 * Closes tabs by exact URL match (not hostname). Used for landing pages
 * so closing "Gmail inbox" doesn't also close individual email threads.
 */
async function closeTabsExact(urls) {
  if (!urls || urls.length === 0) return;
  const urlSet = new Set(urls);
  const allTabs = await chrome.tabs.query({});
  const toClose = allTabs.filter(t => urlSet.has(t.url)).map(t => t.id);
  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}

/**
 * focusTab(url)
 *
 * Switches Chrome to the tab with the given URL (exact match first,
 * then hostname fallback). Also brings the window to the front.
 */
async function focusTab(url) {
  if (!url) return;
  const allTabs = await chrome.tabs.query({});
  const currentWindow = await chrome.windows.getCurrent();

  // Try exact URL match first
  let matches = allTabs.filter(t => t.url === url);

  // Fall back to hostname match
  if (matches.length === 0) {
    try {
      const targetHost = new URL(url).hostname;
      matches = allTabs.filter(t => {
        try { return new URL(t.url).hostname === targetHost; }
        catch { return false; }
      });
    } catch {}
  }

  if (matches.length === 0) return;

  // Prefer a match in a different window so it actually switches windows
  const match = matches.find(t => t.windowId !== currentWindow.id) || matches[0];
  await chrome.tabs.update(match.id, { active: true });
  await chrome.windows.update(match.windowId, { focused: true });
}

/**
 * closeDuplicateTabs(urls, keepOne)
 *
 * Closes duplicate tabs for the given list of URLs.
 * keepOne=true → keep one copy of each, close the rest.
 * keepOne=false → close all copies.
 */
async function closeDuplicateTabs(urls, keepOne = true) {
  const allTabs = await chrome.tabs.query({});
  const toClose = [];

  for (const url of urls) {
    const matching = allTabs.filter(t => t.url === url);
    if (keepOne) {
      const keep = matching.find(t => t.active) || matching[0];
      for (const tab of matching) {
        if (tab.id !== keep.id) toClose.push(tab.id);
      }
    } else {
      for (const tab of matching) toClose.push(tab.id);
    }
  }

  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}

/**
 * closeTabOutDupes()
 *
 * Closes all duplicate Tab Out new-tab pages except the current one.
 */
async function closeTabOutDupes() {
  const extensionId = chrome.runtime.id;
  const newtabUrl = `chrome-extension://${extensionId}/index.html`;

  const allTabs = await chrome.tabs.query({});
  const currentWindow = await chrome.windows.getCurrent();
  const tabOutTabs = allTabs.filter(t =>
    t.url === newtabUrl || t.url === 'chrome://newtab/'
  );

  if (tabOutTabs.length <= 1) return;

  // Keep the active Tab Out tab in the CURRENT window — that's the one the
  // user is looking at right now. Falls back to any active one, then the first.
  const keep =
    tabOutTabs.find(t => t.active && t.windowId === currentWindow.id) ||
    tabOutTabs.find(t => t.active) ||
    tabOutTabs[0];
  const toClose = tabOutTabs.filter(t => t.id !== keep.id).map(t => t.id);
  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}


/* ----------------------------------------------------------------
   SAVED FOR LATER — chrome.storage.local

   Replaces the old server-side SQLite + REST API with Chrome's
   built-in key-value storage. Data persists across browser sessions
   and doesn't require a running server.

   Data shape stored under the "deferred" key:
   [
     {
       id: "1712345678901",          // timestamp-based unique ID
       url: "https://example.com",
       title: "Example Page",
       savedAt: "2026-04-04T10:00:00.000Z",  // ISO date string
       completed: false,             // true = checked off (archived)
       dismissed: false              // true = dismissed without reading
     },
     ...
   ]
   ---------------------------------------------------------------- */

/**
 * saveTabForLater(tab)
 *
 * Saves a single tab to the "Saved for Later" list in chrome.storage.local.
 * @param {{ url: string, title: string }} tab
 */
async function saveTabForLater(tab) {
  const { deferred = [] } = await chrome.storage.local.get('deferred');
  deferred.push({
    id:        Date.now().toString(),
    url:       tab.url,
    title:     tab.title,
    savedAt:   new Date().toISOString(),
    completed: false,
    dismissed: false,
  });
  await chrome.storage.local.set({ deferred });
}

/**
 * getSavedTabs()
 *
 * Returns all saved tabs from chrome.storage.local.
 * Filters out dismissed items (those are gone for good).
 * Splits into active (not completed) and archived (completed).
 */
async function getSavedTabs() {
  const { deferred = [] } = await chrome.storage.local.get('deferred');
  const visible = deferred.filter(t => !t.dismissed);
  return {
    active:   visible.filter(t => !t.completed),
    archived: visible.filter(t => t.completed),
  };
}

/**
 * checkOffSavedTab(id)
 *
 * Marks a saved tab as completed (checked off). It moves to the archive.
 */
async function checkOffSavedTab(id) {
  const { deferred = [] } = await chrome.storage.local.get('deferred');
  const tab = deferred.find(t => t.id === id);
  if (tab) {
    tab.completed = true;
    tab.completedAt = new Date().toISOString();
    await chrome.storage.local.set({ deferred });
  }
}

/**
 * dismissSavedTab(id)
 *
 * Marks a saved tab as dismissed (removed from all lists).
 */
async function dismissSavedTab(id) {
  const { deferred = [] } = await chrome.storage.local.get('deferred');
  const tab = deferred.find(t => t.id === id);
  if (tab) {
    tab.dismissed = true;
    await chrome.storage.local.set({ deferred });
  }
}


/* ----------------------------------------------------------------
   QUICK LINKS — chrome.storage.local + inline editor
   ---------------------------------------------------------------- */

const SHORTCUT_LONG_PRESS_MS = 420;
const SHORTCUT_LONG_PRESS_MOVE_THRESHOLD = 10;
const DEFAULT_SHORTCUTS_SYNC_SOURCE_ID = 'tab-out-sync';

let shortcutEditorState = createEmptyShortcutDraft();
let shortcutEditingId = null;
let shortcutDragId = null;
let shortcutSuppressOpenUntil = 0;
let shortcutEditorReturnFocusEl = null;
let shortcutLogoEditorReturnFocusEl = null;
let shortcutLogoCropState = createDefaultShortcutLogoTransform();
let shortcutLogoCropInitialState = createDefaultShortcutLogoTransform();
let shortcutLogoCropPointer = null;
let shortcutMenuOpenId = null;
let shortcutLongPressState = null;
let shortcutSyncStatus = createEmptyShortcutSyncStatus();
let shortcutHydrationPromise = null;
let shortcutHydrationComplete = false;

function createEmptyShortcutDraft() {
  return {
    url: '',
    title: '',
    logoMode: 'auto',
    logoDataUrl: '',
    logoTransform: createDefaultShortcutLogoTransform(),
  };
}

function createDefaultShortcutLogoTransform() {
  const fallback = { scale: 1, offsetX: 0, offsetY: 0 };
  if (!ShortcutCore || !ShortcutCore.DEFAULT_SHORTCUT_LOGO_TRANSFORM) {
    return { ...fallback };
  }
  return { ...ShortcutCore.DEFAULT_SHORTCUT_LOGO_TRANSFORM };
}

function normalizeShortcutLogoTransform(input) {
  if (!ShortcutCore || !ShortcutCore.normalizeShortcutLogoTransform) {
    return createDefaultShortcutLogoTransform();
  }
  return ShortcutCore.normalizeShortcutLogoTransform(input);
}

function hasShortcutCore() {
  return !!(
    ShortcutCore &&
    ShortcutCore.buildShortcutSyncSource &&
    ShortcutCore.DEFAULT_SHORTCUT_LOGO_TRANSFORM &&
    ShortcutCore.getShortcutSyncSignature &&
    ShortcutCore.buildShortcutRecord &&
    ShortcutCore.getShortcutFaviconUrl &&
    ShortcutCore.getShortcutInitial &&
    ShortcutCore.inferShortcutDomain &&
    ShortcutCore.inferShortcutTitle &&
    ShortcutCore.mergeShortcutImports &&
    ShortcutCore.normalizeShortcutSyncItems &&
    ShortcutCore.normalizeShortcutLogoTransform &&
    ShortcutCore.moveShortcutItem &&
    ShortcutCore.resolveShortcutSyncState
  );
}

function createEmptyShortcutSyncStatus() {
  return {
    mode: 'clean',
    title: '',
    text: '',
    exportLabel: 'Export sync file',
    repoSignature: '',
    localSignature: '',
    sourceId: DEFAULT_SHORTCUTS_SYNC_SOURCE_ID,
  };
}

function createDirtyShortcutSyncStatus(sourceId, hasRepoSnapshot = true) {
  return {
    mode: 'dirty',
    title: 'Start Here changes live only on this computer',
    text: hasRepoSnapshot
      ? 'Export a new shortcuts.sync.js before you close this tab. Otherwise the repo snapshot will replace these local edits the next time you open Tab Out.'
      : 'Export a new shortcuts.sync.js to create the repo snapshot that other computers will follow.',
    exportLabel: 'Export sync file',
    repoSignature: '',
    localSignature: '',
    sourceId,
  };
}

function getRepoShortcutSyncPayload() {
  const hasSnapshot = typeof SYNC_SHORTCUTS !== 'undefined' && Array.isArray(SYNC_SHORTCUTS);
  const sourceId = typeof SYNC_SHORTCUTS_SOURCE_ID === 'string' && SYNC_SHORTCUTS_SOURCE_ID.trim()
    ? SYNC_SHORTCUTS_SOURCE_ID.trim()
    : DEFAULT_SHORTCUTS_SYNC_SOURCE_ID;
  const rawShortcuts = hasSnapshot ? SYNC_SHORTCUTS : [];
  const shortcuts = ShortcutCore.normalizeShortcutSyncItems(rawShortcuts);

  return {
    hasSnapshot,
    sourceId,
    shortcuts,
    signature: ShortcutCore.getShortcutSyncSignature(shortcuts),
  };
}

function buildStoredShortcutsFromSync(syncItems) {
  const shortcuts = ShortcutCore.normalizeShortcutSyncItems(syncItems);
  const baseTime = Date.now();

  return shortcuts.map((item, index) => ShortcutCore.buildShortcutRecord(item, {
    id: item.id || `sync-shortcut-${index + 1}`,
    createdAt: new Date(baseTime + index).toISOString(),
  }));
}

async function getShortcutSyncState() {
  const { shortcutSyncState = {} } = await chrome.storage.local.get('shortcutSyncState');
  return {
    lastAppliedRepoSignature: String(shortcutSyncState.lastAppliedRepoSignature || '').trim(),
  };
}

async function setShortcutSyncState(nextState) {
  await chrome.storage.local.set({
    shortcutSyncState: {
      lastAppliedRepoSignature: String((nextState && nextState.lastAppliedRepoSignature) || '').trim(),
    },
  });
}

async function applyRepoShortcutSnapshot(repoPayload) {
  const shortcuts = buildStoredShortcutsFromSync(repoPayload.shortcuts);
  await chrome.storage.local.set({
    shortcuts,
    shortcutSyncState: {
      lastAppliedRepoSignature: repoPayload.signature,
    },
  });
  shortcutSyncStatus = createEmptyShortcutSyncStatus();
  return shortcuts;
}

function markShortcutSessionDirty() {
  if (!hasShortcutCore()) {
    shortcutSyncStatus = createDirtyShortcutSyncStatus(DEFAULT_SHORTCUTS_SYNC_SOURCE_ID, false);
    return;
  }

  const repoPayload = getRepoShortcutSyncPayload();
  shortcutSyncStatus = createDirtyShortcutSyncStatus(repoPayload.sourceId, repoPayload.hasSnapshot);
}

async function hydrateShortcutsFromRepo() {
  if (shortcutHydrationComplete) return getShortcuts();
  if (shortcutHydrationPromise) return shortcutHydrationPromise;

  shortcutHydrationPromise = (async () => {
    shortcutSyncStatus = createEmptyShortcutSyncStatus();
    if (!hasShortcutCore()) return [];

    const repoPayload = getRepoShortcutSyncPayload();
    const localShortcuts = await getShortcuts();
    if (!repoPayload.hasSnapshot) return localShortcuts;

    const syncState = await getShortcutSyncState();
    const resolved = ShortcutCore.resolveShortcutSyncState({
      hasRepoSnapshot: repoPayload.hasSnapshot,
      repoItems: repoPayload.shortcuts,
      localItems: localShortcuts,
      lastAppliedRepoSignature: syncState.lastAppliedRepoSignature,
    });

    if (resolved.mode === 'apply-repo') {
      return applyRepoShortcutSnapshot(repoPayload);
    }

    if (resolved.mode === 'clean' && syncState.lastAppliedRepoSignature !== resolved.repoSignature) {
      await setShortcutSyncState({
        lastAppliedRepoSignature: resolved.repoSignature,
      });
    }

    return localShortcuts;
  })();

  try {
    return await shortcutHydrationPromise;
  } finally {
    shortcutHydrationComplete = true;
    shortcutHydrationPromise = null;
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isShortcutEditorOpen() {
  const shell = document.getElementById('shortcutModalShell');
  return !!shell && shell.classList.contains('is-open');
}

function setShortcutEditorOpen(isOpen) {
  const shell = document.getElementById('shortcutModalShell');
  if (!shell) return;

  shell.hidden = !isOpen;
  shell.classList.toggle('is-open', isOpen);
  shell.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  document.body.classList.toggle('shortcut-modal-open', isOpen);
}

function isShortcutLogoEditorOpen() {
  const shell = document.getElementById('shortcutLogoEditorShell');
  return !!shell && shell.classList.contains('is-open');
}

function setShortcutLogoEditorOpen(isOpen) {
  const shell = document.getElementById('shortcutLogoEditorShell');
  if (!shell) return;

  shell.hidden = !isOpen;
  shell.classList.toggle('is-open', isOpen);
  shell.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
}

function normalizeStoredShortcut(item) {
  if (!item || !item.id || !item.url) return null;

  let normalizedUrl = item.url;
  let domain = item.domain || '';

  try {
    normalizedUrl = ShortcutCore.normalizeShortcutUrl(item.url);
    domain = domain || ShortcutCore.inferShortcutDomain(normalizedUrl);
  } catch {
    return null;
  }

  return {
    id: item.id,
    url: normalizedUrl,
    title: String(item.title || '').trim() || ShortcutCore.inferShortcutTitle(normalizedUrl),
    domain,
    logoMode: item.logoMode === 'upload' && item.logoDataUrl ? 'upload' : 'auto',
    logoDataUrl: item.logoMode === 'upload' ? String(item.logoDataUrl || '') : '',
    logoTransform: normalizeShortcutLogoTransform(item.logoTransform),
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

async function getShortcuts() {
  const { shortcuts = [] } = await chrome.storage.local.get('shortcuts');
  if (!Array.isArray(shortcuts)) return [];
  return shortcuts.map(normalizeStoredShortcut).filter(Boolean);
}

async function setShortcuts(shortcuts) {
  await chrome.storage.local.set({ shortcuts });
  markShortcutSessionDirty();
}

async function getShortcutPrefs() {
  const { shortcutPrefs = {} } = await chrome.storage.local.get('shortcutPrefs');
  return {
    rows: shortcutPrefs.rows === 2 ? 2 : 1,
  };
}

async function setShortcutRows(rows) {
  await chrome.storage.local.set({
    shortcutPrefs: {
      rows: rows === 2 ? 2 : 1,
    },
  });
}

function buildShortcutPreview() {
  const rawUrl = String(shortcutEditorState.url || '').trim();
  let url = '';
  let domain = '';

  try {
    url = ShortcutCore.normalizeShortcutUrl(rawUrl);
    domain = ShortcutCore.inferShortcutDomain(url);
  } catch {
    url = '';
    domain = '';
  }

  const title = String(shortcutEditorState.title || '').trim()
    || (url ? ShortcutCore.inferShortcutTitle(url) : 'Shortcut');

  return {
    url,
    title,
    domain,
    logoMode: shortcutEditorState.logoMode,
    logoDataUrl: shortcutEditorState.logoDataUrl,
    logoTransform: normalizeShortcutLogoTransform(shortcutEditorState.logoTransform),
  };
}

function formatShortcutTransformValue(value) {
  return Number(value).toFixed(4).replace(/\.?0+$/, '');
}

function buildShortcutLogoMediaStyle(shortcut) {
  const transform = normalizeShortcutLogoTransform(shortcut && shortcut.logoTransform);
  return [
    `left:calc(50% + ${formatShortcutTransformValue(transform.offsetX * 100)}%)`,
    `top:calc(50% + ${formatShortcutTransformValue(transform.offsetY * 100)}%)`,
    `transform:translate(-50%, -50%) scale(${formatShortcutTransformValue(transform.scale)})`,
  ].join(';');
}

function renderShortcutLogo(shortcut, className = 'shortcut-logo') {
  const initial = escapeHtml(ShortcutCore.getShortcutInitial(shortcut));
  const usesUpload = shortcut.logoMode === 'upload' && shortcut.logoDataUrl;
  const src = usesUpload
    ? shortcut.logoDataUrl
    : shortcut.url
      ? ShortcutCore.getShortcutFaviconUrl(shortcut.url)
      : '';
  const fallbackClass = src ? '' : ' show-fallback';
  const mediaStyle = src ? escapeHtml(buildShortcutLogoMediaStyle(shortcut)) : '';

  return `
    <div class="${className}${fallbackClass}">
      <div class="shortcut-logo-stage">
        ${src ? `<img class="shortcut-logo-media" src="${escapeHtml(src)}" alt="" draggable="false" style="${mediaStyle}" onerror="this.style.display='none';this.closest('.${className}').classList.add('show-fallback')">` : ''}
        <span class="shortcut-logo-fallback">${initial}</span>
      </div>
    </div>
  `;
}

function renderShortcutCard(shortcut) {
  const safeId = escapeHtml(shortcut.id);
  const safeTitle = escapeHtml(shortcut.title);
  const safeUrl = escapeHtml(shortcut.url);
  const logo = renderShortcutLogo(shortcut);
  const isMenuOpen = shortcutMenuOpenId === shortcut.id;
  const menuHiddenAttr = isMenuOpen ? '' : ' hidden';
  const menuExpanded = isMenuOpen ? 'true' : 'false';

  return `
    <article class="shortcut-card" draggable="true" data-shortcut-id="${safeId}">
      <div class="shortcut-card-menu-shell">
        <button type="button" class="shortcut-card-menu-toggle" data-action="toggle-shortcut-menu" data-shortcut-id="${safeId}" aria-label="Open shortcut menu" aria-expanded="${menuExpanded}" aria-haspopup="menu">
          ${ICONS.more}
        </button>
        <div class="shortcut-card-menu" role="menu"${menuHiddenAttr}>
          <button type="button" class="shortcut-card-menu-item" role="menuitem" data-action="edit-shortcut" data-shortcut-id="${safeId}">
            ${ICONS.edit}
            <span>Edit shortcut</span>
          </button>
          <button type="button" class="shortcut-card-menu-item danger" role="menuitem" data-action="delete-shortcut" data-shortcut-id="${safeId}">
            ${ICONS.trash}
            <span>Delete shortcut</span>
          </button>
        </div>
      </div>
      <button type="button" class="shortcut-card-main" data-action="open-shortcut" data-shortcut-id="${safeId}" title="${safeUrl}" aria-label="Open ${safeTitle}">
        ${logo}
        <span class="shortcut-card-title">${safeTitle}</span>
      </button>
    </article>
  `;
}

function cacheShortcutDraftFromForm() {
  const urlInput = document.getElementById('shortcutUrlInput');
  const titleInput = document.getElementById('shortcutTitleInput');

  if (urlInput) shortcutEditorState.url = urlInput.value;
  if (titleInput) shortcutEditorState.title = titleInput.value;
}

function setShortcutEditorError(message) {
  const errorEl = document.getElementById('shortcutEditorError');
  if (!errorEl) return;

  const text = String(message || '').trim();
  errorEl.textContent = text;
  errorEl.style.display = text ? 'block' : 'none';
}

function setShortcutLogoEditorError(message) {
  const errorEl = document.getElementById('shortcutLogoEditorError');
  if (!errorEl) return;

  const text = String(message || '').trim();
  errorEl.textContent = text;
  errorEl.style.display = text ? 'block' : 'none';
}

function renderShortcutEditorState() {
  const editor = document.getElementById('shortcutEditor');
  if (!editor) return;

  const titleEl = document.getElementById('shortcutEditorTitle');
  const hintEl = document.getElementById('shortcutEditorHint');
  const urlInput = document.getElementById('shortcutUrlInput');
  const titleInput = document.getElementById('shortcutTitleInput');
  const deleteBtn = document.getElementById('shortcutDeleteBtn');
  const logoPreview = document.getElementById('shortcutLogoPreview');
  const logoLabel = document.getElementById('shortcutLogoLabel');
  const logoSubcopy = document.getElementById('shortcutLogoSubcopy');
  const resetLogoBtn = document.getElementById('shortcutResetLogoBtn');
  const editLogoBtn = editor.querySelector('[data-action="show-shortcut-logo-editor"]');

  if (titleEl) titleEl.textContent = shortcutEditingId ? 'Edit shortcut' : 'Add shortcut';
  if (hintEl) {
    hintEl.textContent = shortcutEditingId
      ? 'Tweak the URL, rename it, or swap the logo without leaving the tab.'
      : 'Drop in a URL, rename it if you want, and optionally upload a custom logo.';
  }
  if (urlInput && urlInput.value !== shortcutEditorState.url) urlInput.value = shortcutEditorState.url;
  if (titleInput && titleInput.value !== shortcutEditorState.title) titleInput.value = shortcutEditorState.title;
  if (deleteBtn) deleteBtn.style.display = shortcutEditingId ? 'inline-flex' : 'none';

  const preview = buildShortcutPreview();
  if (logoPreview) logoPreview.innerHTML = renderShortcutLogo(preview, 'shortcut-logo-preview-badge');
  if (logoLabel) logoLabel.textContent = preview.logoMode === 'upload' && preview.logoDataUrl ? 'Custom logo' : 'Auto logo';
  if (logoSubcopy) {
    logoSubcopy.textContent = preview.logoMode === 'upload' && preview.logoDataUrl
      ? 'Using your uploaded image. Switch back to auto anytime.'
      : 'We try the site favicon first, then fall back to a letter badge.';
  }
  if (resetLogoBtn) resetLogoBtn.disabled = !(preview.logoMode === 'upload' && preview.logoDataUrl);
  if (editLogoBtn) editLogoBtn.disabled = !preview.url && !(preview.logoMode === 'upload' && preview.logoDataUrl);
}

function renderShortcutLogoEditorState() {
  const frame = document.getElementById('shortcutLogoCropFrame');
  const scaleInput = document.getElementById('shortcutLogoScaleInput');
  const stage = document.getElementById('shortcutLogoCropStage');
  if (!frame || !scaleInput || !stage) return;

  const preview = {
    ...buildShortcutPreview(),
    logoTransform: normalizeShortcutLogoTransform(shortcutLogoCropState),
  };

  frame.innerHTML = renderShortcutLogo(preview, 'shortcut-logo-crop-badge');
  stage.classList.toggle('is-draggable', Boolean(preview.url || (preview.logoMode === 'upload' && preview.logoDataUrl)));
  scaleInput.value = String(Math.round(preview.logoTransform.scale * 100));
}

function renderShortcutSyncBanner() {
  const banner = document.getElementById('shortcutSyncBanner');
  const titleEl = document.getElementById('shortcutSyncTitle');
  const textEl = document.getElementById('shortcutSyncText');
  const exportBtn = document.getElementById('shortcutSyncExportBtn');
  if (!banner || !titleEl || !textEl || !exportBtn) return;

  const visible = shortcutSyncStatus.mode === 'dirty';
  banner.hidden = !visible;
  banner.classList.toggle('is-dirty', shortcutSyncStatus.mode === 'dirty');
  banner.classList.remove('is-conflict');

  if (!visible) return;

  titleEl.textContent = shortcutSyncStatus.title;
  textEl.textContent = shortcutSyncStatus.text;
  exportBtn.textContent = shortcutSyncStatus.exportLabel;
}

function hideShortcutEditor() {
  const fileInput = document.getElementById('shortcutLogoInput');

  if (isShortcutLogoEditorOpen()) hideShortcutLogoEditor();
  shortcutMenuOpenId = null;
  shortcutEditingId = null;
  shortcutEditorState = createEmptyShortcutDraft();
  setShortcutEditorOpen(false);
  if (fileInput) fileInput.value = '';
  setShortcutEditorError('');

  if (
    shortcutEditorReturnFocusEl &&
    typeof shortcutEditorReturnFocusEl.focus === 'function' &&
    document.contains(shortcutEditorReturnFocusEl)
  ) {
    shortcutEditorReturnFocusEl.focus({ preventScroll: true });
  }
  shortcutEditorReturnFocusEl = null;
}

function hideShortcutLogoEditor() {
  const stage = document.getElementById('shortcutLogoCropStage');
  shortcutLogoCropPointer = null;
  shortcutLogoCropState = createDefaultShortcutLogoTransform();
  shortcutLogoCropInitialState = createDefaultShortcutLogoTransform();
  setShortcutLogoEditorOpen(false);
  setShortcutLogoEditorError('');
  if (stage) stage.classList.remove('is-dragging');

  if (
    shortcutLogoEditorReturnFocusEl &&
    typeof shortcutLogoEditorReturnFocusEl.focus === 'function' &&
    document.contains(shortcutLogoEditorReturnFocusEl)
  ) {
    shortcutLogoEditorReturnFocusEl.focus({ preventScroll: true });
  }
  shortcutLogoEditorReturnFocusEl = null;
}

function openShortcutEditor(shortcut, triggerEl) {
  shortcutEditingId = shortcut ? shortcut.id : null;
  shortcutEditorReturnFocusEl = triggerEl || document.activeElement;
  shortcutEditorState = {
    url: shortcut ? shortcut.url : '',
    title: shortcut ? shortcut.title : '',
    logoMode: shortcut && shortcut.logoMode === 'upload' && shortcut.logoDataUrl ? 'upload' : 'auto',
    logoDataUrl: shortcut && shortcut.logoMode === 'upload' ? shortcut.logoDataUrl : '',
    logoTransform: normalizeShortcutLogoTransform(shortcut && shortcut.logoTransform),
  };
  setShortcutEditorError('');
  setShortcutEditorOpen(true);
  renderShortcutEditorState();

  const urlInput = document.getElementById('shortcutUrlInput');
  if (urlInput) {
    urlInput.focus();
    urlInput.select();
  }
}

function openShortcutLogoEditor(triggerEl) {
  shortcutLogoEditorReturnFocusEl = triggerEl || document.activeElement;
  shortcutLogoCropState = normalizeShortcutLogoTransform(shortcutEditorState.logoTransform);
  shortcutLogoCropInitialState = normalizeShortcutLogoTransform(shortcutEditorState.logoTransform);
  setShortcutLogoEditorError('');
  setShortcutLogoEditorOpen(true);
  renderShortcutLogoEditorState();
}

async function renderQuickLinks() {
  const section = document.getElementById('quickLinksSection');
  if (!section) return;
  if (!hasShortcutCore()) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  const emptyEl = document.getElementById('quickLinksEmpty');
  const scroller = document.getElementById('quickLinksScroller');
  const grid = document.getElementById('quickLinksGrid');
  const shortcuts = await getShortcuts();
  const renderedShortcuts = shortcuts.slice();
  section.classList.toggle('has-shortcuts', shortcuts.length > 0);

  if (shortcutMenuOpenId && !shortcuts.some(item => item.id === shortcutMenuOpenId)) {
    shortcutMenuOpenId = null;
  }

  if (shortcutEditingId) {
    const preview = buildShortcutPreview();
    const previewIndex = renderedShortcuts.findIndex(item => item.id === shortcutEditingId);
    if (previewIndex !== -1 && preview.url) {
      renderedShortcuts[previewIndex] = {
        ...renderedShortcuts[previewIndex],
        ...preview,
      };
    }
  }

  if (grid) {
    grid.innerHTML = renderedShortcuts.map(renderShortcutCard).join('');
  }

  renderShortcutSyncBanner();

  if (emptyEl) emptyEl.style.display = shortcuts.length === 0 ? 'block' : 'none';
  if (scroller) scroller.style.display = shortcuts.length === 0 ? 'none' : 'block';

  if (shortcutEditingId && !shortcuts.some(item => item.id === shortcutEditingId)) {
    hideShortcutEditor();
  } else if (isShortcutEditorOpen()) {
    renderShortcutEditorState();
    if (isShortcutLogoEditorOpen()) renderShortcutLogoEditorState();
  }
}

function getShortcutById(shortcuts, id) {
  return shortcuts.find(item => item.id === id) || null;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read that image.'));
    reader.readAsDataURL(file);
  });
}

async function handleShortcutSave() {
  if (!hasShortcutCore()) return;

  cacheShortcutDraftFromForm();

  try {
    const shortcuts = await getShortcuts();
    const existing = shortcutEditingId ? getShortcutById(shortcuts, shortcutEditingId) : null;
    const record = ShortcutCore.buildShortcutRecord({
      url: shortcutEditorState.url,
      title: shortcutEditorState.title,
      logoMode: shortcutEditorState.logoMode === 'upload' && shortcutEditorState.logoDataUrl ? 'upload' : 'auto',
      logoDataUrl: shortcutEditorState.logoMode === 'upload' ? shortcutEditorState.logoDataUrl : '',
      logoTransform: normalizeShortcutLogoTransform(shortcutEditorState.logoTransform),
    }, {
      id: existing ? existing.id : undefined,
      createdAt: existing ? existing.createdAt : undefined,
    });

    const nextShortcuts = existing
      ? shortcuts.map(item => item.id === existing.id ? record : item)
      : shortcuts.concat(record);

    await setShortcuts(nextShortcuts);
    hideShortcutEditor();
    await renderQuickLinks();
    showToast(existing ? 'Shortcut updated' : 'Shortcut added');
  } catch (err) {
    setShortcutEditorError(err && err.message ? err.message : 'Could not save shortcut.');
  }
}

async function handleShortcutDelete(id) {
  const shortcuts = await getShortcuts();
  const target = getShortcutById(shortcuts, id || shortcutEditingId);
  if (!target) return;

  if (!window.confirm(`Delete "${target.title}" from Start Here?`)) {
    return;
  }

  await setShortcuts(shortcuts.filter(item => item.id !== target.id));
  if (shortcutEditingId === target.id) hideShortcutEditor();
  await renderQuickLinks();
  showToast('Shortcut removed');
}

function applyShortcutLogoCropState(nextState) {
  shortcutLogoCropState = normalizeShortcutLogoTransform(nextState);
  renderShortcutLogoEditorState();
}

function fitShortcutLogoCropState() {
  applyShortcutLogoCropState(createDefaultShortcutLogoTransform());
}

function resetShortcutLogoCropState() {
  applyShortcutLogoCropState(shortcutLogoCropInitialState);
}

async function saveShortcutLogoCropState() {
  shortcutEditorState.logoTransform = normalizeShortcutLogoTransform(shortcutLogoCropState);
  hideShortcutLogoEditor();
  renderShortcutEditorState();
  await renderQuickLinks();
}

async function toggleShortcutMenu(id) {
  shortcutMenuOpenId = shortcutMenuOpenId === id ? null : id;
  await renderQuickLinks();
}

async function closeShortcutMenu() {
  if (!shortcutMenuOpenId) return;
  shortcutMenuOpenId = null;
  await renderQuickLinks();
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], {
    type: mimeType || 'text/plain;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function exportShortcutSyncFile() {
  if (!hasShortcutCore()) return;

  const repoPayload = getRepoShortcutSyncPayload();
  const shortcuts = await getShortcuts();
  const source = ShortcutCore.buildShortcutSyncSource(shortcuts, repoPayload.sourceId);
  downloadTextFile('shortcuts.sync.js', source, 'text/javascript;charset=utf-8');
  showToast('Downloaded shortcuts.sync.js. Replace the repo file, commit/push, then reopen Tab Out.');
}

function shouldUseShortcutLongPress(event) {
  if (!event) return false;
  if (event.pointerType && event.pointerType !== 'mouse') return true;
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(any-pointer: coarse)').matches;
}

function clearShortcutLongPressState(pointerId = null) {
  if (!shortcutLongPressState) return null;
  if (typeof pointerId === 'number' && shortcutLongPressState.pointerId !== pointerId) {
    return null;
  }

  const state = shortcutLongPressState;
  if (state.timeoutId) window.clearTimeout(state.timeoutId);
  shortcutLongPressState = null;
  return state;
}

function beginShortcutLongPress(card, event) {
  const shortcutId = card.dataset.shortcutId || null;
  if (!shortcutId) return;

  clearShortcutLongPressState();
  shortcutLongPressState = {
    pointerId: event.pointerId,
    shortcutId,
    startX: event.clientX,
    startY: event.clientY,
    triggered: false,
    timeoutId: window.setTimeout(async () => {
      if (!shortcutLongPressState || shortcutLongPressState.pointerId !== event.pointerId) return;
      shortcutLongPressState.triggered = true;
      shortcutLongPressState.timeoutId = null;
      shortcutMenuOpenId = shortcutId;
      shortcutSuppressOpenUntil = Date.now() + 750;
      await renderQuickLinks();
    }, SHORTCUT_LONG_PRESS_MS),
  };
}

function updateShortcutLongPress(event) {
  if (!shortcutLongPressState || shortcutLongPressState.pointerId !== event.pointerId) return;
  if (shortcutLongPressState.triggered) return;

  const deltaX = event.clientX - shortcutLongPressState.startX;
  const deltaY = event.clientY - shortcutLongPressState.startY;
  if (Math.hypot(deltaX, deltaY) > SHORTCUT_LONG_PRESS_MOVE_THRESHOLD) {
    clearShortcutLongPressState(event.pointerId);
  }
}

function clearShortcutDragClasses() {
  document.querySelectorAll('.shortcut-card.dragging, .shortcut-card.drop-target').forEach(card => {
    card.classList.remove('dragging', 'drop-target');
  });
}


/* ----------------------------------------------------------------
   UI HELPERS
   ---------------------------------------------------------------- */

/**
 * playCloseSound()
 *
 * Plays a clean "swoosh" sound when tabs are closed.
 * Built entirely with the Web Audio API — no sound files needed.
 * A filtered noise sweep that descends in pitch, like air moving.
 */
function playCloseSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime;

    // Swoosh: shaped white noise through a sweeping bandpass filter
    const duration = 0.25;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate noise with a natural envelope (quick attack, smooth decay)
    for (let i = 0; i < data.length; i++) {
      const pos = i / data.length;
      // Envelope: ramps up fast in first 10%, then fades out smoothly
      const env = pos < 0.1 ? pos / 0.1 : Math.pow(1 - (pos - 0.1) / 0.9, 1.5);
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Bandpass filter sweeps from high to low — creates the "swoosh" character
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.0;
    filter.frequency.setValueAtTime(4000, t);
    filter.frequency.exponentialRampToValueAtTime(400, t + duration);

    // Volume
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(t);

    setTimeout(() => ctx.close(), 500);
  } catch {
    // Audio not supported — fail silently
  }
}

/**
 * shootConfetti(x, y)
 *
 * Shoots a burst of colorful confetti particles from the given screen
 * coordinates (typically the center of a card being closed).
 * Pure CSS + JS, no libraries.
 */
function shootConfetti(x, y) {
  const colors = [
    '#c8713a', // amber
    '#e8a070', // amber light
    '#5a7a62', // sage
    '#8aaa92', // sage light
    '#5a6b7a', // slate
    '#8a9baa', // slate light
    '#d4b896', // warm paper
    '#b35a5a', // rose
  ];

  const particleCount = 17;

  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement('div');

    const isCircle = Math.random() > 0.5;
    const size = 5 + Math.random() * 6; // 5–11px
    const color = colors[Math.floor(Math.random() * colors.length)];

    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${isCircle ? '50%' : '2px'};
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      opacity: 1;
    `;
    document.body.appendChild(el);

    // Physics: random angle and speed for the outward burst
    const angle   = Math.random() * Math.PI * 2;
    const speed   = 60 + Math.random() * 120;
    const vx      = Math.cos(angle) * speed;
    const vy      = Math.sin(angle) * speed - 80; // bias upward
    const gravity = 200;

    const startTime = performance.now();
    const duration  = 700 + Math.random() * 200; // 700–900ms

    function frame(now) {
      const elapsed  = (now - startTime) / 1000;
      const progress = elapsed / (duration / 1000);

      if (progress >= 1) { el.remove(); return; }

      const px = vx * elapsed;
      const py = vy * elapsed + 0.5 * gravity * elapsed * elapsed;
      const opacity = progress < 0.5 ? 1 : 1 - (progress - 0.5) * 2;
      const rotate  = elapsed * 200 * (isCircle ? 0 : 1);

      el.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) rotate(${rotate}deg)`;
      el.style.opacity = opacity;

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }
}

/**
 * animateCardOut(card)
 *
 * Smoothly removes a mission card: fade + scale down, then confetti.
 * After the animation, checks if the grid is now empty.
 */
function animateCardOut(card) {
  if (!card) return;

  const rect = card.getBoundingClientRect();
  shootConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

  card.classList.add('closing');
  setTimeout(() => {
    card.remove();
    checkAndShowEmptyState();
  }, 300);
}

/**
 * showToast(message)
 *
 * Brief pop-up notification at the bottom of the screen.
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toastText').textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2500);
}

/**
 * checkAndShowEmptyState()
 *
 * Shows a cheerful "Inbox zero" message when all domain cards are gone.
 */
function checkAndShowEmptyState() {
  const missionsEl = document.getElementById('openTabsMissions');
  if (!missionsEl) return;

  const remaining = missionsEl.querySelectorAll('.mission-card:not(.closing)').length;
  if (remaining > 0) return;

  missionsEl.innerHTML = `
    <div class="missions-empty-state">
      <div class="empty-checkmark">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <div class="empty-title">Inbox zero, but for tabs.</div>
      <div class="empty-subtitle">You're free.</div>
    </div>
  `;

  const countEl = document.getElementById('openTabsSectionCount');
  if (countEl) countEl.textContent = '0 domains';
}

/**
 * timeAgo(dateStr)
 *
 * Converts an ISO date string into a human-friendly relative time.
 * "2026-04-04T10:00:00Z" → "2 hrs ago" or "yesterday"
 */
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const then = new Date(dateStr);
  const now  = new Date();
  const diffMins  = Math.floor((now - then) / 60000);
  const diffHours = Math.floor((now - then) / 3600000);
  const diffDays  = Math.floor((now - then) / 86400000);

  if (diffMins < 1)   return 'just now';
  if (diffMins < 60)  return diffMins + ' min ago';
  if (diffHours < 24) return diffHours + ' hr' + (diffHours !== 1 ? 's' : '') + ' ago';
  if (diffDays === 1) return 'yesterday';
  return diffDays + ' days ago';
}

/**
 * getGreeting() — "Good morning / afternoon / evening"
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * getDateDisplay() — "Friday, April 4, 2026"
 */
function getDateDisplay() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}


/* ----------------------------------------------------------------
   DOMAIN & TITLE CLEANUP HELPERS
   ---------------------------------------------------------------- */

// Map of known hostnames → friendly display names.
const FRIENDLY_DOMAINS = {
  'github.com':           'GitHub',
  'www.github.com':       'GitHub',
  'gist.github.com':      'GitHub Gist',
  'youtube.com':          'YouTube',
  'www.youtube.com':      'YouTube',
  'music.youtube.com':    'YouTube Music',
  'x.com':                'X',
  'www.x.com':            'X',
  'twitter.com':          'X',
  'www.twitter.com':      'X',
  'reddit.com':           'Reddit',
  'www.reddit.com':       'Reddit',
  'old.reddit.com':       'Reddit',
  'substack.com':         'Substack',
  'www.substack.com':     'Substack',
  'medium.com':           'Medium',
  'www.medium.com':       'Medium',
  'linkedin.com':         'LinkedIn',
  'www.linkedin.com':     'LinkedIn',
  'stackoverflow.com':    'Stack Overflow',
  'www.stackoverflow.com':'Stack Overflow',
  'news.ycombinator.com': 'Hacker News',
  'google.com':           'Google',
  'www.google.com':       'Google',
  'mail.google.com':      'Gmail',
  'docs.google.com':      'Google Docs',
  'drive.google.com':     'Google Drive',
  'calendar.google.com':  'Google Calendar',
  'meet.google.com':      'Google Meet',
  'gemini.google.com':    'Gemini',
  'chatgpt.com':          'ChatGPT',
  'www.chatgpt.com':      'ChatGPT',
  'chat.openai.com':      'ChatGPT',
  'claude.ai':            'Claude',
  'www.claude.ai':        'Claude',
  'code.claude.com':      'Claude Code',
  'notion.so':            'Notion',
  'www.notion.so':        'Notion',
  'figma.com':            'Figma',
  'www.figma.com':        'Figma',
  'slack.com':            'Slack',
  'app.slack.com':        'Slack',
  'discord.com':          'Discord',
  'www.discord.com':      'Discord',
  'wikipedia.org':        'Wikipedia',
  'en.wikipedia.org':     'Wikipedia',
  'amazon.com':           'Amazon',
  'www.amazon.com':       'Amazon',
  'netflix.com':          'Netflix',
  'www.netflix.com':      'Netflix',
  'spotify.com':          'Spotify',
  'open.spotify.com':     'Spotify',
  'vercel.com':           'Vercel',
  'www.vercel.com':       'Vercel',
  'npmjs.com':            'npm',
  'www.npmjs.com':        'npm',
  'developer.mozilla.org':'MDN',
  'arxiv.org':            'arXiv',
  'www.arxiv.org':        'arXiv',
  'huggingface.co':       'Hugging Face',
  'www.huggingface.co':   'Hugging Face',
  'producthunt.com':      'Product Hunt',
  'www.producthunt.com':  'Product Hunt',
  'xiaohongshu.com':      'RedNote',
  'www.xiaohongshu.com':  'RedNote',
  'local-files':          'Local Files',
};

function friendlyDomain(hostname) {
  if (!hostname) return '';
  if (FRIENDLY_DOMAINS[hostname]) return FRIENDLY_DOMAINS[hostname];

  if (hostname.endsWith('.substack.com') && hostname !== 'substack.com') {
    return capitalize(hostname.replace('.substack.com', '')) + "'s Substack";
  }
  if (hostname.endsWith('.github.io')) {
    return capitalize(hostname.replace('.github.io', '')) + ' (GitHub Pages)';
  }

  let clean = hostname
    .replace(/^www\./, '')
    .replace(/\.(com|org|net|io|co|ai|dev|app|so|me|xyz|info|us|uk|co\.uk|co\.jp)$/, '');

  return clean.split('.').map(part => capitalize(part)).join(' ');
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function stripTitleNoise(title) {
  if (!title) return '';
  // Strip leading notification count: "(2) Title"
  title = title.replace(/^\(\d+\+?\)\s*/, '');
  // Strip inline counts like "Inbox (16,359)"
  title = title.replace(/\s*\([\d,]+\+?\)\s*/g, ' ');
  // Strip email addresses (privacy + cleaner display)
  title = title.replace(/\s*[\-\u2010-\u2015]\s*[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, '');
  title = title.replace(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, '');
  // Clean X/Twitter format
  title = title.replace(/\s+on X:\s*/, ': ');
  title = title.replace(/\s*\/\s*X\s*$/, '');
  return title.trim();
}

function cleanTitle(title, hostname) {
  if (!title || !hostname) return title || '';

  const friendly = friendlyDomain(hostname);
  const domain   = hostname.replace(/^www\./, '');
  const seps     = [' - ', ' | ', ' — ', ' · ', ' – '];

  for (const sep of seps) {
    const idx = title.lastIndexOf(sep);
    if (idx === -1) continue;
    const suffix     = title.slice(idx + sep.length).trim();
    const suffixLow  = suffix.toLowerCase();
    if (
      suffixLow === domain.toLowerCase() ||
      suffixLow === friendly.toLowerCase() ||
      suffixLow === domain.replace(/\.\w+$/, '').toLowerCase() ||
      domain.toLowerCase().includes(suffixLow) ||
      friendly.toLowerCase().includes(suffixLow)
    ) {
      const cleaned = title.slice(0, idx).trim();
      if (cleaned.length >= 5) return cleaned;
    }
  }
  return title;
}

function smartTitle(title, url) {
  if (!url) return title || '';
  let pathname = '', hostname = '';
  try { const u = new URL(url); pathname = u.pathname; hostname = u.hostname; }
  catch { return title || ''; }

  const titleIsUrl = !title || title === url || title.startsWith(hostname) || title.startsWith('http');

  if ((hostname === 'x.com' || hostname === 'twitter.com' || hostname === 'www.x.com') && pathname.includes('/status/')) {
    const username = pathname.split('/')[1];
    if (username) return titleIsUrl ? `Post by @${username}` : title;
  }

  if (hostname === 'github.com' || hostname === 'www.github.com') {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      const [owner, repo, ...rest] = parts;
      if (rest[0] === 'issues' && rest[1]) return `${owner}/${repo} Issue #${rest[1]}`;
      if (rest[0] === 'pull'   && rest[1]) return `${owner}/${repo} PR #${rest[1]}`;
      if (rest[0] === 'blob' || rest[0] === 'tree') return `${owner}/${repo} — ${rest.slice(2).join('/')}`;
      if (titleIsUrl) return `${owner}/${repo}`;
    }
  }

  if ((hostname === 'www.youtube.com' || hostname === 'youtube.com') && pathname === '/watch') {
    if (titleIsUrl) return 'YouTube Video';
  }

  if ((hostname === 'www.reddit.com' || hostname === 'reddit.com' || hostname === 'old.reddit.com') && pathname.includes('/comments/')) {
    const parts  = pathname.split('/').filter(Boolean);
    const subIdx = parts.indexOf('r');
    if (subIdx !== -1 && parts[subIdx + 1]) {
      if (titleIsUrl) return `r/${parts[subIdx + 1]} post`;
    }
  }

  return title || url;
}


/* ----------------------------------------------------------------
   SVG ICON STRINGS
   ---------------------------------------------------------------- */
const ICONS = {
  tabs:    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18" /></svg>`,
  close:   `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`,
  archive: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>`,
  focus:   `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" /></svg>`,
  edit:    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.687a2.25 2.25 0 1 1 3.182 3.182L10.582 17.13a4.5 4.5 0 0 1-1.897 1.13L6 19l.74-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487Z" /></svg>`,
  trash:   `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673A2.25 2.25 0 0 1 15.916 21.75H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0V4.875A2.25 2.25 0 0 0 13.5 2.625h-3A2.25 2.25 0 0 0 8.25 4.875v.918m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`,
  more:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.75"/><circle cx="12" cy="12" r="1.75"/><circle cx="12" cy="19" r="1.75"/></svg>`,
};


/* ----------------------------------------------------------------
   IN-MEMORY STORE FOR OPEN-TAB GROUPS
   ---------------------------------------------------------------- */
let domainGroups = [];


/* ----------------------------------------------------------------
   HELPER: filter out browser-internal pages
   ---------------------------------------------------------------- */

/**
 * getRealTabs()
 *
 * Returns tabs that are real web pages — no chrome://, extension
 * pages, about:blank, etc.
 */
function getRealTabs() {
  return openTabs.filter(t => {
    const url = t.url || '';
    return (
      !url.startsWith('chrome://') &&
      !url.startsWith('chrome-extension://') &&
      !url.startsWith('about:') &&
      !url.startsWith('edge://') &&
      !url.startsWith('brave://')
    );
  });
}

/**
 * checkTabOutDupes()
 *
 * Counts how many Tab Out pages are open. If more than 1,
 * shows a banner offering to close the extras.
 */
function checkTabOutDupes() {
  const tabOutTabs = openTabs.filter(t => t.isTabOut);
  const banner  = document.getElementById('tabOutDupeBanner');
  const countEl = document.getElementById('tabOutDupeCount');
  if (!banner) return;

  if (tabOutTabs.length > 1) {
    if (countEl) countEl.textContent = tabOutTabs.length;
    banner.style.display = 'flex';
  } else {
    banner.style.display = 'none';
  }
}


/* ----------------------------------------------------------------
   OVERFLOW CHIPS ("+N more" expand button in domain cards)
   ---------------------------------------------------------------- */

function buildOverflowChips(hiddenTabs, urlCounts = {}) {
  const hiddenChips = hiddenTabs.map(tab => {
    const label    = cleanTitle(smartTitle(stripTitleNoise(tab.title || ''), tab.url), '');
    const count    = urlCounts[tab.url] || 1;
    const dupeTag  = count > 1 ? ` <span class="chip-dupe-badge">(${count}x)</span>` : '';
    const chipClass = count > 1 ? ' chip-has-dupes' : '';
    const safeUrl   = (tab.url || '').replace(/"/g, '&quot;');
    const safeTitle = label.replace(/"/g, '&quot;');
    let domain = '';
    try { domain = new URL(tab.url).hostname; } catch {}
    const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=16` : '';
    return `<div class="page-chip clickable${chipClass}" data-action="focus-tab" data-tab-url="${safeUrl}" title="${safeTitle}">
      ${faviconUrl ? `<img class="chip-favicon" src="${faviconUrl}" alt="" onerror="this.style.display='none'">` : ''}
      <span class="chip-text">${label}</span>${dupeTag}
      <div class="chip-actions">
        <button class="chip-action chip-save" data-action="defer-single-tab" data-tab-url="${safeUrl}" data-tab-title="${safeTitle}" title="Save for later">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
        </button>
        <button class="chip-action chip-close" data-action="close-single-tab" data-tab-url="${safeUrl}" title="Close this tab">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>`;
  }).join('');

  return `
    <div class="page-chips-overflow" style="display:none">${hiddenChips}</div>
    <div class="page-chip page-chip-overflow clickable" data-action="expand-chips">
      <span class="chip-text">+${hiddenTabs.length} more</span>
    </div>`;
}


/* ----------------------------------------------------------------
   DOMAIN CARD RENDERER
   ---------------------------------------------------------------- */

/**
 * renderDomainCard(group, groupIndex)
 *
 * Builds the HTML for one domain group card.
 * group = { domain: string, tabs: [{ url, title, id, windowId, active }] }
 */
function renderDomainCard(group) {
  const tabs      = group.tabs || [];
  const tabCount  = tabs.length;
  const isLanding = group.domain === '__landing-pages__';
  const stableId  = 'domain-' + group.domain.replace(/[^a-z0-9]/g, '-');

  // Count duplicates (exact URL match)
  const urlCounts = {};
  for (const tab of tabs) urlCounts[tab.url] = (urlCounts[tab.url] || 0) + 1;
  const dupeUrls   = Object.entries(urlCounts).filter(([, c]) => c > 1);
  const hasDupes   = dupeUrls.length > 0;
  const totalExtras = dupeUrls.reduce((s, [, c]) => s + c - 1, 0);

  const tabBadge = `<span class="open-tabs-badge">
    ${ICONS.tabs}
    ${tabCount} tab${tabCount !== 1 ? 's' : ''} open
  </span>`;

  const dupeBadge = hasDupes
    ? `<span class="open-tabs-badge" style="color:var(--accent-amber);background:rgba(200,113,58,0.08);">
        ${totalExtras} duplicate${totalExtras !== 1 ? 's' : ''}
      </span>`
    : '';

  // Deduplicate for display: show each URL once, with (Nx) badge if duped
  const seen = new Set();
  const uniqueTabs = [];
  for (const tab of tabs) {
    if (!seen.has(tab.url)) { seen.add(tab.url); uniqueTabs.push(tab); }
  }

  const visibleTabs = uniqueTabs.slice(0, 8);
  const extraCount  = uniqueTabs.length - visibleTabs.length;

  const pageChips = visibleTabs.map(tab => {
    let label = cleanTitle(smartTitle(stripTitleNoise(tab.title || ''), tab.url), group.domain);
    // For localhost tabs, prepend port number so you can tell projects apart
    try {
      const parsed = new URL(tab.url);
      if (parsed.hostname === 'localhost' && parsed.port) label = `${parsed.port} ${label}`;
    } catch {}
    const count    = urlCounts[tab.url];
    const dupeTag  = count > 1 ? ` <span class="chip-dupe-badge">(${count}x)</span>` : '';
    const chipClass = count > 1 ? ' chip-has-dupes' : '';
    const safeUrl   = (tab.url || '').replace(/"/g, '&quot;');
    const safeTitle = label.replace(/"/g, '&quot;');
    let domain = '';
    try { domain = new URL(tab.url).hostname; } catch {}
    const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=16` : '';
    return `<div class="page-chip clickable${chipClass}" data-action="focus-tab" data-tab-url="${safeUrl}" title="${safeTitle}">
      ${faviconUrl ? `<img class="chip-favicon" src="${faviconUrl}" alt="" onerror="this.style.display='none'">` : ''}
      <span class="chip-text">${label}</span>${dupeTag}
      <div class="chip-actions">
        <button class="chip-action chip-save" data-action="defer-single-tab" data-tab-url="${safeUrl}" data-tab-title="${safeTitle}" title="Save for later">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
        </button>
        <button class="chip-action chip-close" data-action="close-single-tab" data-tab-url="${safeUrl}" title="Close this tab">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>`;
  }).join('') + (extraCount > 0 ? buildOverflowChips(uniqueTabs.slice(8), urlCounts) : '');

  let actionsHtml = `
    <button class="action-btn close-tabs" data-action="close-domain-tabs" data-domain-id="${stableId}">
      ${ICONS.close}
      Close all ${tabCount} tab${tabCount !== 1 ? 's' : ''}
    </button>`;

  if (hasDupes) {
    const dupeUrlsEncoded = dupeUrls.map(([url]) => encodeURIComponent(url)).join(',');
    actionsHtml += `
      <button class="action-btn" data-action="dedup-keep-one" data-dupe-urls="${dupeUrlsEncoded}">
        Close ${totalExtras} duplicate${totalExtras !== 1 ? 's' : ''}
      </button>`;
  }

  return `
    <div class="mission-card domain-card ${hasDupes ? 'has-amber-bar' : 'has-neutral-bar'}" data-domain-id="${stableId}">
      <div class="status-bar"></div>
      <div class="mission-content">
        <div class="mission-top">
          <span class="mission-name">${isLanding ? 'Homepages' : (group.label || friendlyDomain(group.domain))}</span>
          ${tabBadge}
          ${dupeBadge}
        </div>
        <div class="mission-pages">${pageChips}</div>
        <div class="actions">${actionsHtml}</div>
      </div>
      <div class="mission-meta">
        <div class="mission-page-count">${tabCount}</div>
        <div class="mission-page-label">tabs</div>
      </div>
    </div>`;
}


/* ----------------------------------------------------------------
   SAVED FOR LATER — Render Checklist Column
   ---------------------------------------------------------------- */

/**
 * renderDeferredColumn()
 *
 * Reads saved tabs from chrome.storage.local and renders the right-side
 * "Saved for Later" checklist column. Shows active items as a checklist
 * and completed items in a collapsible archive.
 */
async function renderDeferredColumn() {
  const column         = document.getElementById('deferredColumn');
  const list           = document.getElementById('deferredList');
  const empty          = document.getElementById('deferredEmpty');
  const countEl        = document.getElementById('deferredCount');
  const archiveEl      = document.getElementById('deferredArchive');
  const archiveCountEl = document.getElementById('archiveCount');
  const archiveList    = document.getElementById('archiveList');

  if (!column) return;

  try {
    const { active, archived } = await getSavedTabs();

    // Hide the entire column if there's nothing to show
    if (active.length === 0 && archived.length === 0) {
      column.style.display = 'none';
      return;
    }

    column.style.display = 'block';

    // Render active checklist items
    if (active.length > 0) {
      countEl.textContent = `${active.length} item${active.length !== 1 ? 's' : ''}`;
      list.innerHTML = active.map(item => renderDeferredItem(item)).join('');
      list.style.display = 'block';
      empty.style.display = 'none';
    } else {
      list.style.display = 'none';
      countEl.textContent = '';
      empty.style.display = 'block';
    }

    // Render archive section
    if (archived.length > 0) {
      archiveCountEl.textContent = `(${archived.length})`;
      archiveList.innerHTML = archived.map(item => renderArchiveItem(item)).join('');
      archiveEl.style.display = 'block';
    } else {
      archiveEl.style.display = 'none';
    }

  } catch (err) {
    console.warn('[tab-out] Could not load saved tabs:', err);
    column.style.display = 'none';
  }
}

/**
 * renderDeferredItem(item)
 *
 * Builds HTML for one active checklist item: checkbox, title link,
 * domain, time ago, dismiss button.
 */
function renderDeferredItem(item) {
  let domain = '';
  try { domain = new URL(item.url).hostname.replace(/^www\./, ''); } catch {}
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
  const ago = timeAgo(item.savedAt);

  return `
    <div class="deferred-item" data-deferred-id="${item.id}">
      <input type="checkbox" class="deferred-checkbox" data-action="check-deferred" data-deferred-id="${item.id}">
      <div class="deferred-info">
        <a href="${item.url}" target="_blank" rel="noopener" class="deferred-title" title="${(item.title || '').replace(/"/g, '&quot;')}">
          <img src="${faviconUrl}" alt="" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px" onerror="this.style.display='none'">${item.title || item.url}
        </a>
        <div class="deferred-meta">
          <span>${domain}</span>
          <span>${ago}</span>
        </div>
      </div>
      <button class="deferred-dismiss" data-action="dismiss-deferred" data-deferred-id="${item.id}" title="Dismiss">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
      </button>
    </div>`;
}

/**
 * renderArchiveItem(item)
 *
 * Builds HTML for one completed/archived item (simpler: just title + date).
 */
function renderArchiveItem(item) {
  const ago = item.completedAt ? timeAgo(item.completedAt) : timeAgo(item.savedAt);
  return `
    <div class="archive-item">
      <a href="${item.url}" target="_blank" rel="noopener" class="archive-item-title" title="${(item.title || '').replace(/"/g, '&quot;')}">
        ${item.title || item.url}
      </a>
      <span class="archive-item-date">${ago}</span>
    </div>`;
}


/* ----------------------------------------------------------------
   MAIN DASHBOARD RENDERER
   ---------------------------------------------------------------- */

/**
 * renderStaticDashboard()
 *
 * The main render function:
 * 1. Paints greeting + date
 * 2. Fetches open tabs via chrome.tabs.query()
 * 3. Groups tabs by domain (with landing pages pulled out to their own group)
 * 4. Renders domain cards
 * 5. Updates footer stats
 * 6. Renders the "Saved for Later" checklist
 */
async function renderStaticDashboard() {
  // --- Header ---
  const greetingEl = document.getElementById('greeting');
  const dateEl     = document.getElementById('dateDisplay');
  if (greetingEl) greetingEl.textContent = getGreeting();
  if (dateEl)     dateEl.textContent     = getDateDisplay();

  // --- Quick links ---
  try {
    await hydrateShortcutsFromRepo();
    await renderQuickLinks();
  } catch (err) {
    console.error('[tab-out] Quick links failed to render:', err);
    const quickLinksSection = document.getElementById('quickLinksSection');
    if (quickLinksSection) quickLinksSection.style.display = 'none';
  }

  // --- Fetch tabs ---
  await fetchOpenTabs();
  const realTabs = getRealTabs();

  // --- Group tabs by domain ---
  // Landing pages (Gmail inbox, Twitter home, etc.) get their own special group
  // so they can be closed together without affecting content tabs on the same domain.
  const LANDING_PAGE_PATTERNS = [
    { hostname: 'mail.google.com', test: (p, h) =>
        !h.includes('#inbox/') && !h.includes('#sent/') && !h.includes('#search/') },
    { hostname: 'x.com',               pathExact: ['/home'] },
    { hostname: 'www.linkedin.com',    pathExact: ['/'] },
    { hostname: 'github.com',          pathExact: ['/'] },
    { hostname: 'www.youtube.com',     pathExact: ['/'] },
    // Merge personal patterns from config.local.js (if it exists)
    ...(typeof LOCAL_LANDING_PAGE_PATTERNS !== 'undefined' ? LOCAL_LANDING_PAGE_PATTERNS : []),
  ];

  function isLandingPage(url) {
    try {
      const parsed = new URL(url);
      return LANDING_PAGE_PATTERNS.some(p => {
        // Support both exact hostname and suffix matching (for wildcard subdomains)
        const hostnameMatch = p.hostname
          ? parsed.hostname === p.hostname
          : p.hostnameEndsWith
            ? parsed.hostname.endsWith(p.hostnameEndsWith)
            : false;
        if (!hostnameMatch) return false;
        if (p.test)       return p.test(parsed.pathname, url);
        if (p.pathPrefix) return parsed.pathname.startsWith(p.pathPrefix);
        if (p.pathExact)  return p.pathExact.includes(parsed.pathname);
        return parsed.pathname === '/';
      });
    } catch { return false; }
  }

  domainGroups = [];
  const groupMap    = {};
  const landingTabs = [];

  // Custom group rules from config.local.js (if any)
  const customGroups = typeof LOCAL_CUSTOM_GROUPS !== 'undefined' ? LOCAL_CUSTOM_GROUPS : [];

  // Check if a URL matches a custom group rule; returns the rule or null
  function matchCustomGroup(url) {
    try {
      const parsed = new URL(url);
      return customGroups.find(r => {
        const hostMatch = r.hostname
          ? parsed.hostname === r.hostname
          : r.hostnameEndsWith
            ? parsed.hostname.endsWith(r.hostnameEndsWith)
            : false;
        if (!hostMatch) return false;
        if (r.pathPrefix) return parsed.pathname.startsWith(r.pathPrefix);
        return true; // hostname matched, no path filter
      }) || null;
    } catch { return null; }
  }

  for (const tab of realTabs) {
    try {
      if (isLandingPage(tab.url)) {
        landingTabs.push(tab);
        continue;
      }

      // Check custom group rules first (e.g. merge subdomains, split by path)
      const customRule = matchCustomGroup(tab.url);
      if (customRule) {
        const key = customRule.groupKey;
        if (!groupMap[key]) groupMap[key] = { domain: key, label: customRule.groupLabel, tabs: [] };
        groupMap[key].tabs.push(tab);
        continue;
      }

      let hostname;
      if (tab.url && tab.url.startsWith('file://')) {
        hostname = 'local-files';
      } else {
        hostname = new URL(tab.url).hostname;
      }
      if (!hostname) continue;

      if (!groupMap[hostname]) groupMap[hostname] = { domain: hostname, tabs: [] };
      groupMap[hostname].tabs.push(tab);
    } catch {
      // Skip malformed URLs
    }
  }

  if (landingTabs.length > 0) {
    groupMap['__landing-pages__'] = { domain: '__landing-pages__', tabs: landingTabs };
  }

  // Sort: landing pages first, then domains from landing page sites, then by tab count
  // Collect exact hostnames and suffix patterns for priority sorting
  const landingHostnames = new Set(LANDING_PAGE_PATTERNS.map(p => p.hostname).filter(Boolean));
  const landingSuffixes = LANDING_PAGE_PATTERNS.map(p => p.hostnameEndsWith).filter(Boolean);
  function isLandingDomain(domain) {
    if (landingHostnames.has(domain)) return true;
    return landingSuffixes.some(s => domain.endsWith(s));
  }
  domainGroups = Object.values(groupMap).sort((a, b) => {
    const aIsLanding = a.domain === '__landing-pages__';
    const bIsLanding = b.domain === '__landing-pages__';
    if (aIsLanding !== bIsLanding) return aIsLanding ? -1 : 1;

    const aIsPriority = isLandingDomain(a.domain);
    const bIsPriority = isLandingDomain(b.domain);
    if (aIsPriority !== bIsPriority) return aIsPriority ? -1 : 1;

    return b.tabs.length - a.tabs.length;
  });

  // --- Render domain cards ---
  const openTabsSection      = document.getElementById('openTabsSection');
  const openTabsMissionsEl   = document.getElementById('openTabsMissions');
  const openTabsSectionCount = document.getElementById('openTabsSectionCount');
  const openTabsSectionTitle = document.getElementById('openTabsSectionTitle');

  if (domainGroups.length > 0 && openTabsSection) {
    if (openTabsSectionTitle) openTabsSectionTitle.textContent = 'Open tabs';
    openTabsSectionCount.innerHTML = `${domainGroups.length} domain${domainGroups.length !== 1 ? 's' : ''} &nbsp;&middot;&nbsp; <button class="action-btn close-tabs" data-action="close-all-open-tabs" style="font-size:11px;padding:3px 10px;">${ICONS.close} Close all ${realTabs.length} tabs</button>`;
    openTabsMissionsEl.innerHTML = domainGroups.map(g => renderDomainCard(g)).join('');
    openTabsSection.style.display = 'block';
  } else if (openTabsSection) {
    openTabsSection.style.display = 'none';
  }

  // --- Footer stats ---
  const statTabs = document.getElementById('statTabs');
  if (statTabs) statTabs.textContent = openTabs.length;

  // --- Check for duplicate Tab Out tabs ---
  checkTabOutDupes();

  // --- Render "Saved for Later" column ---
  await renderDeferredColumn();
}

async function renderDashboard() {
  await renderStaticDashboard();
}


/* ----------------------------------------------------------------
   EVENT HANDLERS — using event delegation

   One listener on document handles ALL button clicks.
   Think of it as one security guard watching the whole building
   instead of one per door.
   ---------------------------------------------------------------- */

document.addEventListener('click', async (e) => {
  // Walk up the DOM to find the nearest element with data-action
  const actionEl = e.target.closest('[data-action]');
  if (!actionEl) {
    if (shortcutMenuOpenId && !e.target.closest('.shortcut-card-menu-shell')) {
      await closeShortcutMenu();
    }
    return;
  }

  const action = actionEl.dataset.action;

  if (action !== 'toggle-shortcut-menu' && action !== 'edit-shortcut' && action !== 'delete-shortcut' && shortcutMenuOpenId) {
    const menuShell = actionEl.closest('.shortcut-card-menu-shell');
    if (!menuShell) {
      await closeShortcutMenu();
    }
  }

  if (action === 'toggle-shortcut-menu') {
    await toggleShortcutMenu(actionEl.dataset.shortcutId || null);
    return;
  }

  if (action === 'export-shortcut-sync-file') {
    await exportShortcutSyncFile();
    return;
  }

  if (action === 'show-shortcut-editor' || action === 'edit-shortcut') {
    await closeShortcutMenu();
    const shortcuts = await getShortcuts();
    const id = actionEl.dataset.shortcutId;
    openShortcutEditor(id ? getShortcutById(shortcuts, id) : null, actionEl);
    return;
  }

  if (action === 'cancel-shortcut-editor') {
    hideShortcutEditor();
    return;
  }

  if (action === 'show-shortcut-logo-editor') {
    openShortcutLogoEditor(actionEl);
    return;
  }

  if (action === 'cancel-shortcut-logo-editor') {
    hideShortcutLogoEditor();
    return;
  }

  if (action === 'reset-shortcut-logo-crop') {
    resetShortcutLogoCropState();
    return;
  }

  if (action === 'fit-shortcut-logo-crop') {
    fitShortcutLogoCropState();
    return;
  }

  if (action === 'save-shortcut-logo-crop') {
    await saveShortcutLogoCropState();
    return;
  }

  if (action === 'set-shortcut-rows') {
    const rows = Number(actionEl.dataset.shortcutRows || 1);
    await setShortcutRows(rows);
    await renderQuickLinks();
    return;
  }

  if (action === 'trigger-shortcut-logo-upload') {
    const input = document.getElementById('shortcutLogoInput');
    if (input) input.click();
    return;
  }

  if (action === 'reset-shortcut-logo') {
    shortcutEditorState.logoMode = 'auto';
    shortcutEditorState.logoDataUrl = '';
    shortcutEditorState.logoTransform = createDefaultShortcutLogoTransform();
    renderShortcutEditorState();
    return;
  }

  if (action === 'delete-shortcut') {
    await closeShortcutMenu();
    await handleShortcutDelete(actionEl.dataset.shortcutId);
    return;
  }

  // ---- Close duplicate Tab Out tabs ----
  if (action === 'close-tabout-dupes') {
    await closeTabOutDupes();
    playCloseSound();
    const banner = document.getElementById('tabOutDupeBanner');
    if (banner) {
      banner.style.transition = 'opacity 0.4s';
      banner.style.opacity = '0';
      setTimeout(() => { banner.style.display = 'none'; banner.style.opacity = '1'; }, 400);
    }
    showToast('Closed extra Tab Out tabs');
    return;
  }

  const card = actionEl.closest('.mission-card');

  // ---- Expand overflow chips ("+N more") ----
  if (action === 'expand-chips') {
    const overflowContainer = actionEl.parentElement.querySelector('.page-chips-overflow');
    if (overflowContainer) {
      overflowContainer.style.display = 'contents';
      actionEl.remove();
    }
    return;
  }

  if (action === 'open-shortcut') {
    shortcutMenuOpenId = null;
    if (Date.now() < shortcutSuppressOpenUntil) return;
    const shortcuts = await getShortcuts();
    const shortcut = getShortcutById(shortcuts, actionEl.dataset.shortcutId);
    if (shortcut) window.location.href = shortcut.url;
    return;
  }

  // ---- Focus a specific tab ----
  if (action === 'focus-tab') {
    const tabUrl = actionEl.dataset.tabUrl;
    if (tabUrl) await focusTab(tabUrl);
    return;
  }

  // ---- Close a single tab ----
  if (action === 'close-single-tab') {
    e.stopPropagation(); // don't trigger parent chip's focus-tab
    const tabUrl = actionEl.dataset.tabUrl;
    if (!tabUrl) return;

    // Close the tab in Chrome directly
    const allTabs = await chrome.tabs.query({});
    const match   = allTabs.find(t => t.url === tabUrl);
    if (match) await chrome.tabs.remove(match.id);
    await fetchOpenTabs();

    playCloseSound();

    // Animate the chip row out
    const chip = actionEl.closest('.page-chip');
    if (chip) {
      const rect = chip.getBoundingClientRect();
      shootConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      chip.style.transition = 'opacity 0.2s, transform 0.2s';
      chip.style.opacity    = '0';
      chip.style.transform  = 'scale(0.8)';
      setTimeout(() => {
        chip.remove();
        // If the card now has no tabs, remove it too
        const parentCard = document.querySelector('.mission-card:has(.mission-pages:empty)');
        if (parentCard) animateCardOut(parentCard);
        document.querySelectorAll('.mission-card').forEach(c => {
          if (c.querySelectorAll('.page-chip[data-action="focus-tab"]').length === 0) {
            animateCardOut(c);
          }
        });
      }, 200);
    }

    // Update footer
    const statTabs = document.getElementById('statTabs');
    if (statTabs) statTabs.textContent = openTabs.length;

    showToast('Tab closed');
    return;
  }

  // ---- Save a single tab for later (then close it) ----
  if (action === 'defer-single-tab') {
    e.stopPropagation();
    const tabUrl   = actionEl.dataset.tabUrl;
    const tabTitle = actionEl.dataset.tabTitle || tabUrl;
    if (!tabUrl) return;

    // Save to chrome.storage.local
    try {
      await saveTabForLater({ url: tabUrl, title: tabTitle });
    } catch (err) {
      console.error('[tab-out] Failed to save tab:', err);
      showToast('Failed to save tab');
      return;
    }

    // Close the tab in Chrome
    const allTabs = await chrome.tabs.query({});
    const match   = allTabs.find(t => t.url === tabUrl);
    if (match) await chrome.tabs.remove(match.id);
    await fetchOpenTabs();

    // Animate chip out
    const chip = actionEl.closest('.page-chip');
    if (chip) {
      chip.style.transition = 'opacity 0.2s, transform 0.2s';
      chip.style.opacity    = '0';
      chip.style.transform  = 'scale(0.8)';
      setTimeout(() => chip.remove(), 200);
    }

    showToast('Saved for later');
    await renderDeferredColumn();
    return;
  }

  // ---- Check off a saved tab (moves it to archive) ----
  if (action === 'check-deferred') {
    const id = actionEl.dataset.deferredId;
    if (!id) return;

    await checkOffSavedTab(id);

    // Animate: strikethrough first, then slide out
    const item = actionEl.closest('.deferred-item');
    if (item) {
      item.classList.add('checked');
      setTimeout(() => {
        item.classList.add('removing');
        setTimeout(() => {
          item.remove();
          renderDeferredColumn(); // refresh counts and archive
        }, 300);
      }, 800);
    }
    return;
  }

  // ---- Dismiss a saved tab (removes it entirely) ----
  if (action === 'dismiss-deferred') {
    const id = actionEl.dataset.deferredId;
    if (!id) return;

    await dismissSavedTab(id);

    const item = actionEl.closest('.deferred-item');
    if (item) {
      item.classList.add('removing');
      setTimeout(() => {
        item.remove();
        renderDeferredColumn();
      }, 300);
    }
    return;
  }

  // ---- Close all tabs in a domain group ----
  if (action === 'close-domain-tabs') {
    const domainId = actionEl.dataset.domainId;
    const group    = domainGroups.find(g => {
      return 'domain-' + g.domain.replace(/[^a-z0-9]/g, '-') === domainId;
    });
    if (!group) return;

    const urls      = group.tabs.map(t => t.url);
    // Landing pages and custom groups (whose domain key isn't a real hostname)
    // must use exact URL matching to avoid closing unrelated tabs
    const useExact  = group.domain === '__landing-pages__' || !!group.label;

    if (useExact) {
      await closeTabsExact(urls);
    } else {
      await closeTabsByUrls(urls);
    }

    if (card) {
      playCloseSound();
      animateCardOut(card);
    }

    // Remove from in-memory groups
    const idx = domainGroups.indexOf(group);
    if (idx !== -1) domainGroups.splice(idx, 1);

    const groupLabel = group.domain === '__landing-pages__' ? 'Homepages' : (group.label || friendlyDomain(group.domain));
    showToast(`Closed ${urls.length} tab${urls.length !== 1 ? 's' : ''} from ${groupLabel}`);

    const statTabs = document.getElementById('statTabs');
    if (statTabs) statTabs.textContent = openTabs.length;
    return;
  }

  // ---- Close duplicates, keep one copy ----
  if (action === 'dedup-keep-one') {
    const urlsEncoded = actionEl.dataset.dupeUrls || '';
    const urls = urlsEncoded.split(',').map(u => decodeURIComponent(u)).filter(Boolean);
    if (urls.length === 0) return;

    await closeDuplicateTabs(urls, true);
    playCloseSound();

    // Hide the dedup button
    actionEl.style.transition = 'opacity 0.2s';
    actionEl.style.opacity    = '0';
    setTimeout(() => actionEl.remove(), 200);

    // Remove dupe badges from the card
    if (card) {
      card.querySelectorAll('.chip-dupe-badge').forEach(b => {
        b.style.transition = 'opacity 0.2s';
        b.style.opacity    = '0';
        setTimeout(() => b.remove(), 200);
      });
      card.querySelectorAll('.open-tabs-badge').forEach(badge => {
        if (badge.textContent.includes('duplicate')) {
          badge.style.transition = 'opacity 0.2s';
          badge.style.opacity    = '0';
          setTimeout(() => badge.remove(), 200);
        }
      });
      card.classList.remove('has-amber-bar');
      card.classList.add('has-neutral-bar');
    }

    showToast('Closed duplicates, kept one copy each');
    return;
  }

  // ---- Close ALL open tabs ----
  if (action === 'close-all-open-tabs') {
    const allUrls = openTabs
      .filter(t => t.url && !t.url.startsWith('chrome') && !t.url.startsWith('about:'))
      .map(t => t.url);
    await closeTabsByUrls(allUrls);
    playCloseSound();

    document.querySelectorAll('#openTabsMissions .mission-card').forEach(c => {
      shootConfetti(
        c.getBoundingClientRect().left + c.offsetWidth / 2,
        c.getBoundingClientRect().top  + c.offsetHeight / 2
      );
      animateCardOut(c);
    });

    showToast('All tabs closed. Fresh start.');
    return;
  }
});

document.addEventListener('submit', async (e) => {
  if (e.target.id !== 'shortcutEditor') return;
  e.preventDefault();
  await handleShortcutSave();
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (isShortcutLogoEditorOpen()) {
    hideShortcutLogoEditor();
    return;
  }
  if (isShortcutEditorOpen()) {
    hideShortcutEditor();
    return;
  }
  if (shortcutMenuOpenId) {
    shortcutMenuOpenId = null;
    renderQuickLinks();
  }
});

document.addEventListener('input', (e) => {
  if (e.target.id === 'shortcutUrlInput' || e.target.id === 'shortcutTitleInput') {
    cacheShortcutDraftFromForm();
    setShortcutEditorError('');
    renderShortcutEditorState();
    return;
  }

  if (e.target.id === 'shortcutLogoScaleInput') {
    const nextScale = Number(e.target.value) / 100;
    applyShortcutLogoCropState({
      ...shortcutLogoCropState,
      scale: nextScale,
    });
  }
});

document.addEventListener('change', async (e) => {
  if (e.target.id !== 'shortcutLogoInput') return;

  const [file] = e.target.files || [];
  if (!file) return;

  try {
    shortcutEditorState.logoDataUrl = await readFileAsDataUrl(file);
    shortcutEditorState.logoMode = 'upload';
    shortcutEditorState.logoTransform = createDefaultShortcutLogoTransform();
    setShortcutEditorError('');
    renderShortcutEditorState();
  } catch (err) {
    setShortcutEditorError(err && err.message ? err.message : 'Could not read that image.');
  } finally {
    e.target.value = '';
  }
});

document.addEventListener('pointerdown', (e) => {
  const cardMain = e.target.closest('.shortcut-card-main');
  if (!cardMain || !shouldUseShortcutLongPress(e)) return;

  const card = cardMain.closest('.shortcut-card');
  if (!card) return;
  beginShortcutLongPress(card, e);
});

document.addEventListener('pointerdown', (e) => {
  const stage = e.target.closest('#shortcutLogoCropStage');
  if (!stage || !isShortcutLogoEditorOpen()) return;
  if (!stage.querySelector('.shortcut-logo-media')) return;

  const rect = stage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  shortcutLogoCropPointer = {
    pointerId: e.pointerId,
    stageWidth: rect.width,
    stageHeight: rect.height,
    startX: e.clientX,
    startY: e.clientY,
    startOffsetX: shortcutLogoCropState.offsetX,
    startOffsetY: shortcutLogoCropState.offsetY,
  };

  stage.classList.add('is-dragging');
  e.preventDefault();
});

document.addEventListener('pointermove', (e) => {
  updateShortcutLongPress(e);
  if (!shortcutLogoCropPointer || e.pointerId !== shortcutLogoCropPointer.pointerId) return;

  const deltaX = (e.clientX - shortcutLogoCropPointer.startX) / shortcutLogoCropPointer.stageWidth;
  const deltaY = (e.clientY - shortcutLogoCropPointer.startY) / shortcutLogoCropPointer.stageHeight;
  applyShortcutLogoCropState({
    ...shortcutLogoCropState,
    offsetX: shortcutLogoCropPointer.startOffsetX + deltaX,
    offsetY: shortcutLogoCropPointer.startOffsetY + deltaY,
  });
});

function finishShortcutLogoPointerDrag(pointerId) {
  if (!shortcutLogoCropPointer || (typeof pointerId === 'number' && shortcutLogoCropPointer.pointerId !== pointerId)) {
    return;
  }

  shortcutLogoCropPointer = null;
  const stage = document.getElementById('shortcutLogoCropStage');
  if (stage) stage.classList.remove('is-dragging');
}

document.addEventListener('pointerup', (e) => {
  clearShortcutLongPressState(e.pointerId);
  finishShortcutLogoPointerDrag(e.pointerId);
});

document.addEventListener('pointercancel', (e) => {
  clearShortcutLongPressState(e.pointerId);
  finishShortcutLogoPointerDrag(e.pointerId);
});

document.addEventListener('dragstart', (e) => {
  const card = e.target.closest('.shortcut-card');
  if (!card) return;

  clearShortcutLongPressState();
  shortcutMenuOpenId = null;
  shortcutDragId = card.dataset.shortcutId || null;
  card.classList.add('dragging');
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', shortcutDragId || '');
  }
});

document.addEventListener('dragover', (e) => {
  const card = e.target.closest('.shortcut-card');
  if (!card || !shortcutDragId) return;
  if (card.dataset.shortcutId === shortcutDragId) return;

  e.preventDefault();
  document.querySelectorAll('.shortcut-card.drop-target').forEach(node => {
    if (node !== card) node.classList.remove('drop-target');
  });
  card.classList.add('drop-target');
});

document.addEventListener('dragleave', (e) => {
  const card = e.target.closest('.shortcut-card');
  if (!card) return;

  const nextTarget = e.relatedTarget;
  if (nextTarget && card.contains(nextTarget)) return;
  card.classList.remove('drop-target');
});

document.addEventListener('drop', async (e) => {
  const card = e.target.closest('.shortcut-card');
  if (!card || !shortcutDragId) return;
  if (card.dataset.shortcutId === shortcutDragId) return;

  e.preventDefault();
  const shortcuts = await getShortcuts();
  const nextShortcuts = ShortcutCore.moveShortcutItem(shortcuts, shortcutDragId, card.dataset.shortcutId);
  await setShortcuts(nextShortcuts);
  shortcutSuppressOpenUntil = Date.now() + 250;
  shortcutDragId = null;
  clearShortcutDragClasses();
  await renderQuickLinks();
});

document.addEventListener('dragend', () => {
  shortcutDragId = null;
  shortcutSuppressOpenUntil = Date.now() + 250;
  clearShortcutDragClasses();
});

// ---- Archive toggle — expand/collapse the archive section ----
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('#archiveToggle');
  if (!toggle) return;

  toggle.classList.toggle('open');
  const body = document.getElementById('archiveBody');
  if (body) {
    body.style.display = body.style.display === 'none' ? 'block' : 'none';
  }
});

// ---- Archive search — filter archived items as user types ----
document.addEventListener('input', async (e) => {
  if (e.target.id !== 'archiveSearch') return;

  const q = e.target.value.trim().toLowerCase();
  const archiveList = document.getElementById('archiveList');
  if (!archiveList) return;

  try {
    const { archived } = await getSavedTabs();

    if (q.length < 2) {
      // Show all archived items
      archiveList.innerHTML = archived.map(item => renderArchiveItem(item)).join('');
      return;
    }

    // Filter by title or URL containing the query string
    const results = archived.filter(item =>
      (item.title || '').toLowerCase().includes(q) ||
      (item.url  || '').toLowerCase().includes(q)
    );

    archiveList.innerHTML = results.map(item => renderArchiveItem(item)).join('')
      || '<div style="font-size:12px;color:var(--muted);padding:8px 0">No results</div>';
  } catch (err) {
    console.warn('[tab-out] Archive search failed:', err);
  }
});


/* ----------------------------------------------------------------
   INITIALIZE
   ---------------------------------------------------------------- */
renderDashboard().catch(err => {
  console.error('[tab-out] Dashboard failed to render:', err);
});
