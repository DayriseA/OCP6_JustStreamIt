/** Function to GET data from the API
 * Takes the url as a parameter
 * Returns the data as a JSON object
 */
export async function fetchData(url) {
  const response = await fetch(url);
  try {
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error) {
    console.log("error: ", error);
  }
}

// Using the fetchData function to get a desired number of elements from the API
export async function fetchXElements(url, x) {
  let elements = [];
  let fetched = 0;
  let currentUrl = url;
  let totalQueryCount = Infinity; // We don't know how many results there are in total.
  while (fetched < x && fetched < totalQueryCount && currentUrl) {
    try {
      const data = await fetchData(currentUrl);
      totalQueryCount = data.count;
      let toAdd = Math.min(x - fetched, data.results.length); // We don't want to add more elements than we need.
      elements.push(...data.results.slice(0, toAdd));
      fetched += toAdd;
      currentUrl = data.next;
    } catch (error) {
      console.log("error: ", error);
    }
  }
  return elements;
}

export function createCarouselHtml(moviesList) {
  return moviesList.map((movie, index) => `
      <div class="carousel__movie" data-id="${movie.id}" data-index="${index}">
          <img src="${movie.image_url}" alt="${movie.title} cover">
      </div>
  `).join('');
}

export function GenerateModalHtml(movieData) {
    const genres = movieData.genres.join(", ");
    const directors = movieData.directors.join(", ");
    const actors = movieData.actors.join(", ");
    const countries = movieData.countries.join(", ");
    const modalTitle = document.querySelector(".modal__header__title");
    const modalContentDiv = document.querySelector(".modal__content");

    modalTitle.textContent = movieData.title;

    const modalHtml = `
        <section class="modal__content__main">
          <img src="${movieData.image_url}" alt="${movieData.title} cover">
          <p>${movieData.long_description}</p>
        </section>
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
        </ul>
    `;
    modalContentDiv.innerHTML = modalHtml;
}