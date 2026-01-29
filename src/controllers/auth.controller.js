const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await pool.query(
    "INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id, name, email",
    [name, email, hashed]
    );

    res.status(201).json(user.rows[0]);
} catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration error", error: err.message });
}
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

try {
    const userRes = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
    );
    if (userRes.rows.length === 0)
    return res.status(400).json({ message: "Email gabim" });
    const user = userRes.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
    return res.status(400).json({ message: "Password gabim" });

      // TOKEN
    const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
    );
      // COOKIE 30 DIT
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
    });

    res.json({
        message: "Login success",
        token, // 
        user: {
        id: user.id,
        name: user.name,
        email: user.email,
        },
    });
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
    }
};

exports.logout = (req , res) => {
    //fshij cooking qe ruan tokeni
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
    });
    res.json({message: "You are now logged out"})
}
exports.getUser = (req, res) => {
    res.json(req.user)
}
