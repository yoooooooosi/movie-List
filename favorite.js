const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const movies = JSON.parse(localStorage.getItem("favoriteMovies")) || []; //收藏清單

const dataPanel = document.querySelector("#data-panel");

function renderMovieList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    // title, image, id
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${
          POSTER_URL + item.image
        }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${
            item.id
          }">More</button>
          <button class="btn btn-danger btn-remove-favorite" data-id="${
            item.id
          }">x</button>
        </div>
      </div>
    </div>
  </div>`;
  });

  dataPanel.innerHTML = rawHTML;
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = "Release date: " + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`;
  });
}

function removeFromFavorite(id) {
  // function isMovieMatched(movie) {
  //   return movie.id === id;
  // }

  if (!movies || !movies.length) return; //一旦傳入的 id 在收藏清單中不存在，或收藏清單是空的，就結束這個函式

  const movieIndex = movies.findIndex((movie) => movie.id === id); //利用findIndex()方法來找尋
  if (movieIndex === -1) return; //如果要找的值不存在findIndex method會回傳-1，因此如果沒有找到電影，就停止執行函式。

  movies.splice(movieIndex, 1);
  localStorage.setItem("favoriteMovies", JSON.stringify(movies));

  renderMovieList(movies);
}

//listen to data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

renderMovieList(movies);
