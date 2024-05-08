function validateUsername(username) {
    // Check if username is not empty
    if (!username) {
        return { valid: false, message: "Username is required" };
    }

    // Check if username length is between 3 and 20 characters
    if (username.length < 3 || username.length > 20) {
        return { valid: false, message: "Username must be between 3 and 20 characters long" };
    }

    // Check if username contains only alphanumeric characters and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, message: "Username can only contain letters, numbers, and underscores" };
    }

    return { valid: true };
}

function validatePassword(password) {
    // Check if password is not empty
    if (!password) {
        return { valid: false, message: "Password is required" };
    }

    // Check if password length is at least 6 characters
    if (password.length < 6) {
        return { valid: false, message: "Password must be at least 6 characters long" };
    }

    return { valid: true };
}

module.exports={validateUsername,validatePassword}