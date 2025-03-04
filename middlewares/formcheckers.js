var Regex =  /\d{4}\/[a-zA-Z]{2}\/\d+/;
var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
var upper = /(?=.*[A-Z])/;
var lower = /(?=.*[a-z])/;
var num = /(?=.*\d)/;

export function isEmail(email){
   return emailRegex.test(email);
}

export function isPassword(password){

    if(password.length < 6) throw Error('password is too short');

    if(!upper.test(password)) throw Error('password must contain a capital/uppercase letter');

    if(!lower.test(password)) throw Error('password must contain a lowercase/small letter');

    if(!num.test(password)) throw Error('password must contain a number');

    return true
}

export function isName(name){
    let nameCount = name.split(' ');
    if(nameCount.length < 2) return false;
    return true
}