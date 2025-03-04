const form = document.getElementById('pass-reset');
        const popMessage = document.querySelector('.pop-message');
        const messageHead = document.querySelector('.meassage-head');
        const messageTick = document.querySelector('.tick');
        const messageMessage = document.querySelector('.p-message');
        let isError = false;
        let errorColor = 'red';
        let errorIcon = '&times;';
        const resetPassErr = document.querySelector('.reset-pass-err');

        form.addEventListener('submit', async (e)=>{
            e.preventDefault()
            let password = form.password.value;
            let confirmpassword = form.confirmpass.value;
            let id = localStorage.getItem('knprkng');

            if(id === '') location.assign('/twp/auth/forgotpassword');

            if(password !== confirmpassword) resetPassErr.innerHTML = 'Both passwords don\'t match'

            if(password === confirmpassword){
                try {
                    let res = await fetch('/twp/auth/resetpassword', {
                        method: 'POST',
                        body: JSON.stringify({password, id}),
                        headers: {'Content-Type': 'application/json'},
                    });

                    const data = await res.json();
                    const {E,M} = data;

                    if(E){
                        E === 'invalid user' ? location.assign('/twp/auth/forgotpassword') : displayError(E);
                    };
                    if(M) displaySuccess(M);

                } catch (err) {
                    displayError(err);
                }
            }
        });

        function displayError(err){
            messageHead.innerHTML = 'Error!!';
            messageMessage.innerHTML = err;
            messageTick.innerHTML = errorIcon;
            messageTick.style.color = errorColor;
            isError = true;
            popMessage.style.display = 'block';
        }

        function displaySuccess(M){
            popMessage.style.display = 'block';
            messageMessage.innerHTML = M;
        }

        const closeMessage = () => {
            popMessage.style.display = 'none'
            if(!isError) location.assign('/twp/auth/login');
        }