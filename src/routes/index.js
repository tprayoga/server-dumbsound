const express = require("express");
const router = express.Router();
const { uploadFile } = require('../middlewares/uploadFile')
const { addUser, getUsers, getUser, updateUser, deleteUser } = require("../controllers/user");
const { addArtis, getArtis } = require('../controllers/artist')
const { addTransaction, getTransactions, getTransaction, notification, deleteTransaction } = require("../controllers/transactions");

const { musics, addMusic } = require('../controllers/music')
const { register, login, checkAuth } = require("../controllers/auth");
const { auth } = require("../middlewares/auth");
// router menampikan data
router.get('/musics', musics)
router.post("/music", uploadFile(), addMusic);

router.post('/artis', addArtis)
router.get('/artiss', getArtis)

router.get("/transactions", auth, getTransactions);
router.post("/transaction", auth, addTransaction);
router.delete("/transaction/:id", auth, deleteTransaction);
router.post("/register", register);
router.post("/notification", notification);

router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

module.exports = router;
