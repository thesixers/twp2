let attributes = document.querySelectorAll('.attributes');
let episodesWrapper = document.querySelector('.episodes-wrapper');
let infoWrapper = document.querySelector('.info-wrapper');
const episodeFormWrapper = document.querySelector('.episode-form-wrapper');
const epForm = document.getElementById('episode-form');
let userSubBtn = document.querySelector('.user-sub-btn');
const values = userSubBtn.innerHTML;
const popMessage = document.querySelector('.pop-message');
const messageHead = document.querySelector('.meassage-head');
const messageTick = document.querySelector('.tick');
const messageMessage = document.querySelector('.p-message');
const messageBox = document.querySelector('.message-box');
const commentSection = document.querySelector('.comment-section');
let isSubcribed = false;
let errorIcon = '&times;';
let errorColor = 'red';
const icon = document.getElementById('icon');
let commentBtn = document.getElementById('post-comment');
let sub = document.querySelector('.sub');
let askToRegisterContainer = document.querySelector('.asktoregister-container')
let askToRegisterClose = document.querySelector('.asktoregister-close')
let epDeleteId = ''

window.addEventListener('load', function() {
    checkSubcribtion();
    displayComments(comments);
    episodeTab(checkTheme)
})

function closeAskToRegister(){
    askToRegisterContainer.style.display = 'none'
}

function showAskToRegister(){
    askToRegisterContainer.style.display = 'flex'
}


function checkSubcribtion(){
    if(subs){
        subs.forEach((val, index) => {
            if(val === series) isSubcribed = true;  
        });
    
        if(isSubcribed){
            userSubBtn.innerHTML = 'Subscribed &check;'  
            userSubBtn.style.backgroundColor = '#ffff';
            userSubBtn.style.color = '#000';
        }else{
            userSubBtn.innerHTML = 'Subscribe &plus;'
            userSubBtn.style.backgroundColor = '#e44616';
            userSubBtn.style.color = '#ffff';
        } 
    }
}

