const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const MOVIES_PER_PAGE = 12;
const movies = [];
//使用const使內容保持不變，但代表不能以賦值的方式，將值加入陣列內
let filteredMovies = []; //設定一個空白的陣列，將符合之電影放入其中
let currentPage = 1;

const dataPanel = document.querySelector("#data-panel");
//現在思考的點是如何將值放入movie這個陣列裡
const searchForm = document.querySelector("#search-form");
//在Search按鈕那裏設置一個元素
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const changemode = document.querySelector("#change-mode");

//宣告一個陳列電影的list
function renderMovieList(data) {
  //現在有兩種頁面呈現方式，如何區分?
  //有無點及到該按鈕
  if (dataPanel.dataset.mode === `card-mode`) {
    let rawHTML = ``; //用來解析DATA產生的HTML
    //過程
    //利用forEach將陣列中的值呈現出來
    data.forEach((item) => {
      //然而我們現在需要的是title、image
      // console.log(item);
      rawHTML += `
        <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top"
                alt="Movie Poster"
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id=${item.id}
                >
                  More
                </button>
                <button 
                  class="btn btn-info btn-add-favorite" 
                  data-id=${item.id}
                  >+
                  </button>
              </div>
            </div>
          </div>
        </div>`;
      //dataset(只要有data開頭都是dataset)
    });

    //最後放入dataPanel內
    dataPanel.innerHTML = rawHTML;
  } else if (dataPanel.dataset.mode === `list-mode`) {
    let rawHTML = `<ul class="list-group">`;

    data.forEach((item) => {
      rawHTML += `
      <li class="list-group-item d-flex justify-content-between" aria-current="true">
        <h5 class="card-title">${item.title}</h5>
        <div>
          <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id=${item.id}
                >
                  More
          </button>
          <button 
                  class="btn btn-info btn-add-favorite" 
                  data-id=${item.id}
                  >+
          </button>
        </div>
      </li>`;
    });

    rawHTML += `</ul>`;

    dataPanel.innerHTML = rawHTML;
  }
}

function rederPaginator(amount) {
  // 80 / 12 = 6...7 = 7
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML = ``;

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }

  paginator.innerHTML = rawHTML;
}

//當輸入一個page便會回傳此page的電影
//用page來區別不同電影，eg電影0-11是page 1
function getMoviesByPage(page) {
  //page 1 -> mavies 0 - 11
  //page 2 -> mavies 12 - 23
  //page 3 -> mavies 24 - 35

  //movies有兩種意思，分別為陳列所有的電影以及被搜尋的電影
  //應該要區分被搜尋的電影

  const data = filteredMovies.length ? filteredMovies : movies;
  //如果filteredMovies是有東西就給filteredMovies，如果是空的則給movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE;

  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE); //回傳切割好的陣列
}

//宣告一個函式，並傳入一個id(找尋特定電影)
//第二個api(裡面放置詳細資訊)
function showMovieModal(id) {
  //開始修改HTML內中的東西
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");
  // console.log(INDEX_URL + id);

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;

    modalTitle.innerText = data.title;
    modalDate.innerText = data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`;
  });
}

//
function addToFavorite(id) {
  // function isMovieMatched(movie) {
  //   return movie.id === id;
  // }

  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || []; //回傳其中是true，如果都是true便先回傳右邊的
  const movie = movies.find((movie) => movie.id === id);

  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已在收藏清單中!");
  }

  list.push(movie);
  console.log(list);

  localStorage.setItem("favoriteMovies", JSON.stringify(list));
  //示範
  // const jsonString = JSON.stringify(list); //利用JSON.stringify()先將list j.s字串(string)轉為json字串
  // console.log("json string :", jsonString);
  // console.log("json object :", JSON.parse(jsonString)); //再利用JSON.parse()將json字串轉為j.s字串
}

//切換模式
function changeMode(displayway) {
  // if (dataPanel.dataset.mode === displayway) {
  // console.log(displayway);
  return (dataPanel.dataset.mode = displayway);
  // }
}

//使用非匿名函式，便可以找出問題函式在哪?
//綁定事件
dataPanel.addEventListener("click", function onPanelClicked(event) {
  //先確認所點點到的button是否為more按鈕，當class名為btn-show-movie時
  if (event.target.matches(".btn-show-movie")) {
    //綁定:當點到特定電影的more按鈕上，便會將此電影的id回傳至showMovieModal的function
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return; //點及不是<a></a>

  const page = Number(event.target.dataset.page);
  currentPage = page;
  renderMovieList(getMoviesByPage(page));
});

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault(); //必須加在最前面，防止頁面做出預設動作
  //因為瀏覽器對於特定的功能會有預設的行為
  const keyword = searchInput.value.trim().toLowerCase(); //輸入框所輸入的文字
  //利用trim()將輸入文字的前後去除空白格
  //利用toLowerCase()將所輸入文字全部轉換成小寫

  //提醒輸入有效字串
  // if (!keyword.length) {
  //   return alert("請輸入有效字串");
  // }

  //篩選電影

  //方法一、利用迴圈將所有電影掃描
  // for (const movie of movie) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie);
  //   }
  // }

  //方法二、利用條件迭代filter
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  //錯誤處理
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`);
  }

  //將畫面重新渲染
  currentPage = 1;
  rederPaginator(filteredMovies.length);
  renderMovieList(getMoviesByPage(currentPage));
});

//監聽換頁顯示
changemode.addEventListener("click", function onChangeModeClicked(event) {
  //如果點及到該按鈕，畫面會呈現全部電影的列表模式，因此需要重新渲染頁面

  if (event.target.matches(".fa-th")) {
    changeMode(`card-mode`);
    renderMovieList(getMoviesByPage(currentPage));
    // console.log("card");
  } else if (event.target.matches(".fa-bars")) {
    changeMode(`list-mode`);
    renderMovieList(getMoviesByPage(currentPage));
    // console.log("list");
  }
});

axios
  .get(INDEX_URL)
  .then((response) => {
    //01、使用迭代器for of
    // for (const movie of response.data.results) {
    //   movie.push(movie);
    // }

    // 02、使用...(展開運算子),同樣能達成一樣的效果，且更加彈性
    movies.push(...response.data.results);

    console.log(...response.data.results);
    //回傳值有80個陣列，因此利用展開運算子將各陣列值放入movie的陣列中
    // console.log(movies);
    rederPaginator(movies.length);
    renderMovieList(getMoviesByPage(currentPage)); //呼叫函式
  })
  .catch((err) => console.log(err));

// localStorage的缺點是只能放string，不能放其他陣列等等，解決方式是用json方式，JSON.stringify()轉成字串
// localStorage.setItem("design_number", "4");

// console.log(localStorage.getItem("design_number"));

// localStorage.removeItem("design_number");

// console.log(localStorage.getItem("design_number"));

// console.log(localStorage.getItem("design_number"));
