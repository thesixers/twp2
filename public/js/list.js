const popular = document.querySelector(".popular");
const tys = document.querySelectorAll('input[name="ty"]');
const type = document.querySelector(".type");
const filterTwo = document.querySelector(".filter-two");
const cards = document.querySelector(".cards");
const searchBar = document.querySelector(".search-bar");
const filterThree = document.querySelector(".filter-three");
const genrez = document.querySelector(".genrez");
const genreS = document.querySelectorAll('input[name="genre-s"]');
let genres = "all";
let query = getToonQuery();
let webToonz = [];
let Episodes = [];
let display = "toonz";
fetchToon();


window.addEventListener("load", (e) => {
  (display === "chapters")
    ? (filterThree.style.display = "none")
    : (filterThree.style.display = "block");
});

cards.addEventListener("click", (e) => {
  type.style.display = "none";
  popular.style.display = "none";
  genrez.style.display = "none";
});

function loadToonz() {
  // if(!cards) return;
  cards.innerHTML = "";
  if (display === "toonz") {
    if (genres === "all") {
      webToonz.forEach((toon, i) => {
        cards.innerHTML += `
                        <div class="webToon">
                                <div class="img-cover">
                                    <a href="/twp/webtoon/${toon._id}">
                                        <img src="${toon.coverImage}" alt="${toon.title}">
                                    </a>
                                </div>
                                <div class="webToonDetails">
                                    <div class="name">
                                        <a href="/twp/webtoon/${toon._id}">${toon.title}</a>
                                    </div> 
                                    <span class="genres">${toon.genre}</span>
                                </div>
                            </div>
                        `;
      });
      return;
    }

    webToonz
      .reverse()
      .filter((toon) => toon.genre.includes(genres))
      .forEach((toon, i) => {
        cards.innerHTML += `
                    <div class="webToon">
                                <div class="img-cover">
                                    <a href="/twp/webtoon/${toon._id}">
                                        <img src="${toon.coverImage}" alt="${toon.title}">
                                    </a>
                                </div>
                                <div class="webToonDetails">
                                    <div class="name">
                                        <a href="/twp/webtoon/${toon._id}">${toon.title}</a>
                                    </div> 
                                    <span class="genres">${toon.genre}</span>
                                </div>
                            </div>
                    `;
      });
  } else {
    Episodes.reverse().forEach((episode, i) => {
      cards.innerHTML += `
                    <div class="webToon">
                            <div class="img-cover">
                                <a href="/twp/webtoon/episode/${episode._id}">
                                    <img src="${episode.coverImage}" alt="${episode.title}">
                                </a>
                            </div>
                            <div class="webToonDetails">
                                <div class="name">
                                    <a href="/twp/webtoon/episode/${episode._id}">${episode.title}</a>
                                </div> 
                                <span class="genres">${episode.releaseDate}</span>
                            </div>
                        </div>
                    `;
    });
  }
}

filterThree.addEventListener("click", (e) => {
  genrez.classList.toggle("show-drop");
});

genreS.forEach((genre) => {
  genre.addEventListener("click", (e) => {
    genres = e.target.value;
    genrez.classList.remove("show-drop");
    loadToonz();
  });
});

tys.forEach((ty) => {
  ty.addEventListener("click", (e) => {
    display = e.target.value;
    type.classList.remove("show-drop");
    loadToonz();
  });
});

filterTwo.addEventListener("click", function () {
  type.classList.toggle("show-drop");
});

searchBar.addEventListener("keyup", search);

function search() {
  let value = searchBar.value;
  cards.innerHTML = "";
  if (display === "toonz") {
    let filteredToonz;

    if (genres === "all") {
      filteredToonz = webToonz.filter((toon, i) =>
        toon.title.toUpperCase().includes(value.toUpperCase())
      );
    } else {
      filteredToonz = webToonz.filter(
        (toon, i) =>
          toon.title.toUpperCase().includes(value.toUpperCase()) &&
          toon.genre === genres
      );
    }

    if (filteredToonz.length < 0) {
      return (cards.innerHTML = `<div class='search-error'> No webtoonz in this category try a different genre </div>`);
    }

    filteredToonz.forEach((toon, i) => {
      cards.innerHTML += `
                    <div class="card">
                        <a href="/twp/series/${toon._id}">
                            <div class="img"><img src="${toon.coverImage}" alt=""></div>
                            <div class="text">${toon.title}</div>
                        </a>
                    </div>
                    `;
    });
  } else {
    let filteredEpisodes = Episodes.filter((toon, i) =>
      toon.title.toUpperCase().includes(value.toUpperCase())
    );

    if (filteredEpisodes.length < 0)
      return (cards.innerHTML = `<div class='search-error'> No result found in this category </div>`);

    filteredEpisodes.forEach((toon, i) => {
      cards.innerHTML += `
                    <div class="card">
                        <a href="/twp/series/ep/${toon._id}">
                            <div class="img"><img src="${toon.coverImage}" alt=""></div>
                            <div class="text">${toon.title}</div>
                        </a>
                    </div>
                    `;
    });
  }
}

async function fetchToon() {
  try {
    cards.innerHTML = `            <div class="webtoon-preloader">
    <div class="spinner"></div>
    <p>Getting webtoons....</p>
    </div>`;
      let res = await fetch(`/twp/webtoon/fetchtoons?type=${query}`)
      if(!res.ok) throw new Error("Error Loading webtoons")
      let { toonz, episodes, display } = await res.json()
      webToonz = toonz
      Episodes = episodes

      loadToonz()
  } catch (error) {
      console.error(error)
      cards.innerHTML = `<div class="webtoon-preloader">
            <p>Error occured please <span onclick="fetchToon()">Reload</span></p>
            </div>`
  }
}


function getToonQuery() {
    if (document.URL.includes("type")) {
      return document.URL.split("=")[1];
    } else {
      return "all";
    }
  };