const jwt = require("jsonwebtoken");

exports.checkWallet = async (req, res) => {
    let success = false;
    try {

        const {} = req.headers.
        
    } catch (err) {
        return res.status(500).send({
            status: 500,
            success,
            message: "Internal Server Error."
        })
    }
}