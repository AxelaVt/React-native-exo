// API/TMDBApi.js

const API_TOKEN = "0527cb9f5cf61134f38eedb991e560d3";

export function getFilmsFromApiWithSearchedText (text, page) {
  const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_TOKEN + '&language=fr&query=' + text + '&page=' + page
  return fetch(url)
   .then((response) => response.json())
   .catch((error) => console.error(error))
}

export function getImageFromApi(name) {
  return 'https://image.tmdb.org/t/p/w300' + name  // chemin recupérer sur la doc de l'api
}
