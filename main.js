import {fetchData, makeModalContent, generateTop7Html} from "./functions.js";

const apiBaseUrl = "http://localhost:8000/api/v1/";

async function insertTopMovieDetails() {
    try {
        const queryUrl = apiBaseUrl + "titles/?sort_by=-imdb_score";
        const moviesData = await fetchData(queryUrl);

        if (moviesData.results && moviesData.results.length > 0) {
            const topMovieId = moviesData.results[0].id;
            const movieUrl = apiBaseUrl + `titles/${topMovieId}`;
            const movieData = await fetchData(movieUrl);
            const topMovieDiv = document.querySelector(".top_movie");

            const html = `
                <h2>${movieData.title}</h2>
                <img src="${movieData.image_url}" alt="${movieData.title} cover">
                <p>${movieData.description}</p>
                <button id="topMovieDetails">More info</button>
            `;

            topMovieDiv.innerHTML = html;

            const detailsBtn = document.getElementById("topMovieDetails");
            const modal = document.getElementById("modal_top");
            const modalData = document.querySelector(".modal_data");
            const closeBtn = document.querySelector('.close');

            detailsBtn.addEventListener("click", () => {
                modal.style.display = "block";
                modalData.innerHTML = makeModalContent(movieData);
                closeBtn.style.display = "block";
            });

            closeBtn.addEventListener("click", () => {
                modal.style.display = "none";
            });

        } else {
            console.log("No movies found.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

async function displayBestMovies() {
    try {
        const queryUrl = apiBaseUrl + "titles/?sort_by=-imdb_score";
        const moviesData = await fetchData(queryUrl);

        if (moviesData.results && moviesData.results.length > 0) {
            const top7Movies = moviesData.results.slice(0, 7);
            const bestMoviesDiv = document.querySelector(".best_movies");
            bestMoviesDiv.innerHTML = generateTop7Html(top7Movies);
        } else {
            console.log("No movies found.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

insertTopMovieDetails();
displayBestMovies();