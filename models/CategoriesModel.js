import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
const CategoriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [3, "Title must be three character long "],
      unique: true,
      trim: true,
      uniqueCaseInsensitive: true,
      required: [true, "The Title is required"],
    },
    description: {
      type: String,
      minlength: [3, "Description must be three character long "],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

CategoriesSchema.plugin(uniqueValidator, { message: "{PATH} already exist" });

const CategoriesModel = new mongoose.model("Categories", CategoriesSchema);

export default CategoriesModel;
