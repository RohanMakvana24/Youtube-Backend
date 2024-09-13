import mongoose from "mongoose";

const DBConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("The Database is Connected 😎".underline.cyan);
  } catch (error) {
    console.log(error);
  }
};

export default DBConnect;
