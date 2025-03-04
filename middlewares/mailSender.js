import nodemailer from 'nodemailer';

const {EMAIL_USER,EMAIL_PASS} = process.env;


export const sendEmails = (user) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        }
    });

    const mail = {
        from: EMAIL_USER,
        to: user.email,
        subject: 'TWP OTP verification',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account verification</title>
</head>
<body style="background-color: #ffff;">
    <div class="mail-box-container" style="
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            box-shadow: 0px 0px 10px -1px #0000006c;
            max-width: 500px;
            margin: auto;
            border-radius: 5px;
            border: 1px solid #e44616;
        ">
        <div class="logo-container" style="
            overflow: hidden;
            padding: 10px;
            display: flex;
            align-items: center;
            background-color: #e44616;
            color: #ffff;
            gap: 10px;
            flex-direction: column;
        ">
            <img src="../public/images/twp_logo.jpg" alt="" aria-placeholder="twp_logo" style="
             object-fit: contain;
            object-position: center;
            height: 100px;
            border-radius: 50%;
            ">
            <div class="title" style="
            font-size: 20px;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            font-weight: 700;
            ">
                🤗Thanks for signing up on the twp website 🤗
            </div>
        </div>
        <div class="body" style="
        padding: 15px;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            line-height: 30px;
        ">
            <h2>Email verification</h2>
            <div>Hi ${user.name.split(" ")[0]}</div>
            <div>
                You are almost set to start enjoying everything twp website has to offer. All you need do is to click the button below to verify your Email address, if You dont your account will be deactivated 
            </div>
            <div style="
            padding: 20px 10px;
            text-align: center;
            margin-top: 40px;
            ">
                <a href="https://thewebtoonproject.com/twp/auth/emailverify/${user.id}">
                <button style="
                    text-decoration: none;
                    border: none;
                    color: #ffff;
                    background-color: #e44616;
                    padding: 10px;
                    cursor: pointer;
                    margin: auto;
                    border-radius: 5px;
                    font-size: 15px;
                    font-weight: 700;
                    transition: 0.2s ease-in;
                ">Verify my email address</button>
                </a>
            </div>
            <hr>
            <div class="footer" style="
            padding: 20px 10px;
            text-align: center;
            margin-top: 10px;
            text-align: center;
            color: grey;
            font-size: 13px;
            ">
                <div class="socials">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="30" height="30">
                <!-- SVG content here -->
                <path d="M194.4 211.7a53.3 53.3 0 1 0 59.3 88.7 53.3 53.3 0 1 0 -59.3-88.7zm142.3-68.4c-5.2-5.2-11.5-9.3-18.4-12c-18.1-7.1-57.6-6.8-83.1-6.5c-4.1 0-7.9 .1-11.2 .1c-3.3 0-7.2 0-11.4-.1c-25.5-.3-64.8-.7-82.9 6.5c-6.9 2.7-13.1 6.8-18.4 12s-9.3 11.5-12 18.4c-7.1 18.1-6.7 57.7-6.5 83.2c0 4.1 .1 7.9 .1 11.1s0 7-.1 11.1c-.2 25.5-.6 65.1 6.5 83.2c2.7 6.9 6.8 13.1 12 18.4s11.5 9.3 18.4 12c18.1 7.1 57.6 6.8 83.1 6.5c4.1 0 7.9-.1 11.2-.1c3.3 0 7.2 0 11.4 .1c25.5 .3 64.8 .7 82.9-6.5c6.9-2.7 13.1-6.8 18.4-12s9.3-11.5 12-18.4c7.2-18 6.8-57.4 6.5-83c0-4.2-.1-8.1-.1-11.4s0-7.1 .1-11.4c.3-25.5 .7-64.9-6.5-83l0 0c-2.7-6.9-6.8-13.1-12-18.4zm-67.1 44.5A82 82 0 1 1 178.4 324.2a82 82 0 1 1 91.1-136.4zm29.2-1.3c-3.1-2.1-5.6-5.1-7.1-8.6s-1.8-7.3-1.1-11.1s2.6-7.1 5.2-9.8s6.1-4.5 9.8-5.2s7.6-.4 11.1 1.1s6.5 3.9 8.6 7s3.2 6.8 3.2 10.6c0 2.5-.5 5-1.4 7.3s-2.4 4.4-4.1 6.2s-3.9 3.2-6.2 4.2s-4.8 1.5-7.3 1.5l0 0c-3.8 0-7.5-1.1-10.6-3.2zM448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM357 389c-18.7 18.7-41.4 24.6-67 25.9c-26.4 1.5-105.6 1.5-132 0c-25.6-1.3-48.3-7.2-67-25.9s-24.6-41.4-25.8-67c-1.5-26.4-1.5-105.6 0-132c1.3-25.6 7.1-48.3 25.8-67s41.5-24.6 67-25.8c26.4-1.5 105.6-1.5 132 0c25.6 1.3 48.3 7.1 67 25.8s24.6 41.4 25.8 67c1.5 26.3 1.5 105.4 0 131.9c-1.3 25.6-7.1 48.3-25.8 67z"/>
                </svg>
                <div>
                    contact us at <a href="thewebtoonproject@gmail.com" style="
                        color: gray;
                        ">twp234@gmail.com</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
    }


    transporter.sendMail(mail, (error, info) => {
        if (error) {
            return 'Error sending email:', error;
        }
        
        return 'Email sent:', info.response;
    });
}

