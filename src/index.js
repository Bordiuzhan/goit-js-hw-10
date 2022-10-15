import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const card = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  resetUI();
  const editedValue = e.target.value.trim();
  if (!editedValue) {
    return;
  }

  fetchCountries(editedValue)
    .then(data => {
      const length = data.length;
      if (length >= 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (length < 10 && length > 1) {
        const markup = createMarkupList(data);
        list.insertAdjacentHTML('beforeend', markup);
      }
      if (length === 1) {
        const markup = createMarkupCard(data[0]);
        card.insertAdjacentHTML('beforeend', markup);
      }
    })
    .catch(err =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function createMarkupList(arr) {
  return arr
    .map(
      item =>
        `<li><img src="${item.flags.svg}" alt="flag" width=30 hight=20> ${item.name.common}</li>`
    )
    .join('');
}

function createMarkupCard(arr) {
  const { flags, name, capital, population, languages } = arr;
  return `<h2><img src="${flags.svg}" alt="flag" width=30 /> ${name.common}</h2>
  <p><b>Capital:</b> ${capital}</p>
  <p><b>Population:</b> ${population}</p>
  <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>`;
}

function resetUI() {
  list.innerHTML = '';
  card.innerHTML = '';
}
