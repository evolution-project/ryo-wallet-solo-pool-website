export const privkey = (input) => {
    return input.length === 0 || (/^[0-9A-Fa-f]+$/.test(input) && input.length == 64)
}

export const address = (input) => {

    if(!(/^[0-9A-Za-z]+$/.test(input))) return true

    switch (input.substring(0,3)) {
        case "ar":
        case "aRi":
            return input.length === 97

        case "aRS":
            return input.length == 99

        case "ar":
        case "aRi":
        case "aRS":
            return input.length === 109

        default:
            return true
    }
}
