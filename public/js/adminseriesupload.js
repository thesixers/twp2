const seriesForm = document.getElementById('upload-form');
const img = document.querySelector('.cover-onchange');
// const coverImageInput = document.getElementById('coverImage'); 
const popMessage = document.querySelector('.pop-message');
const messageHead = document.querySelector('.meassage-head');
const messageTick = document.querySelector('.tick');
const messageMessage = document.querySelector('.p-message');
const messageBox = document.querySelector('.message-box');
let isError = false;
let errorColor = 'red';
let errorIcon = '&times;';
let seriesID = '';

displayDisclaimer(disclaimer)


seriesForm.addEventListener('submit', async function(e){
    displayProgress();
    e.preventDefault();
    const Data = new FormData(this);
    

    try {
        let res = await fetch('/twp/webtoon', {
            method: 'POST',
            body: Data
        });

        let data = await res.json();

        let {E,M,toonzId} = data;

        if(E){
            displayError(E)
        };

       if(M){
        seriesID = toonzId;
        isError = false
            displaySuccess(M);
       }

        console.log(data);
    } catch (err) {
        alert(err)
    }
});


function changeImg() {
    const coverImageInput = document.getElementById('coverImage');
    const file = coverImageInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function() {
                const width = img.width;
                const height = img.height;

                // Check if the image width is at least 720 pixels and height is reasonable (e.g., 480 pixels)
                if (width < 720 || height < 480) {
                    alert('Image dimensions must be at least 720 pixels in width and 480 pixels in height.');
                    coverImageInput.value = ''; // Clear the file input
                } else {
                    // Display the valid image in the img tag
                    const displayImg = document.querySelector('.cover-onchange');
                    displayImg.src = e.target.result;
                }
            };
        }; 

        reader.readAsDataURL(file);
    }
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
    messageMessage.innerHTML = M;
    messageTick.innerHTML = '!!!!';
    messageBox.style.height = '300px'
    popMessage.style.display = 'block';
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
    messageTick.innerHTML = `<img src="/images/Animation - 1739751852441.gif" alt="">`;
    messageTick.style.border = 'none'
    messageBox.style.height = '300px'
    popMessage.style.display = 'block';
}

const closeMessage = () => {
    if(seriesID === ''){
        popMessage.style.display = 'none';
    }else{
        sessionStorage.setItem('twpauthor', seriesID);
        location.assign(`/twp/webtoon/episode/upload`);
    }
}