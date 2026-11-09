'use strict';

const STORAGE_KEY = 'china_cards_v3';
const CARDS_PER_SHEET = 6;

let CARDS = [];

function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
}

function loadCardsFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.warn(e);
    }
    return null;
}

function saveCards() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(CARDS));
    } catch (e) {
        console.warn(e);
    }
}

function appendCardToSheet(sheet, c, idx) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = renderCardHtml(c, idx, escapeHtml);
    sheet.appendChild(card);

    card.querySelector('.card__delete').addEventListener('click', function (e) {
        e.stopPropagation();
        const i = parseInt(card.querySelector('.card__delete').dataset.idx, 10);
        if (confirm('Удалить эту карточку?')) {
            CARDS.splice(i, 1);
            saveCards();
            renderCards();
        }
    });
}

function renderCards() {
    const root = document.getElementById('sheets');
    root.innerHTML = '';

    if (!CARDS.length) {
        const empty = document.createElement('div');
        empty.className = 'sheet';
        root.appendChild(empty);
        return;
    }

    for (let start = 0; start < CARDS.length; start += CARDS_PER_SHEET) {
        const sheet = document.createElement('div');
        sheet.className = 'sheet';
        const chunk = CARDS.slice(start, start + CARDS_PER_SHEET);
        chunk.forEach(function (c, offset) {
            appendCardToSheet(sheet, c, start + offset);
        });
        root.appendChild(sheet);
    }
}

function bindUi() {
    const addPanel = document.getElementById('addPanel');
    const statusEl = document.getElementById('status');

    document.getElementById('toggleAdd').addEventListener('click', function () {
        addPanel.classList.toggle('add-panel--open');
        if (addPanel.classList.contains('add-panel--open')) {
            document.getElementById('inputRu').focus();
        }
    });

    function showStatus(msg, type) {
        statusEl.textContent = msg;
        statusEl.className = 'add-panel__status' + (type ? ' add-panel__status--' + type : '');
        if (type === 'ok') {
            setTimeout(function () { statusEl.className = 'add-panel__status'; }, 2500);
        }
    }

    function clearInputs() {
        document.getElementById('inputRu').value = '';
        document.getElementById('inputEn').value = '';
        document.getElementById('inputZh').value = '';
        document.getElementById('inputPinyin').value = '';
        document.getElementById('inputIcons').value = '📍';
    }

    document.getElementById('btnAdd').addEventListener('click', function () {
        const ru = document.getElementById('inputRu').value.trim();
        const en = document.getElementById('inputEn').value.trim();
        const zh = document.getElementById('inputZh').value.trim();
        const pinyin = document.getElementById('inputPinyin').value.trim();
        const icons = document.getElementById('inputIcons').value.trim() || '📍';

        if (!ru) { showStatus('Введите русский текст', 'err'); return; }
        if (!zh) { showStatus('Введите иероглифы (中文)', 'err'); return; }

        CARDS.push({ ru, en, zh, pinyin, icons });
        saveCards();
        renderCards();
        clearInputs();
        showStatus('Карточка добавлена', 'ok');
        document.getElementById('inputRu').focus();
    });

    document.getElementById('btnClear').addEventListener('click', function () {
        if (!confirm('Удалить все карточки и вернуть набор из js/phrases.js?')) return;
        CARDS = JSON.parse(JSON.stringify(DEFAULT_PHRASES));
        saveCards();
        renderCards();
        showStatus('Загружен стандартный набор', 'ok');
    });

    ['inputRu', 'inputEn', 'inputZh', 'inputPinyin', 'inputIcons'].forEach(function (id) {
        document.getElementById(id).addEventListener('keydown', function (e) {
            if (e.key === 'Enter') document.getElementById('btnAdd').click();
        });
    });
}

function init() {
    bindUi();
    const stored = loadCardsFromStorage();
    CARDS = stored || JSON.parse(JSON.stringify(DEFAULT_PHRASES));
    renderCards();
}

init();
