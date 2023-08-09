// Function to GET data from the API
export async function fetchData(url) {
  const response = await fetch(url);
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
}

export function generateTop7Html(moviesList) {
  return moviesList.map(movie => `
      <div class="best_movie" data-id="${movie.id}">
          <h3>${movie.title}</h3>
          <img src="${movie.image_url}" alt="${movie.title} cover">
      </div>
  `).join('');
}

export function makeModalContent(movieData) {
    const genres = movieData.genres.join(", ");
    const directors = movieData.directors.join(", ");
    const actors = movieData.actors.join(", ");
    const countries = movieData.countries.join(", ");

    const modalHtml = `
        <ul>
            <li>Genres: ${genres}</li>
            <li>Date Published: ${movieData.date_published}</li>
            <li>Rated: ${movieData.rated}</li>
            <li>IMDB Score: ${movieData.imdb_score}</li>
            <li>Directors: ${directors}</li>
            <li>Actors: ${actors}.</li>
            <li>Duration: ${movieData.duration} minutes</li>
            <li>Countries: ${countries}</li>
            <li>Worldwide Gross Income: ${movieData.worldwide_gross_income}</li>
            <li>Long Description: ${movieData.long_description}</li>
        </ul>
    `;
    return modalHtml;
}