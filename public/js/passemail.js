const form = document.getElementById('email-pass-recovery');
        const popMessage = document.querySelector('.pop-message');
        const messageHead = document.querySelector('.meassage-head');
        const messageTick = document.querySelector('.tick');
        const messageMessage = document.querySelector('.p-message');
        let isError = false;
        let errorColor = 'red';
        let errorIcon = '&times;';

        form.addEventListener('submit', async (e)=>{
            e.preventDefault()
            let email = form.email.value;
            if(email){
                try {
                    let res = await fetch('/twp/auth/forgotpassword', {
                        method: 'POST',
                        body: JSON.stringify({email}),
                        headers: {'Content-Type': 'application/json'},
                    });

                    const data = await res.json();
                    const {E,M,id} = data;

                    if(E) displayError(E);
                    if(M){
                        localStorage.setItem('knprkng', id)
                        displaySuccess(M)
                    };

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
            messageHead.innerHTML = 'Succes!!';
            messageTick.innerHTML = '&check;';
            messageTick.style.color = '#e44616';
            isError = false;
            popMessage.style.display = 'block';
            messageMessage.innerHTML = M;
        }

        const closeMessage = () => {
            popMessage.style.display = 'none'
            if(!isError) location.assign('/twp/auth/otpkvpsjnrmwkmwoomw');
        }