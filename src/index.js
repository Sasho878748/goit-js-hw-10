import './css/styles.css';
import { fetchCountries } from './api';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  mySearchBox: document.getElementById('search-box'),
  myCountryList: document.querySelector('.country-list'),
  myCountryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.mySearchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  const searchQuery = event.target.value.trim();

  if (!searchQuery) {
    clearMarkup();
    return;
  }

  fetchCountries(searchQuery)
    .then(renderCountriesMarkup)
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name!');
      clearMarkup();
    });
}

function renderCountriesMarkup(countries) {
  if (countries.length === 0) {
    Notiflix.Notify.failure('Oops, no matching country found!');
    return;
  }

  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  if (countries.length === 1) {
    const country = countries[0];
    const languages = country.languages
      .map(language => language.name)
      .join(', ');
    const markup = `
      <div class="country-card">
        <img src="${country.flags.svg}" alt="${
      country.name
    } flag" class="country-card__flag">
        <div class="country-card__info">
          <h2 class="country-card__name">${country.name}</h2>
          <p class="country-card__population"><span>Population:</span> ${
            country.population
          }</p>
          <p class="country-card__capital"><span>Capital:</span> ${
            country.capital || '-'
          }</p>
          <p class="country-card__languages"><span>Languages:</span> ${languages}</p>
        </div>
      </div>
    `;
    refs.myCountryInfo.innerHTML = markup;
    refs.myCountryList.innerHTML = '';
    return;
  }

  const markup = countries
    .map(country => {
      return `
        <li class="country-item">
          <img src="${country.flags.svg}" alt="${country.name} flag" class="country-item__flag">
          <p class="country-item__name">${country.name}</p>
        </li>
      `;
    })
    .join('');

  refs.myCountryList.innerHTML = markup;
  refs.myCountryInfo.innerHTML = '';
}

function clearMarkup() {
  refs.myCountryList.innerHTML = '';
  refs.myCountryInfo.innerHTML = '';
}
