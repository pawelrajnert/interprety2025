function isTextEmpty(t) {
    return t.toString().length === 0
}

function isMoreThanZero(t) {
    return t > 0
}

function isPhoneValid(t) {
    const regex = /\d{9}$/
    return regex.test(t)
}

function isEmailValid(t) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(t)
}

module.exports = {
    isTextEmpty,
    isMoreThanZero,
    isPhoneValid,
    isEmailValid
}