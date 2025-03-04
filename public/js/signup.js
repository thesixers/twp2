const mobileSignupForm = document.querySelector('.mobile-signup-form');
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

    mobileSignupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let password = mobileSignupForm.password.value.trim();
        let name = mobileSignupForm.name.value.trim();
        let email = mobileSignupForm.email.value.trim();
        let dob = mobileSignupForm.dob.value.trim();
        let mobileSignupErr = document.querySelector('.mobile-signup-err');
        let terms = document.querySelector('#terms');
        isError = true
        let isName = checkName(name);
        mobileSignupErr.innerHTML = 'Just a moment Creating your account.......';
        mobileSignupErr.style.color = 'green';

        let [age, month] = calculateAge(dob);
        if(age < 14){
            isError = true
            mobileSignupErr.innerHTML = 'Users have to be 14yrs and above';
            mobileSignupErr.style.color = errorColor;
            return;
        }
        

        if(!isName){
            let errM = 'you must enter atleast two names';
            isError = true
            mobileSignupErr.innerHTML = errM;
            mobileSignupErr.style.color = errorColor;
            return;
        }

        if(!terms.checked){
            isError = true
            mobileSignupErr.innerHTML = 'You have to agree with the terms and conditions';
            mobileSignupErr.style.color = errorColor;
            return;
        }

        if(password && isName && email && isError){
            try {
                let res = await fetch('/twp/auth/signup', {
                    method: 'POST',
                    body: JSON.stringify({password, name, email, dob}),
                    headers: {'Content-Type' : 'application/json'}
                });
    
                const data = await res.json();
                let {E,M} = data;
    
                if(E){
                    isError = true
                    mobileSignupErr.innerHTML = E;
                    mobileSignupErr.style.color = errorColor;
                };
    
               if(M){
                isError = false
                    mobileSignupErr.innerHTML = '';
                    displaySuccess(M);
               }
                
            } catch (err) {
                isError = true
                displayError(err)
            }
    } 
    })

    function calculateAge(dob){
        let currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth() + 1;
        let currentDate = new Date().getDate();
        let year = dob.split('-')[0];
        let month = dob.split('-')[1];
        let date = dob.split('-')[2]
    
        let age = currentYear - year;
        let months = 0;
    
        if(year >= currentYear) return[age, months];
    
        if(currentMonth < month || currentMonth === month && currentDate < date) age -= 1;
    
           let calcMonth = currentMonth - month
    
           months = calcMonth < 0 ? 12 + calcMonth : 12 - calcMonth;
    
        return [age, months];
    }

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

     function closeMessage(){
        popMessage.style.display = 'none'
        if(!isError) location.assign('/twp/auth/login');
    }

    function checkName(name){
        let nameArray = name.split(' ')
        if(nameArray.length < 2) return false;
        return true;
    } 