export const Emails = (user, message) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        }
    });


    const mail = {
        from: EMAIL_USER,
        to: user.email,
        subject: 'Webtoon Approval',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account verification</title>
</head>
<body style="background-color: #ffff;">
    <div class="mail-box-container" style="
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            box-shadow: 0px 0px 10px -1px #0000006c;
            max-width: 500px;
            margin: auto;
            border-radius: 5px;
            border: 1px solid #e44616;
        ">
        <div class="logo-container" style="
            overflow: hidden;
            padding: 10px;
            display: flex;
            align-items: center;
            background-color: #e44616;
            color: #ffff;
            gap: 10px;
            flex-direction: column;
        ">
            <img src="../public/images/twp_logo.jpg" alt="" aria-placeholder="twp_logo" style="
             object-fit: contain;
            object-position: center;
            height: 100px;
            border-radius: 50%;
            ">
            <div class="title" style="
            font-size: 20px;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            font-weight: 700;
            ">
                🤗Thanks for signing up on the twp website 🤗
            </div>
        </div>
        <div class="body" style="
        padding: 15px;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            line-height: 30px;
        ">
            <h2>Email verification</h2>
            <div>Hi ${user.name.split(" ")[0]}</div>
            <div>
                ${message}
            </div>
            
            <hr>
            <div class="footer" style="
            padding: 20px 10px;
            text-align: center;
            margin-top: 10px;
            text-align: center;
            color: grey;
            font-size: 13px;
            ">
                <div class="socials">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="30" height="30">
                <!-- SVG content here -->
                <path d="M194.4 211.7a53.3 53.3 0 1 0 59.3 88.7 53.3 53.3 0 1 0 -59.3-88.7zm142.3-68.4c-5.2-5.2-11.5-9.3-18.4-12c-18.1-7.1-57.6-6.8-83.1-6.5c-4.1 0-7.9 .1-11.2 .1c-3.3 0-7.2 0-11.4-.1c-25.5-.3-64.8-.7-82.9 6.5c-6.9 2.7-13.1 6.8-18.4 12s-9.3 11.5-12 18.4c-7.1 18.1-6.7 57.7-6.5 83.2c0 4.1 .1 7.9 .1 11.1s0 7-.1 11.1c-.2 25.5-.6 65.1 6.5 83.2c2.7 6.9 6.8 13.1 12 18.4s11.5 9.3 18.4 12c18.1 7.1 57.6 6.8 83.1 6.5c4.1 0 7.9-.1 11.2-.1c3.3 0 7.2 0 11.4 .1c25.5 .3 64.8 .7 82.9-6.5c6.9-2.7 13.1-6.8 18.4-12s9.3-11.5 12-18.4c7.2-18 6.8-57.4 6.5-83c0-4.2-.1-8.1-.1-11.4s0-7.1 .1-11.4c.3-25.5 .7-64.9-6.5-83l0 0c-2.7-6.9-6.8-13.1-12-18.4zm-67.1 44.5A82 82 0 1 1 178.4 324.2a82 82 0 1 1 91.1-136.4zm29.2-1.3c-3.1-2.1-5.6-5.1-7.1-8.6s-1.8-7.3-1.1-11.1s2.6-7.1 5.2-9.8s6.1-4.5 9.8-5.2s7.6-.4 11.1 1.1s6.5 3.9 8.6 7s3.2 6.8 3.2 10.6c0 2.5-.5 5-1.4 7.3s-2.4 4.4-4.1 6.2s-3.9 3.2-6.2 4.2s-4.8 1.5-7.3 1.5l0 0c-3.8 0-7.5-1.1-10.6-3.2zM448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM357 389c-18.7 18.7-41.4 24.6-67 25.9c-26.4 1.5-105.6 1.5-132 0c-25.6-1.3-48.3-7.2-67-25.9s-24.6-41.4-25.8-67c-1.5-26.4-1.5-105.6 0-132c1.3-25.6 7.1-48.3 25.8-67s41.5-24.6 67-25.8c26.4-1.5 105.6-1.5 132 0c25.6 1.3 48.3 7.1 67 25.8s24.6 41.4 25.8 67c1.5 26.3 1.5 105.4 0 131.9c-1.3 25.6-7.1 48.3-25.8 67z"/>
                </svg>
                <div>
                    contact us at <a href="thewebtoonproject@gmail.com" style="
                        color: gray;
                        ">twp234@gmail.com</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
    }


    transporter.sendMail(mail, (error, info) => {
        if (error) {
            return 'Error sending email:', error;
        }
        
        return 'Email sent:', info.response;
    });
}

