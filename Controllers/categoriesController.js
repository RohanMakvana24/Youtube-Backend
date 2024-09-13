import CategoriesModel from "../models/CategoriesModel.js";
import UserModel from "../models/UserModel.js";
import CategoryRoute from "../Routes/categoriesRoute.js";
import { HttpResponse } from "../utils/HttpResponse.js";

// @desc    Create Category
// @route   POST /api/v1/category/
// @access  Private/Admin
export const createCategorie = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
    //Validation 💣
    if (!title || !description) {
      return next(new HttpResponse(400, "All Fields are required"));
    }

    //Store 💣
    const Store = await CategoriesModel.create({
      title: title,
      description: description,
      userId: userId,
    });

    //Response 💣
    res.status(201).send({
      success: true,
      message: "The Categories Added Succefully",
    });
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};
//-------------------- 🎯 End Add Categories Section 🎯 ---------------//

// @desc    Get categories
// @route   GET /api/v1/categories
// @access  Private/Admin
export const getCategories = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

//-------------------- 🎯 End Get Categories Section 🎯 ---------------//

// @desc    Get  categories by id
// @route   GET /api/v1/categories/:id
// @access  Private/Admin

export const singleCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await CategoriesModel.findById(id);
    if (!category) {
      return next(new HttpResponse(400, `No Category with the id of ${id} `));
    }
    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};

//-------------------- 🎯 End Get Single Categories Section 🎯 ---------------//

// @desc    Update Category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const category = await CategoriesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );
    if (!category) {
      return next(
        new HttpResponse(400, `Category not found with id ${req.params.id}`)
      );
    }
    return res.status(200).json({
      success: true,
      message: "The Category Updated",
      data: category,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};

//-------------------- 🎯 End Updaate Categories Section 🎯 ---------------//

// @desc    Delete Category
// @route   delete /api/v1/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await CategoriesModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return next(
        new HttpResponse(400, `Category not found with id ${req.params.id}`)
      );
    }
    return res.status(200).send({
      success: true,
      message: "Category Deleted Succfully",
    });
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};
