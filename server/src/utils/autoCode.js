const slugify = require("slugify")

const autoCode = (title) => {
    const slug = Array.from(slugify(title, ""))
    let code = "";
    for (let i = 2; i < 8; i++) {
        code += slug[slug?.length % i]
    }
    return code.toUpperCase()
}

module.exports = autoCode