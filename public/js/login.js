const mobileLoginForm  = document.querySelector('.mobile-login-form');
const popMessage = document.querySelector('.pop-message');
const messageHead = document.querySelector('.meassage-head');
const messageTick = document.querySelector('.tick');
const messageMessage = document.querySelector('.p-message');
let isError = false;
let errorColor = 'red';
let errorIcon = '&times;';
let showPass = false;
let passIcon = document.querySelector('.pass-icon');
function show_Pass(){
    const password = document.querySelector('.password');
    if(showPass){
        password.type = 'password';
        passIcon.innerHTML = 'password_2';
        showPass = false;
    }else{
        password.type = 'text';
        passIcon.innerHTML = 'password_2_off';
        showPass = true;
    }
}


mobileLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    let password = mobileLoginForm.password.value.trim();
    let email = mobileLoginForm.email.value.trim();
    let mobileLoginErr = document.querySelector('.mobile-login-err');


    if(password && email){
        mobileLoginErr.innerHTML = 'Checking details.......';
        mobileLoginErr.style.color = 'green';
        console.log(password)

        try {
            let res = await fetch('/twp/auth/login', {
                method: 'POST',
                body: JSON.stringify({password, email}),
                headers: {'Content-Type' : 'application/json'}
            });

            const data = await res.json();
            let {E,M} = data;

            if(E){
                if(E.includes('Email not verified please check your email verification link')) displayError(E);
                isError = true
                mobileLoginErr.innerHTML = E;
                mobileLoginErr.style.color = errorColor;
            };

           if(M){
            isError = false
                mobileLoginErr.innerHTML = '';
                displaySuccess(M);
           }
            
        } catch (err) {
            isError = true
            displayError(err)
        }
} 
})

function displayError(err){
    messageHead.innerHTML = 'Error!!';
    messageMessage.innerHTML = err;
    messageTick.innerHTML = errorIcon;
    messageTick.style.color = errorColor;
    isError = true;
    popMessage.style.display = 'block';
}

function displaySuccess(M){
    messageHead.innerHTML = 'Success!!';
    popMessage.style.display = 'block';
    messageTick.innerHTML = '&check;';;
    messageTick.style.color = '#e44616';
    messageMessage.innerHTML = M;
}

const closeMessage = () => {
    popMessage.style.display = 'none'
    if(!isError) location.assign('/twp');
}

function checkName(name){
    let nameArray = name.split(' ')
    if(nameArray.length < 2) return false;
    return true;
} 