export const otpMail = (user, otp) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        }
    });

    const mail = {
        from: EMAIL_USER,
        to: user.email,
        subject: 'Password Recovery',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account verification</title>
</head>
<body style="background-color: #ffff;">
    <div class="mail-box-container" style="
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            box-shadow: 0px 0px 10px -1px #0000006c;
            max-width: 500px;
            margin: auto;
            border-radius: 5px;
            border: 1px solid #e44616;
        ">
        <div class="logo-container" style="
            overflow: hidden;
            padding: 10px;
            display: flex;
            align-items: center;
            background-color: #e44616;
            color: #ffff;
            gap: 10px;
            flex-direction: column;
        ">
            <img src="../public/images/twp_logo.jpg" alt="" aria-placeholder="twp_logo" style="
             object-fit: contain;
            object-position: center;
            height: 100px;
            border-radius: 50%;
            ">
            <div class="title" style="
            font-size: 20px;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            font-weight: 700;
            ">
                🤗Thanks for signing up on the twp website 🤗
            </div>
        </div>
        <div class="body" style="
        padding: 15px;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            line-height: 30px;
        ">
            <h2>Password Recovery</h2>
            <div>Hi ${user.name.split(" ")[0]}</div>
            <div>
                <div class="message" style="
                text-align: center;
                padding: 10px;
                ">Below is Your password recovery OTP</div>
                <div
                style="
                letter-spacing: 20px;
                font-size: 50px;
                padding: 40px;
                text-align: center;
                color: #e44616;
                "
                >${otp}</div>
            </div>
            
            <hr>
            <div class="footer" style="
            padding: 20px 10px;
            text-align: center;
            margin-top: 10px;
            text-align: center;
            color: grey;
            font-size: 13px;
            ">
                <div class="socials">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="30" height="30">
                <!-- SVG content here -->
                <path d="M194.4 211.7a53.3 53.3 0 1 0 59.3 88.7 53.3 53.3 0 1 0 -59.3-88.7zm142.3-68.4c-5.2-5.2-11.5-9.3-18.4-12c-18.1-7.1-57.6-6.8-83.1-6.5c-4.1 0-7.9 .1-11.2 .1c-3.3 0-7.2 0-11.4-.1c-25.5-.3-64.8-.7-82.9 6.5c-6.9 2.7-13.1 6.8-18.4 12s-9.3 11.5-12 18.4c-7.1 18.1-6.7 57.7-6.5 83.2c0 4.1 .1 7.9 .1 11.1s0 7-.1 11.1c-.2 25.5-.6 65.1 6.5 83.2c2.7 6.9 6.8 13.1 12 18.4s11.5 9.3 18.4 12c18.1 7.1 57.6 6.8 83.1 6.5c4.1 0 7.9-.1 11.2-.1c3.3 0 7.2 0 11.4 .1c25.5 .3 64.8 .7 82.9-6.5c6.9-2.7 13.1-6.8 18.4-12s9.3-11.5 12-18.4c7.2-18 6.8-57.4 6.5-83c0-4.2-.1-8.1-.1-11.4s0-7.1 .1-11.4c.3-25.5 .7-64.9-6.5-83l0 0c-2.7-6.9-6.8-13.1-12-18.4zm-67.1 44.5A82 82 0 1 1 178.4 324.2a82 82 0 1 1 91.1-136.4zm29.2-1.3c-3.1-2.1-5.6-5.1-7.1-8.6s-1.8-7.3-1.1-11.1s2.6-7.1 5.2-9.8s6.1-4.5 9.8-5.2s7.6-.4 11.1 1.1s6.5 3.9 8.6 7s3.2 6.8 3.2 10.6c0 2.5-.5 5-1.4 7.3s-2.4 4.4-4.1 6.2s-3.9 3.2-6.2 4.2s-4.8 1.5-7.3 1.5l0 0c-3.8 0-7.5-1.1-10.6-3.2zM448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM357 389c-18.7 18.7-41.4 24.6-67 25.9c-26.4 1.5-105.6 1.5-132 0c-25.6-1.3-48.3-7.2-67-25.9s-24.6-41.4-25.8-67c-1.5-26.4-1.5-105.6 0-132c1.3-25.6 7.1-48.3 25.8-67s41.5-24.6 67-25.8c26.4-1.5 105.6-1.5 132 0c25.6 1.3 48.3 7.1 67 25.8s24.6 41.4 25.8 67c1.5 26.3 1.5 105.4 0 131.9c-1.3 25.6-7.1 48.3-25.8 67z"/>
                </svg>
                <div>
                    contact us at <a href="thewebtoonproject@gmail.com" style="
                        color: gray;
                        ">twp234@gmail.com</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
    }


    transporter.sendMail(mail, (error, info) => {
        if (error) {
            return 'Error sending email:', error;
        }
        
        return 'Email sent:', info.response;
    });
}

