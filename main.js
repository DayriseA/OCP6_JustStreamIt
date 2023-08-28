import {fetchData, fetchXElements, GenerateModalHtml, createCarouselHtml} from "./functions.js";

const apiBaseUrl = "http://localhost:8000/api/v1/";
const topMoviesUrl = apiBaseUrl + "titles/?sort_by=-imdb_score";

async function displayBestMovies(carouselId, genre = "") {
    try {
        const queryUrl = `${apiBaseUrl}titles/?genre=${genre}&sort_by=-imdb_score`;
        const topMoviesData = await fetchXElements(queryUrl, 7);
        const carouselDiv = document.getElementById(carouselId);
        const h2Category = document.createElement("h2");
        const prevButton = carouselDiv.querySelector(".carousel__prev");
        const nextButton = carouselDiv.querySelector(".carousel__next");
        const carouselContent = carouselDiv.querySelector(".carousel__content");
        carouselContent.innerHTML = createCarouselHtml(topMoviesData);

        h2Category.classList.add("category");
        h2Category.innerText = (genre || "BEST RATED").toUpperCase();
        carouselDiv.parentNode.insertBefore(h2Category, carouselDiv);

        nextButton.addEventListener("click", () => {
            const firstMovie = carouselContent.querySelector(".carousel__movie");
            carouselContent.appendChild(firstMovie.cloneNode(true));
            firstMovie.remove();
        });

        prevButton.addEventListener("click", () => {
            const lastMovie = carouselContent.querySelector(".carousel__movie:last-child");
            carouselContent.insertBefore(lastMovie.cloneNode(true), carouselContent.firstChild);
            lastMovie.remove();
        });        
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
                <div class="top_movie__content">
                    <h2 class="movie_title">${movieData.title}</h2>
                    <p>${movieData.description}</p>
                    <button id="topMovieDetails">More info</button>
                </div>
                <img src="${movieData.image_url}" alt="${movieData.title} cover">
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