async function subcribe(id) {
    try {
        let res = await fetch(`/twp/webtoon/sub/${id}`, { method: 'PUT' });
        if(res.status === 404) location.reload()
        let data = await res.json();
        let {M, subs} = data;
        if(M === 'subscribed'){
            userSubBtn.innerHTML = 'Subscribed &check;'
            userSubBtn.style.backgroundColor = '#ffff';
            userSubBtn.style.color = '#000';
            isSubcribed = true;
        }else{
            userSubBtn.innerHTML = 'Subscribe &plus;'
            userSubBtn.style.backgroundColor = '#e44616';
            userSubBtn.style.color = '#ffff';
            isSubcribed = false;
        }
        sub.innerHTML = `<span>Subscribers:</span> ${subs}`
    } catch (err) {
        console.log(err)
    }
}


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
            return;
        };

        if(M){
            isuploaded = true;
                displaySuccess(M);
        }
        
    }
    catch(err){
        console.log(err);
        displayError(err.message)
    }
    finally{
        location.reload()
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

attributes[1].addEventListener('click', detailTab);
attributes[0].addEventListener('click', episodeTab);
attributes[2].addEventListener('click', commentTab);
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

darkModeMediaQuery.addEventListener('change', () => {
    attributes.forEach((e, i) => {
        if(e.style.color === 'rgb(228, 70, 22)'){
            e.style.color = 'rgb(228, 70, 22)'
        }else{
            e.style.color = checkTheme()
        }
    })
})

function detailTab(){
    episodesWrapper.style.display = 'none';
    infoWrapper.style.display = 'block';
    commentSection.style.display = 'none';
    const color = checkTheme()

    attributes[0].style.color = color;
    attributes[1].style.color = '#e44616';
    attributes[2].style.color = color;  
}

attributes[0].style.color = '#e44616';

function episodeTab(){
    episodesWrapper.style.display = 'block';
    infoWrapper.style.display = 'none';
    commentSection.style.display = 'none';
    const color = checkTheme()

    attributes[0].style.color = '#e44616';
    attributes[1].style.color = color;
    attributes[2].style.color = color;
}

function commentTab(){
    episodesWrapper.style.display = 'none';
    infoWrapper.style.display = 'none';
    commentSection.style.display = 'block';
    const color = checkTheme()

    attributes[0].style.color = color;
    attributes[1].style.color = color;
    attributes[2].style.color = '#e44616';
}

function checkTheme(){
    // if(window.matchMedia && darkModeMediaQuery.matches) return '#fff';
    return '#000'
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

function closeForm(){
    episodeFormWrapper.style.display = 'none';
}

function showEpisodeForm(){
    episodeFormWrapper.style.display = 'block';
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
    popMessage.style.display = 'none';
}

async function deleteEp(){
    if(!epDeleteId) return;
    try {
        let res = await fetch(`/twp/webtoon/episode/${epDeleteId}`, { method: 'DELETE'});
        let message = await res.text();
        if(!res.ok) throw new Error(message);
        location.reload();
    } catch (err) {
        displayError(err);
    }
}

async function deleteSeries(id){
    try {
        let res = await fetch(`/twp/webtoon/${id}`, { method: 'DELETE' });
        let message = await res.text();
        if(!res.ok) throw new Error(message)
        isAdmin ? location.assign('/twp/admin') : location.assign('/twp/author');
    } catch (err) {
        displayError(err);
    }
}

var epModal = document.querySelector('.modal-ep');
var seriesModal = document.querySelector('.modal-series');

function openEpModal(id) {
    epDeleteId = id;
    epModal.style.display = "block";
}

function closeEpModal() {
    epDeleteId = '';
    epModal.style.display = "none";
}

function openSeriesModal(id) {
    seriesModal.style.display = "block";
}

function closeSeriesModal() {
    seriesModal.style.display = "none";
}

function displayComments(comments){
    const commentList = document.getElementById('comments-list');
    commentList.innerHTML = '';
    if(comments.length <= 0){
        commentList.innerHTML = 'No comments Yet';
        commentList.style.color = 'grey';
        return;
    }

    commentList.style.color = '#000';
    comments.forEach((comment, index) => {
        commentList.innerHTML += `<div class="comment ${comment.userId === userId ? 'user-comment': ''}">
        <div class="user ${comment.userId === userId ? 'user-comment': ''}">${comment.username || 'Anonymous'}</div>
        <div class="content">${comment.comment}</div>
        ${comment.userId === userId && comment.userId !== '1' || isAdmin ? `<span class="material-symbols-outlined delete-icon" onclick="deleteComment('${comment._id}')">
            delete
        </span>`: ''}
        
    </div>`
    });
}


commentBtn.addEventListener('click', () => {
    icon.classList.add('fly');
    commentBtn.style.scale = '0.5';

    comment();
});


async function comment(){
    let comment = document.getElementById('new-comment').value;
    
    try {
        if(!seriesId){
            commentBtn.style.scale = '1';
            icon.classList.remove('fly');
            throw new Error('An error occured try refreshing the page and try again');
        } 
        if(!comment){
            commentBtn.style.scale = '1';
            icon.classList.remove('fly');
            throw new Error("You cant upload an empty comment")
        }

        let res = await fetch('/twp/webtoon/comment', {
            method: 'POST', 
            body: JSON.stringify({comment, userId, username, seriesId}),
            headers: {'Content-Type' : 'application/json'}
        });

        if(res.status === 404) location.reload();

        let data = await res.json();
        let {E, M, commentz} = data;
        if(E) throw new Error(E);

        comments = commentz;
        displayComments(commentz);
    } catch (err) {
        displayError(err.message)  
    }
    finally{
        commentBtn.style.scale = '1';
        icon.classList.remove('fly'); 
        document.getElementById('new-comment').value = '';
    }

}

async function deleteComment(commentId){   
    try {
        if(!seriesId){
            throw new Error('An error occured try refreshing the page and try again');
        } 
        if(!commentId){
            throw new Error("You cant upload an empty comment")
        }
        let res = await fetch(`/twp/webtoon/comment/${commentId}?seriesId=${seriesId}`, { method: 'DELETE' });
        if(!res.ok) location.reload();
        let data = await res.json();
        let {E, M, commentz} = data;
        if(E) throw new Error(E);

        comments = commentz;
        displayComments(commentz);
    } catch (err) {
        displayError(err.message)  
    }

}