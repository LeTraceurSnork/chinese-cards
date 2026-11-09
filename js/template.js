/* Должен совпадать с templates/card.html */
const CARD_TEMPLATE = `<button class="card__delete" data-idx="{{idx}}" title="Удалить" type="button">✕</button>
<div class="card__desc">
  <div class="card__line"><span class="card__flag">🇷🇺</span><span class="card__text card__text--ru">{{ru}}</span></div>
  <div class="card__line"><span class="card__flag">🇬🇧</span><span class="card__text card__text--en">{{en}}</span></div>
</div>
<div class="card__zh">
  <div class="card__hanzi">{{zh}}</div>
  <div class="card__pinyin">{{pinyin}}</div>
</div>
<div class="card__picto">{{icons}}</div>`;

function renderCardHtml(card, idx, escapeHtml) {
    const ru = escapeHtml(card.ru);
    const en = escapeHtml(card.en || '');
    const zh = escapeHtml(card.zh || '???');
    const pinyin = escapeHtml(card.pinyin || '');
    const icons = card.icons || '📍';

    return CARD_TEMPLATE
        .replace(/\{\{idx\}\}/g, String(idx))
        .replace(/\{\{ru\}\}/g, ru)
        .replace(/\{\{en\}\}/g, en)
        .replace(/\{\{zh\}\}/g, zh)
        .replace(/\{\{pinyin\}\}/g, pinyin)
        .replace(/\{\{icons\}\}/g, icons);
}
