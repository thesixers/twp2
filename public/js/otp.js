let otpForm = document.querySelector('#otp-form');
const popMessage = document.querySelector('.pop-message');
const messageHead = document.querySelector('.meassage-head');
const messageTick = document.querySelector('.tick');
const messageMessage = document.querySelector('.p-message');
let isError = false;
let errorColor = 'red';
let errorIcon = '&times;';


function moveCursor(num){        
    const input = document.getElementById(`input${num}`);
    const nextInput = document.getElementById(`input${num + 1}`);
    const prevInput = document.getElementById(`input${num - 1}`);

    if(input.value.length > 1){
        input.value = input.value.slice(0,1);
    }

    if(input.value && nextInput){
        nextInput.focus();
    }
}

function backspace(num){
    const input = document.getElementById(`input${num}`);
    

    input.addEventListener('keyup', (event) =>{
        const prevInput = document.getElementById(`input${num - 1}`);
            if(event.key === 'Backspace'){
            prevInput.focus();
        }
    })
}


otpForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    const input1 = otpForm.input1.value;
    const input2 = otpForm.input2.value;
    const input3 = otpForm.input3.value;
    const input4 = otpForm.input4.value;
    const input5 = otpForm.input5.value;
    let id = localStorage.getItem('knprkng');

    if(id === '') location.assign('/twp/auth/forgotpassword');

    if(input1 && input2 && input3 && input4 && input5){
        let otp = `${input1}${input2}${input3}${input4}${input5}`
        try {
            let res = await fetch('/twp/auth/otp', {
                method: 'POST',
                body: JSON.stringify({otp, id}),
                headers: {'Content-Type' : 'application/json'}
            });

            const data = await res.json();

            const {E,M} = data;

            if(E){
                E === 'invalid user' ? location.assign('/twp/auth/forgotpassword') : displayError(E);
            };
            if(M){
                // localStorage.removeItem('knprkng')
                displaySuccess(M)
            };

        } catch (err) {
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
    messageHead.innerHTML = 'Succes!!';
    messageTick.innerHTML = '&check;';
    messageTick.style.color = '#e44616';
    isError = false;
    popMessage.style.display = 'block';
    messageMessage.innerHTML = M;
}

const closeMessage = () => {
    popMessage.style.display = 'none'
    if(!isError) location.assign('/twp/auth/resetpassword');
}

const resendOTP = async () => {
    let id = localStorage.getItem('knprkng');

    if(email){
        try {
            let res = await fetch('/twp/auth/forgotpassword', {
                method: 'POST',
                body: JSON.stringify({id}),
                headers: {'Content-Type': 'application/json'},
            });

            const data = await res.json();
            const {E,M,email} = data;

            if(E) displayError(E);
            if(M){
                localStorage.setItem('knprkng', id)
                displaySuccess(M)
            };

        } catch (err) {
            displayError(err);
        }
    }
}