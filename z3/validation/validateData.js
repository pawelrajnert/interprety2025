function isTextEmpty(t) {
    return !t || t.toString().trim().length === 0
}

function isMoreThanZero(t) {
    return t && !isNaN(t) && Number(t) > 0
}

function isPhoneValid(t) {
    if (!t) return false;
    const regex = /\d{9}$/
    return regex.test(t)
}

function isEmailValid(t) {
    if (!t) return false;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(t)
}

module.exports = {
    isTextEmpty,
    isMoreThanZero,
    isPhoneValid,
    isEmailValid
}