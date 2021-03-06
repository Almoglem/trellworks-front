import Swal from "sweetalert2/dist/sweetalert2.js";
export const utilService = {
    delay,
    getRandomInt,
    makeId,
    deepCopy,
    showErrorMsg,
    showSuccessMsg
}

function delay(ms = 1500) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function deepCopy(object) {
    let objectCopy, value, key;
    if (typeof object !== "object" || object === null) return object;
    objectCopy = Array.isArray(object) ? [] : {};
    for (key in object) {
        value = object[key];
        objectCopy[key] = deepCopy(value);
    }
    return objectCopy;
}

function showErrorMsg(msg) {
    Swal.fire({
        position: "bottom-end",
        title: msg,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        customClass: {
            title: "error",
            popup: "error",
        },
        toast: true,
    });
}

function showSuccessMsg(msg) {
    Swal.fire({
        position: "bottom-end",
        title: msg,
        showConfirmButton: false,
        timer: 2500,
        customClass: {
            title: "success",
            popup: "success",
        },
        toast: true,
    });
}

