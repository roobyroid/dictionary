const input = document.querySelector('#word-input');
const form = document.querySelector('.form');
const wordContainer = document.querySelector('.results-word');
const btnSound = document.querySelector('.results-sound');
const resultsWrapper = document.querySelector('.results');
const resultsList = document.querySelector('.results-list');
const errorContainer = document.querySelector('.error')
const loader = document.querySelector('.loader')
const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
let state = {
  word: '',
  meanings: [],
  phonetics: []
}

// handlers
input.addEventListener('keyup', handlerInput)
form.addEventListener('submit', handlerForm)
btnSound.addEventListener('click', handlerSound)

function handlerInput(event) {
  state.word = event.target.value;
}

async function handlerForm(event) {
  event.preventDefault();
  errorContainer.style.display = 'none';
  loader.style.display = 'block';
  if (!state.word.trim()) return;
  try {
    const response = await fetch(`${url}${state.word}`);
    const data = await response.json();
    if (response.ok && data.length) {
      const item = data[0];
      state = {
        ...state,
        meanings: item.meanings,
        phonetics: item.phonetics,
      }

      showResults(state.meanings);
      insertWord();
      loader.style.display = 'none';
    } else {
      loader.style.display = 'none';
      showError(data);
    }
  } catch (error) {
    console.log(error)
  }
}

function handlerSound() {
  if (state.phonetics.length) {
    const sound = state.phonetics[0];
    if (sound.audio) {
      new Audio(sound.audio).play();
    }
  }
}

function insertWord() {
  wordContainer.textContent = state.word;
}

function showResults(dataArr) {
  resultsWrapper.style.display = "block";
  resultsList.innerHTML = '';
  dataArr.forEach(item => resultsList.innerHTML += renderResults(item));
}

function renderResults(item) {
  return `
    <div class="results-item">
      <div class="results-item__part">${item.partOfSpeech}</div>
      <div class="results-item__definitions">
        ${getDefinitions(item.definitions)}
      </div>
    </div>
  `
}

function getDefinitions(definitions) {
  return definitions.map(renderDefinition).join('');
}

function renderDefinition(itemDefinition) {
  const example = itemDefinition.example
    ? `<div class="results-item__example">
      <p>Example: <span>${itemDefinition.example}</span></p>
    </div>`
    : "";

  return `<div class="results-item__definition">
          <p>${itemDefinition.definition}</p>
          ${example}
        </div>`;
}

function showError(data) {
  errorContainer.style.display = 'block';
  resultsWrapper.style.display = 'none';

  errorContainer.textContent = data.message
}
