import DataURIParser from "datauri/parser.js";
import path from "path";

export const getDataUri = async (file) => {
  try {
    const parser = new DataURIParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
  } catch (error) {
    console.log(error);
  }
};
