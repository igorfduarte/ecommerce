import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";

// @desc    Fetch all products
// @route   GET /api/products/
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword ?{
    name:{
      $regex: req.query.keyword,
      $options: 'i'
    }
  }:{} 

  const count = await Product.countDocuments({...keyword})
  const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page-1))

  res.json({products,page,pages:Math.ceil(count/pageSize)});
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    delete product
// @route   delete /api/products/:id
// @access  private admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "product deleted" });
  } else {
    res.status(404);
    throw new Error("product not found");
  }
});

// @desc    Create product
// @route   POST /api/products/
// @access  private admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/public/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  private admin
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (product) {
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(product);
  } else {
    res.status(404);
    throw new Error("product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  private
const createReview = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  const { rating, comment } = req.body;

  if (product) {
    const alreadyReviewd = product.reviews.find((r) => r.user.toString() === req.user._id.toString());

    if (alreadyReviewd) {
      res.status(400);
      throw new Error("product already reviewed");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({messag: 'review added'})
  } else {
    res.status(404);
    throw new Error("product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({rating:-1}).limit(3)

  res.json(products)
});

export { getProductById, getProducts, deleteProduct, createProduct, updateProduct, createReview,getTopProducts };
