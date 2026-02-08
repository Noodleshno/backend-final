const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createReview,
  getAllReviews,
  getMyReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { validate } = require("../middleware/validationMiddleware");
const { reviewSchema } = require("../validation/reviewValidation");

router.post("/", authMiddleware, validate(reviewSchema), createReview);
router.get("/all", getAllReviews); // публичный endpoint
router.get("/", authMiddleware, getMyReviews);
router.get("/:id", authMiddleware, getReviewById);
router.put("/:id", authMiddleware, validate(reviewSchema), updateReview);
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;