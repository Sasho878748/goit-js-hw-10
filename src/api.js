function fetchCountries(searchQuery) {
  return fetch(`https://restcountries.com/v2/name/${searchQuery}`).then(
    response => {
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      return response.json();
    }
  );
}

export { fetchCountries };
