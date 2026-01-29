const router = require("express").Router();
const auth = require("../middlewares/auth.middleware"); // ✅ spelling i saktë

const { generateAllMembersPDF, generateMemberPDF } = require("../controllers/pdf.controller");

// PDF për të gjithë antarët
router.get("/members", auth, generateAllMembersPDF);

// PDF për 1 antar
router.get("/member/:id", auth, generateMemberPDF);

module.exports = router;
