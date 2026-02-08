const Review = require("../models/Review");

exports.createReview = async (req, res, next) => {
  try {
    const { title, content, rating, game } = req.body;

    const review = await Review.create({
      title,
      content,
      rating,
      game,
      author: req.user._id,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};


exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};


exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ author: req.user._id })
      .populate("author", "username email");

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};



exports.getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("author", "username email");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    next(error);
  }
};



exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, content, rating, game } = req.body;

    if (title) review.title = title;
    if (content) review.content = content;
    if (rating) review.rating = rating;
    if (game) review.game = game;

    const updatedReview = await review.save();

    res.json(updatedReview);
  } catch (error) {
    next(error);
  }
};



exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};