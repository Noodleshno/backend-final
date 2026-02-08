const express = require("express");
const router = express.Router();

const { getGamingNews, getGameNews } = require("../controllers/newsController");

router.get("/games", getGamingNews);
router.get("/search", getGameNews); // /api/news/search?q=...

module.exports = router;
