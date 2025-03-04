const addScripClose = document.querySelector('.close');
    const scriptAdd = document.querySelector('.script-add');
    let showScriptForm = false;
    const scriptFormBtn = document.querySelector('.show-script-form');
    const scriptForm = document.querySelector('.add--scrip-container');
    let scriptureForm = document.getElementById('add-scrip');
    const scriptMessage = document.querySelector('.message');

    scriptureForm.addEventListener('submit', async function submit(e) {
        e.preventDefault()
        let formData = new FormData(this);
        scriptMessage.innerHTML = '';
        try {
            let res = await fetch('/twp/admin/scripture', {
                method: 'POST',
                body: formData,
            });

            if(!res.ok) throw new Error(`HTTP error!`)

            let message = await res.json();

            const {E,M} = message;
            if(E){
                scriptMessage.innerHTML = E;
                scriptMessage.style.color = 'red'
                return;
            }
            scriptMessage.innerHTML = M;
            scriptMessage.style.color = 'green'

        } catch (err) {
            alert(err.message)
        }
    })


    scriptFormBtn.addEventListener('click', toggleScriptureForm);
    addScripClose.addEventListener('click', toggleScriptureForm)

    function toggleScriptureForm(){
        if(!showScriptForm){
            scriptAdd.style.rotate = '50deg';
            scriptForm.style.display = 'flex';
            showScriptForm = true
            return
        }
        scriptAdd.style.rotate = '0deg';
        scriptForm.style.display = 'none';
        showScriptForm = false
    } 