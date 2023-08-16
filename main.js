import {fetchData, fetchXElements, GenerateModalHtml, createCarouselHtml} from "./functions.js";

const apiBaseUrl = "http://localhost:8000/api/v1/";
const topMoviesUrl = apiBaseUrl + "titles/?sort_by=-imdb_score";

async function displayBestMovies(carouselId, genre = "") {
    try {
        const queryUrl = `${apiBaseUrl}titles/?genre=${genre}&sort_by=-imdb_score`;
        const topMoviesData = await fetchXElements(queryUrl, 7);
        const bestMoviesDiv = document.getElementById(carouselId);
        bestMoviesDiv.innerHTML = createCarouselHtml(topMoviesData);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

async function generateWebpageContent() {
    try {
        const topMoviesData = await fetchData(topMoviesUrl);
        const topMovieId = topMoviesData.results[0].id;
        const topMovieUrl = apiBaseUrl + `titles/${topMovieId}`;
        const movieData = await fetchData(topMovieUrl);
        const topMovieDiv = document.querySelector(".top_movie");

        const html = `
                <h2 class="movie_title">${movieData.title}</h2>
                <img src="${movieData.image_url}" alt="${movieData.title} cover">
                <p>${movieData.description}</p>
                <button id="topMovieDetails">More info</button>
            `;

            topMovieDiv.dataset.id = movieData.id;
            topMovieDiv.innerHTML = html;

            const detailsBtn = document.getElementById("topMovieDetails");
            const modalDiv = document.querySelector(".modal");
            const closeBtn = document.querySelector(".modal__header__close");
            const blurDiv = document.querySelector(".blur");

            detailsBtn.addEventListener("click", () => {
                GenerateModalHtml(movieData);
                modalDiv.classList.remove("modal--hidden");
                blurDiv.classList.remove("blur--hidden");
            });

            closeBtn.addEventListener("click", () => {
                modalDiv.classList.add("modal--hidden");
                blurDiv.classList.add("blur--hidden");
            });
            await displayBestMovies("carousel0");
            await displayBestMovies("carousel1", "comedy");
            await displayBestMovies("carousel2", "drama");
            await displayBestMovies("carousel3", "action");

            const carouselMovies = document.querySelectorAll(".carousel__movie");
            carouselMovies.forEach((movie) => {
                movie.addEventListener("click", async () => {
                    let movieId = movie.dataset.id;
                    let movieUrl = apiBaseUrl + `titles/${movieId}`;
                    let movieDetails = await fetchData(movieUrl);
                    GenerateModalHtml(movieDetails);
                    modalDiv.classList.remove("modal--hidden");
                    blurDiv.classList.remove("blur--hidden");
                });
            });
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

generateWebpageContent();