const isValidEmail = function (value) {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,3}))$/

    if (emailRegex.test(value)) return true;
};

function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
}

function validateName(name) {
    var regex = /^[a-zA-Z ]{2,30}$/;
    return regex.test(name);
}

module.exports.isValidEmail = isValidEmail;
module.exports.checkPassword = checkPassword;
module.exports.validateName = validateName;