export const sendReply = (user, reply) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        }
    });

    
    const mail = {
        from: EMAIL_USER,
        to: user.email,
        subject: 'Twp Reply',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account verification</title>
</head>
<body style="background-color: #ffff;">
    <div class="mail-box-container" style="
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            box-shadow: 0px 0px 10px -1px #0000006c;
            max-width: 500px;
            margin: auto;
            border-radius: 5px;
            border: 1px solid #e44616;
        ">
        <div class="logo-container" style="
            overflow: hidden;
            padding: 10px;
            display: flex;
            align-items: center;
            background-color: #e44616;
            color: #ffff;
            gap: 10px;
            flex-direction: column;
        ">
            <img src="../public/images/twp_logo.jpg" alt="" aria-placeholder="twp_logo" style="
             object-fit: contain;
            object-position: center;
            height: 100px;
            border-radius: 50%;
            ">
            <div class="title" style="
            font-size: 20px;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            font-weight: 700;
            ">
                🤗You sent us a Message 🤗
            </div>
        </div>
        <div class="body" style="
        padding: 15px;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            line-height: 30px;
        ">
            <h2>Twp Reply</h2>
            <div>Hi ${user.name.split(" ")[0]}</div>
            <div>
                <div class="message" style="
                text-align: center;
                padding: 10px;
                ">We recieved your message/feedback stating that <span style="color: #e44616; font-style: italic;">"${user.message}"</span>.
                <div style="text-align: left;">${reply}</div></div>
                
            </div>
            
            <hr>
            <div class="footer" style="
            padding: 20px 10px;
            text-align: center;
            margin-top: 10px;
            text-align: center;
            color: grey;
            font-size: 13px;
            ">
                <div class="socials">
                <a href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="30" height="30">
                  <!-- SVG content here -->
                  <path d="M194.4 211.7a53.3 53.3 0 1 0 59.3 88.7 53.3 53.3 0 1 0 -59.3-88.7zm142.3-68.4c-5.2-5.2-11.5-9.3-18.4-12c-18.1-7.1-57.6-6.8-83.1-6.5c-4.1 0-7.9 .1-11.2 .1c-3.3 0-7.2 0-11.4-.1c-25.5-.3-64.8-.7-82.9 6.5c-6.9 2.7-13.1 6.8-18.4 12s-9.3 11.5-12 18.4c-7.1 18.1-6.7 57.7-6.5 83.2c0 4.1 .1 7.9 .1 11.1s0 7-.1 11.1c-.2 25.5-.6 65.1 6.5 83.2c2.7 6.9 6.8 13.1 12 18.4s11.5 9.3 18.4 12c18.1 7.1 57.6 6.8 83.1 6.5c4.1 0 7.9-.1 11.2-.1c3.3 0 7.2 0 11.4 .1c25.5 .3 64.8 .7 82.9-6.5c6.9-2.7 13.1-6.8 18.4-12s9.3-11.5 12-18.4c7.2-18 6.8-57.4 6.5-83c0-4.2-.1-8.1-.1-11.4s0-7.1 .1-11.4c.3-25.5 .7-64.9-6.5-83l0 0c-2.7-6.9-6.8-13.1-12-18.4zm-67.1 44.5A82 82 0 1 1 178.4 324.2a82 82 0 1 1 91.1-136.4zm29.2-1.3c-3.1-2.1-5.6-5.1-7.1-8.6s-1.8-7.3-1.1-11.1s2.6-7.1 5.2-9.8s6.1-4.5 9.8-5.2s7.6-.4 11.1 1.1s6.5 3.9 8.6 7s3.2 6.8 3.2 10.6c0 2.5-.5 5-1.4 7.3s-2.4 4.4-4.1 6.2s-3.9 3.2-6.2 4.2s-4.8 1.5-7.3 1.5l0 0c-3.8 0-7.5-1.1-10.6-3.2zM448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM357 389c-18.7 18.7-41.4 24.6-67 25.9c-26.4 1.5-105.6 1.5-132 0c-25.6-1.3-48.3-7.2-67-25.9s-24.6-41.4-25.8-67c-1.5-26.4-1.5-105.6 0-132c1.3-25.6 7.1-48.3 25.8-67s41.5-24.6 67-25.8c26.4-1.5 105.6-1.5 132 0c25.6 1.3 48.3 7.1 67 25.8s24.6 41.4 25.8 67c1.5 26.3 1.5 105.4 0 131.9c-1.3 25.6-7.1 48.3-25.8 67z"/>
                  </svg>
                </a>
                <div>
                    contact us at <a href="thewebtoonproject@gmail.com" style="
                        color: gray;
                        ">twp234@gmail.com</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
    }


    transporter.sendMail(mail, (error, info) => {
        if (error) {
            return 'Error sending email:', error;
        }
        
        return 'Email sent:', info.response;
    });
}