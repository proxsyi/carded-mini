const STORAGE_KEY = 'cardedMiniCards';

function loadCards() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCards(cards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

// Main page
if (document.getElementById('importBtn')) {
  const importBtn = document.getElementById('importBtn');
  const importText = document.getElementById('importText');
  const termInput = document.getElementById('termInput');
  const defInput = document.getElementById('defInput');
  const addBtn = document.getElementById('addBtn');
  const cardList = document.getElementById('cardList');
  const clearBtn = document.getElementById('clearBtn');

  function render() {
    const cards = loadCards();
    cardList.innerHTML = '';
    cards.forEach((c) => {
      const li = document.createElement('li');
      li.textContent = `${c.term} — ${c.definition}`;
      cardList.appendChild(li);
    });
  }

  importBtn.addEventListener('click', () => {
    const lines = importText.value.split('\n').map(l => l.trim()).filter(Boolean);
    const cards = loadCards();
    lines.forEach(line => {
      const [term, definition] = line.split('|').map(s => s.trim());
      if (term && definition) cards.push({ term, definition });
    });
    saveCards(cards);
    importText.value = '';
    render();
  });

  addBtn.addEventListener('click', () => {
    const term = termInput.value.trim();
    const definition = defInput.value.trim();
    if (!term || !definition) return;
    const cards = loadCards();
    cards.push({ term, definition });
    saveCards(cards);
    termInput.value = '';
    defInput.value = '';
    render();
  });

  clearBtn.addEventListener('click', () => {
    if (confirm('Clear all cards?')) {
      saveCards([]);
      render();
    }
  });

  render();
}

// Practice page
if (document.getElementById('cardContainer')) {
  const container = document.getElementById('cardContainer');
  const cards = loadCards();

  if (cards.length === 0) {
    container.innerHTML = '<p class="empty">No cards yet. Add some on the main page.</p>';
  } else {
    cards.forEach(c => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-inner">
          <div class="face front">${c.term}</div>
          <div class="face back">${c.definition}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
      container.appendChild(card);
    });
  }
}
