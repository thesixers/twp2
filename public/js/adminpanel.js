let isMounted = localStorage.getItem('isMounted');
if(!isMounted || isMounted === '') isMounted = 'dasboard';
const dbSub = document.querySelector('.db-sub');
const uSub = document.querySelector('.u-sub');
const wtSub = document.querySelector('.wt-sub');
const msSub = document.querySelector('.ms-sub');
const dashboardWrapper = document.querySelector('.dashboard-wrapper');
const webtoonzWrapper = document.querySelector('.webtoonz-wrapper');
const usersWrapper = document.querySelector('.users-wrapper');
const adminMessages = document.querySelector('.admin-messages');
const orange = '#e44616';
const grey = '#abb8c3';


window.addEventListener('load', checkMount)

const changeMount = (m)=>{
    isMounted = m;
    localStorage.setItem('isMounted', isMounted)
    checkMount()
}

function checkMount(){
    switch (isMounted) {
        case 'dashboard':
            dashboard()
            break;
        case 'webtoon':
            webtoonz()
            break;
        case 'users':
            user()     
            break;
        case 'message':
            message()     
            break;    
        default:
            break;
    }
}

function dashboard(){
    dbSub.style.color = '#e44616'
    wtSub.style.color = '#abb8c3'
    uSub.style.color = '#abb8c3'
    msSub.style.color = '#abb8c3'
    dashboardWrapper.style.display = 'grid'
    webtoonzWrapper.style.display = 'none';
    usersWrapper.style.display = 'none';
    adminMessages.style.display = 'none';
}

function webtoonz(){
    wtSub.style.color = '#e44616'
    uSub.style.color = '#abb8c3'
    dbSub.style.color = '#abb8c3'
    msSub.style.color = '#abb8c3'
    dashboardWrapper.style.display = 'none'
    webtoonzWrapper.style.display = 'block';
    usersWrapper.style.display = 'none';
    adminMessages.style.display = 'none';
    changeWebSubMenu('all')
}

function user(){
    uSub.style.color = '#e44616';
    dbSub.style.color = '#abb8c3';
    wtSub.style.color = '#abb8c3';
    msSub.style.color = '#abb8c3'
    dashboardWrapper.style.display = 'none';
    webtoonzWrapper.style.display = 'none';
    usersWrapper.style.display = 'block'; 
    adminMessages.style.display = 'none';
    toggleBtwUsersSubs('all')
} 

function message(){
    uSub.style.color = '#abb8c3';
    dbSub.style.color = '#abb8c3';
    wtSub.style.color = '#abb8c3';
    msSub.style.color = '#e44616'
    dashboardWrapper.style.display = 'none';
    webtoonzWrapper.style.display = 'none';
    usersWrapper.style.display = 'none'; 
    adminMessages.style.display = 'block';
    // toggleBtwUsersSubs('all')
} 


        