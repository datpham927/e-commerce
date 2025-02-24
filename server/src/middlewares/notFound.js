
const notfound = (req, res) => {
    const error = `Route ${req.originalUrl} not found!`
    res.json({
        success: false,
        rs: error
    })
}
module.exports = notfound