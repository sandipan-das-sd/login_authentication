const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async (req, res, next) => {
    try {
        // Check if the token exists in cookies
        const token = req.cookies.jwt;
        if (!token) {
            throw new Error("No token found");
        }

        // Verify the user using the token and your secret key
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);

        // Attach the user information to the request for further use
        req.user = verifiedUser;

        // Log the verified user information
        console.log("Verified User:", verifiedUser);

        // Move to the next middleware or route handler
        next();
    } catch (error) {
        // Log the error details
        console.error("Authentication Error:", error);

        // Redirect to login page or handle the error as needed
        res.status(401).render("login");
    }
};

module.exports = auth;
