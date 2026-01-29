const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require("../controllers/members.controller");
const { logout } = require("../controllers/auth.controller");

// Krijimi i një antari
router.post("/", auth, createMember);

// Marrja e listës së anëtarëve me search dhe pagination
router.get("/", auth, getMembers);

// Marrja e një antari të vetëm me ID
router.get("/:id", auth, getMemberById);

// Editimi i një antari
router.put("/:id", auth, updateMember);

// Fshirja e një antari
router.delete("/:id", auth, deleteMember);
//dil nga app
router.post("/logout", auth, logout);
module.exports = router;
