import express from "express";
import { authorize, Protect } from "../midleware/AuthMiddleware.js";
import {
  createCategorie,
  deleteCategory,
  getCategories,
  singleCategory,
  updateCategory,
} from "../Controllers/categoriesController.js";
import AdvanceResult from "../midleware/AdvanceResult.js";
import CategoriesModel from "../models/CategoriesModel.js";
import isEmptyBody from "../midleware/isEmptyBody.js";
const CategoryRoute = express.Router();

//PROTECT CATEGORIES ROUTES
CategoryRoute.use(Protect);

//GET AND CREATE CATEGORIES ROUTE 🧛‍♀️ ✅✅
CategoryRoute.route("/")
  .get(AdvanceResult(CategoriesModel), getCategories)
  .post(authorize("admin"), isEmptyBody, createCategorie);

//GET SINGLE AND  UPDATE AND DELETE  CATEGORIES ROUTE 🧛‍♀️  ✅✅
CategoryRoute.route("/:id")
  .get(authorize("admin"), singleCategory)
  .put(isEmptyBody, authorize("admin"), updateCategory)
  .delete(authorize("admin"), deleteCategory);

export default CategoryRoute;
