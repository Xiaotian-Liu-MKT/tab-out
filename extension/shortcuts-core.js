(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
    return;
  }

  root.TabOutShortcutsCore = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const FRIENDLY_SHORTCUT_DOMAINS = {
    'github.com': 'GitHub',
    'youtube.com': 'YouTube',
    'notion.so': 'Notion',
    'figma.com': 'Figma',
    'linear.app': 'Linear',
    'x.com': 'X',
    'twitter.com': 'X',
    'mail.google.com': 'Gmail',
    'calendar.google.com': 'Google Calendar',
    'docs.google.com': 'Google Docs',
    'drive.google.com': 'Google Drive',
    'localhost': 'Localhost',
  };
  const DEFAULT_SHORTCUT_LOGO_TRANSFORM = Object.freeze({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });

  function clampNumber(value, min, max, fallback) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    if (parsed < min) return min;
    if (parsed > max) return max;
    return parsed;
  }

  function normalizeShortcutLogoTransform(input) {
    if (!input || typeof input !== 'object') {
      return {
        scale: DEFAULT_SHORTCUT_LOGO_TRANSFORM.scale,
        offsetX: DEFAULT_SHORTCUT_LOGO_TRANSFORM.offsetX,
        offsetY: DEFAULT_SHORTCUT_LOGO_TRANSFORM.offsetY,
      };
    }

    return {
      scale: clampNumber(input.scale, 0.5, 2.5, DEFAULT_SHORTCUT_LOGO_TRANSFORM.scale),
      offsetX: clampNumber(input.offsetX, -1, 1, DEFAULT_SHORTCUT_LOGO_TRANSFORM.offsetX),
      offsetY: clampNumber(input.offsetY, -1, 1, DEFAULT_SHORTCUT_LOGO_TRANSFORM.offsetY),
    };
  }

  function normalizeShortcutUrl(input) {
    const raw = String(input || '').trim();
    if (!raw) throw new Error('Please enter a valid URL.');

    const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw);
    const candidate = hasScheme ? raw : `https://${raw}`;

    let parsed;
    try {
      parsed = new URL(candidate);
    } catch {
      throw new Error('Please enter a valid URL.');
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Shortcut URLs must use http or https.');
    }

    if (!parsed.hostname) {
      throw new Error('Please enter a valid URL.');
    }

    return parsed.toString();
  }

  function inferShortcutDomain(input) {
    const normalized = normalizeShortcutUrl(input);
    return new URL(normalized).hostname.replace(/^www\./i, '');
  }

  function titleCasePart(part) {
    if (!part) return '';
    return part
      .split('-')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function inferShortcutTitle(input) {
    const domain = inferShortcutDomain(input);

    if (FRIENDLY_SHORTCUT_DOMAINS[domain]) {
      return FRIENDLY_SHORTCUT_DOMAINS[domain];
    }

    const parts = domain
      .split('.')
      .filter(Boolean)
      .filter(part => !['com', 'org', 'net', 'io', 'dev', 'app', 'ai', 'co', 'me', 'so', 'xyz'].includes(part));

    if (parts.length === 0) {
      return domain;
    }

    return parts.map(titleCasePart).join(' ').trim();
  }

  function moveShortcutItem(items, draggedId, targetId) {
    const list = Array.isArray(items) ? items.slice() : [];
    const fromIndex = list.findIndex(item => item.id === draggedId);
    const toIndex = list.findIndex(item => item.id === targetId);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      return list;
    }

    const [moved] = list.splice(fromIndex, 1);
    const insertAt = fromIndex < toIndex ? toIndex - 1 : toIndex;
    list.splice(insertAt, 0, moved);
    return list;
  }

  function getShortcutInitial(shortcut) {
    const source = String(
      (shortcut && shortcut.title) ||
      (shortcut && shortcut.domain) ||
      ''
    ).trim();

    const match = source.match(/[A-Za-z0-9]/);
    return match ? match[0].toUpperCase() : '?';
  }

  function getShortcutFaviconUrl(url) {
    const normalized = normalizeShortcutUrl(url);
    const parsed = new URL(normalized);
    return `${parsed.origin}/favicon.ico`;
  }

  function mergeShortcutImports(existing, incoming) {
    const base = Array.isArray(existing) ? existing.slice() : [];
    const additions = Array.isArray(incoming) ? incoming : [];
    const seenUrls = new Set(
      base
        .map(item => item && item.url)
        .filter(Boolean)
    );

    for (const item of additions) {
      if (!item || !item.url || seenUrls.has(item.url)) continue;
      base.push(item);
      seenUrls.add(item.url);
    }

    return base;
  }

  function buildShortcutRecord(input, overrides) {
    const normalizedUrl = normalizeShortcutUrl(input.url);
    const domain = inferShortcutDomain(normalizedUrl);

    return {
      id: (overrides && overrides.id) || `${Date.now()}`,
      url: normalizedUrl,
      title: String((input && input.title) || '').trim() || inferShortcutTitle(normalizedUrl),
      domain,
      logoMode: (input && input.logoMode) === 'upload' ? 'upload' : 'auto',
      logoDataUrl: String((input && input.logoDataUrl) || ''),
      logoTransform: normalizeShortcutLogoTransform(input && input.logoTransform),
      createdAt: (overrides && overrides.createdAt) || new Date().toISOString(),
    };
  }

  return {
    DEFAULT_SHORTCUT_LOGO_TRANSFORM,
    buildShortcutRecord,
    getShortcutFaviconUrl,
    getShortcutInitial,
    inferShortcutDomain,
    inferShortcutTitle,
    mergeShortcutImports,
    moveShortcutItem,
    normalizeShortcutLogoTransform,
    normalizeShortcutUrl,
  };
});
