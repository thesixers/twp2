const idInput = document.querySelector('input[name="seriesid"]')
        const epForm = document.getElementById('episode-form');
        const popMessage = document.querySelector('.pop-message');
        const messageHead = document.querySelector('.meassage-head');
        const messageTick = document.querySelector('.tick');
        const messageMessage = document.querySelector('.p-message');
        const messageBox = document.querySelector('.message-box');
        let isuploaded = false;
        let errorColor = 'red';
        let errorIcon = '&times;';
        let disclaimer = 'Please Upload clear images so You will be able to attract more readers';
        let id = sessionStorage.getItem('twpauthor');


        displayDisclaimer();

        window.addEventListener('load', (e)=>{
            if(!id) location.assign('/twp');
            idInput.value = id
        });


        epForm.addEventListener('submit', async function(e){
            e.preventDefault();
            displayProgress();
            let textInputs = document.querySelectorAll('input[type="text"]');
            let fileInputs = document.querySelectorAll('input[type="file"]');
            const Data = new FormData();
            let isValid = true;

            textInputs.forEach(input => {
                Data.append(input.name, input.value);
            });

            if(fileInputs.length < 3) {
                displayError('Each Episode must have atleast 2 pages')
                return
            }

            fileInputs.forEach(input => {
                if(input.files.length === 0){
                    isValid = false
                    let errMessage = input.name.includes('epcover') 
                    ? 
                    'A cover Image is required for every episode' 
                    :
                    'Please add atleast one page for The users';
                    displayError(errMessage)
                    return
                }
                Data.append(input.name, input.files[0])
            });

            if(!isValid) return;

            try{
                let res = await fetch('/twp/webtoon/episode', {
                    method: 'POST',
                    body: Data
                });

                const data = await res.json();

                let {E,M} = data;

                if(E){
                    displayError(E)
                };

                if(M){
                    isuploaded = true;
                        displaySuccess(M);
                }
                
            }
            catch(err){
                console.error(err);
            }
        });


        function addNewPage(){
            let pageImgs = document.querySelector('.page-imgs');
            let pageIndex = document.querySelectorAll('.page-img').length + 1;

            let newPage = `<label for='page${pageIndex}' class="imgs page-img" onchange="updateImg('page${pageIndex}')">
                <input type="file" id='page${pageIndex}' name="page${pageIndex}" class="page${pageIndex}" accept="image/*" required>
                <img src="" class="page${pageIndex}-img" alt="">
                <div class="page-overlay">
                    <div>+</div>
                    <p>Page ${pageIndex}</p>
                </div>
            </label>`;

            pageImgs.insertAdjacentHTML('beforeend', newPage); 
        } 
        
        function removeNewPage(){
            let pageImgs = document.querySelector('.page-imgs');
            let pageImg = document.querySelectorAll('.page-img');

            if(pageImg.length > 0){
                let lastTag = pageImg[pageImg.length - 1];
                lastTag.parentNode.removeChild(lastTag);
            }
        }

        function detailTab(){
            episodesWrapper.style.display = 'none';
            infoWrapper.style.display = 'block';
            tabColor();
        }

        function coverImgShow(){
            let epCoverImg = document.querySelector('.ep-cover-img');
            let epCoverInput = document.querySelector('.ep-cover');
            showImage(epCoverInput,epCoverImg);
        }

        function showImage(input,imgTag){
            let src = URL.createObjectURL(input.files[0])
            imgTag.src = src;
        }


        function updateImg(No){
            let imgTag = document.querySelector(`.${No}-img`)
            let input = document.querySelector(`.${No}`);
            showImage(input,imgTag); 
        }

        function displaySuccess(M){
            popMessage.style.display = 'block';
            messageMessage.innerHTML = M;
            messageTick.innerHTML = '&check;';
            messageHead.innerHTML = 'Success!!';
        }

        function displayProgress(){
            messageHead.innerHTML = 'Uploading';
            messageMessage.innerHTML = 'please wait';
            messageTick.innerHTML = '<img src="/images/Animation - 1739751852441.gif" alt="">';
            messageBox.style.height = '300px'
            popMessage.style.display = 'block';
        }

        function displayError(err){
            messageHead.innerHTML = 'Error!!';
            messageMessage.innerHTML = err;
            messageTick.innerHTML = errorIcon;
            messageTick.style.color = errorColor;
            isError = true;
            popMessage.style.display = 'block';
        }

        function displayDisclaimer(M){
            messageHead.innerHTML = 'Disclaimer!!';
            messageMessage.innerHTML = disclaimer;
            messageTick.innerHTML = '!!!!';
            messageBox.style.height = '300px'
            popMessage.style.display = 'block';
        }

        const closeMessage = () => {
            if(isuploaded) {
                location.assign(`/twp`)  
            }else{ 
                popMessage.style.display = 'none';
             }
        }