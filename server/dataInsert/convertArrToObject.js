
const convertArrToObject = (data) => {
    return data.map(e => {
        return {
            name: e[0],
            value: e[1]
        }
    })
}

module.exports = convertArrToObject