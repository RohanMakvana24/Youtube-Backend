import express from "express";
import { Search } from "../Controllers/SearchController.js";

const SearchRoute = express.Router();

//Searching ✅✅
SearchRoute.post("/", Search);
export default SearchRoute;
