let readMode = 'vertical';
        let selection = document.querySelector('#readmode'); 
        let count = 0;
        let epPic = document.querySelector('.epPic');
        const pgNo = document.querySelector('.page-no');
        const horizontal = document.querySelector('.horizontal');
        const vertical = document.querySelector('.vertical');
        loadEp()

        function loadEp(){
            epPic.src = comic[count];
            updatePageNo();
        }

        function next(){
            if(count < comic.length -1){
                count += 1;
                loadEp();
                epPic.classList.add('epPic-R')

                epPic.addEventListener("animationend", () =>{
                    epPic.classList.remove('epPic-R');
                }, {once: true});
            }
        }

        function prev(){
            if(count > 0){
                count -= 1;
                loadEp();
                epPic.classList.add('epPic-RR')

                epPic.addEventListener("animationend", () =>{
                    epPic.classList.remove('epPic-RR');
                }, {once: true});  
            }
        }

        function updatePageNo(){
            pgNo.innerHTML = `Page ${count + 1}`
        }
        
        function selectMode(){
            if(selection.value === 'vertical'){
                vertical.style.display = 'block'
                horizontal.style.display = 'none';
            }else if (selection.value = 'horizontal'){
                vertical.style.display = 'none'
                horizontal.style.display = 'block';
            }
        }