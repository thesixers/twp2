// const radios = document.querySelectorAll('input[name="radioName"]');
        const popular = document.querySelector('.popular');
        const tys = document.querySelectorAll('input[name="ty"]');
        const type = document.querySelector('.type');
        const filterTwo = document.querySelector('.filter-two');
        const cards = document.querySelector('.cards');
        const searchBar = document.querySelector('.search-bar');
        const filterThree = document.querySelector('.filter-three');
        const genrez = document.querySelector('.genrez');
        const genreS = document.querySelectorAll('input[name="genre-s"]')
        let genres = 'all'

        window.addEventListener('load', (e) =>  { 
            (display === 'chapters') ? filterThree.style.display = 'none' : filterThree.style.display = 'block';
            loadToonz() 
        });

        cards.addEventListener('click', (e)=>{
            type.style.display = 'none';
            popular.style.display = 'none';
            genrez.style.display = 'none';
        })

        function loadToonz(seriesFilter= ''){
            cards.innerHTML = '';
            if(display === 'toonz'){
                webToonz.filter(toon => {if(toon.genre.includes(seriesFilter)) return true}).forEach((toon, i) => {
                    cards.innerHTML += `
                    <div class="card">
                        <a href="/twp/webtoonz/${toon._id}">
                            <div class="img"><img src="${toon.coverImage}" alt=""></div>
                            <div class="text">${toon.title}</div>
                        </a>
                    </div>
                    `
                });
            }else{
                Episodes.forEach((toon, i) => {
                    cards.innerHTML += `
                    <div class="card">
                        <a href="/twp/webtoonz/ep/${toon._id}">
                            <div class="img"><img src="${toon.coverImage}" alt=""></div>
                            <div class="text">${toon.title}</div>
                        </a>
                    </div>
                    `
                });
            }
        }
        
        filterThree.addEventListener('click', (e) => {
            genrez.classList.toggle('show-drop')
        });

        genreS.forEach(genre => {
            genre.addEventListener('click', (e) => {
                console.log(e.target.value);
                let value = e.target.value;
                genrez.classList.remove('show-drop')
            })
        }); 

        tys.forEach(ty => {
            ty.addEventListener('click', (e) =>{
                let value  = e.target.value;
                type.classList.remove('show-drop')
            })
        });

        filterTwo.addEventListener('click', function(){
            type.classList.toggle('show-drop')
        });

        searchBar.addEventListener('keyup', search);

        function search(){
            let value = searchBar.value;
            cards.innerHTML = '';
            if(display === 'toonz'){
                let filteredToonz;

                if(genres === 'all'){
                    filteredToonz = webToonz.filter((toon,i) => toon.title.toUpperCase().includes(value.toUpperCase()));
                } else{
                    filteredToonz = webToonz.filter((toon,i) => toon.title.toUpperCase().includes(value.toUpperCase()) && toon.genre === genres);
                }

                if(filteredToonz.length < 0){
                    return cards.innerHTML = `<div class='search-error'> No webtoonz in this category try a different genre </div>`;
                }

                filteredToonz.forEach((toon, i) => {
                    cards.innerHTML += `
                    <div class="card">
                        <a href="/twp/series/${toon._id}">
                            <div class="img"><img src="${toon.coverImage}" alt=""></div>
                            <div class="text">${toon.title}</div>
                        </a>
                    </div>
                    `
                });
                
            }else{
                let filteredEpisodes = Episodes.filter((toon,i) => toon.title.toUpperCase().includes(value.toUpperCase()));

                if(filteredEpisodes.length < 0) return cards.innerHTML = `<div class='search-error'> No result found in this category </div>`;

                filteredEpisodes.forEach((toon, i) => {
                    cards.innerHTML += `
                    <div class="card">
                        <a href="/twp/series/ep/${toon._id}">
                            <div class="img"><img src="${toon.coverImage}" alt=""></div>
                            <div class="text">${toon.title}</div>
                        </a>
                    </div>
                    `
                });
            }
           
        }

        function show(type){
            if(type === 'series'){
                display = 'toonz';
                filterThree.style.display = 'block'
            }else{
                display = 'chapters';
                filterThree.style.display = 'none';
            }
            loadToonz();
        }

        function genre(genre) {
            genres = genre
            if(genre === 'all') return loadToonz();
            loadToonz(genre)
        }

   