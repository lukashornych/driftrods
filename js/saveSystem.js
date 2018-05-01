//create or rewrite
function saveCookie(name, value) {
    document.cookie = name + "=" + value + ";";
}

function getCookie(name) {
    var c = document.cookie.split("; ");
    var cookies = [];
    for(var i = 0; i < c.length; i++) {
        cookies[i] = c[i].split("=");
    }

    for(var i = 0; i < cookies.length; i++) {
        if (cookies[i][0] == name) {
            return cookies[i][1];
        }
    }
}

//check if cookie exists
function checkCookie(name) {
    if(isNaN(getCookie(name))) {
        return false;
    } else {
        return true;
    }
}
