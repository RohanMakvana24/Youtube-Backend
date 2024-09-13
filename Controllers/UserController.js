import UserModel from "../models/UserModel.js";
import { getDataUri } from "../utils/features.js";
import { HttpResponse } from "../utils/HttpResponse.js";
import cloudinary from "cloudinary";
import bcrypt from "bcryptjs";
import { contentSecurityPolicy } from "helmet";
// @desc    Create user
// @route   POST /api/v1/auth/user
// @access  Private/Admin
export const createUser = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const { channelName, email, password } = req.body;
    //validation
    if (!channelName || !email || !password) {
      return next(new HttpResponse(404, "All Field are required "));
    }
    const is_exist_User = await UserModel.findOne({ email: email });
    if (is_exist_User) {
      return next(new HttpResponse(404, "Email is aleready Ragistered"));
    }
    //file Validations
    if (!req.file) {
      return next(new HttpResponse(404, "Profile is required"));
    }
    if (!req.file.mimetype.startsWith("image")) {
      return next(new HttpResponse(404, "Please Image Upload"));
    }
    const maxfile = parseInt(process.env.MAX_FILE_UPLOAD);
    if (!req.file.size > maxfile) {
      return next(
        new HttpResponse(
          404,
          `Please upload an image less than ${
            process.env.MAX_FILE_UPLOAD / 1000 / 1000
          }mb`
        )
      );
    }

    // //Profile Upload
    const files = await getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(files.content);

    const User = await UserModel.create({
      channelName: channelName,
      email: email,
      password: password,
      Avatar: {
        public_id: cdb.public_id,
        url: cdb.secure_url,
      },
    });

    res.status(201).send({
      success: true,
      message: "The User Added Succefully",
      User,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};

//----------- End Create User Section 🎆----------------//

// @desc    Get User
// @route   GET /api/v1/auth/user
// @access  Private/Admin

export const getUsers = async (req, res) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(504, error.message));
  }
};

//----------- End Get All User Section 🎆----------------//

// @desc    Get Single User
// @route   GET /api/v1/auth/user/:id
// @access  Private/Admin

export const getSingleUser = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const User = await UserModel.findById(_id).populate({
      path: "subscribers",
    });

    if (!User) {
      return next(new HttpResponse(404, `User with id(${_id}) is not found`));
    }
    res.status(200).json({
      success: true,
      data: User,
    });
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};
//----------- End Get Single User Section 🎆----------------//

// @desc    Delete User
// @route   DELETE /api/v1/auth/user/:id
// @access  Private/Admin

export const deleteUser = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const User = await UserModel.findById(_id);

    if (!User) {
      return next(new HttpResponse(404, `User not found with id(${_id})`));
    }
    const public_id = User.Avatar[0].public_id;

    //😢😢
    const deletedAvatar = await cloudinary.v2.uploader.destroy(
      public_id,
      (err, result) => {
        if (err) {
          return res.status(404).send({
            success: false,
            message: err.message,
          });
        }
        console.log(result);
      }
    );

    await UserModel.findByIdAndDelete(_id);
    res.status(200).send({
      success: true,
      message: "User Deleted Succefully",
    });
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};
//----------- End Delete User Section 🎆----------------//

// @desc    Update User
// @route   PUT /api/v1/auth/user/:id
// @access  Private/Admin
export const update_User = async (req, res, next) => {
  try {
    const { channelName, email, password } = req.body;
    const id = req.params.id;

    //Validation
    const User = await UserModel.findById(id);
    if (!User) {
      return next(new HttpResponse(404, `user with id(${id}) not found`));
    }

    if (!channelName || !email || !password) {
      return next(new HttpResponse(404, `All Field are required `));
    }
    const hashpassword = await bcrypt.hash(password, 10);

    if (!req.file) {
      const UpUser = await UserModel.findByIdAndUpdate(id, {
        channelName,
        email,
        password: hashpassword,
      });

      res.status(200).json({
        success: true,
        message: "Updated Succefully",
        UpUser,
      });
    } else {
      const public_id = User.Avatar[0].public_id;
      if (public_id) {
        const deletedAvatar = await cloudinary.v2.uploader.destroy(
          public_id,
          (err, result) => {
            if (err) {
              return res.status(404).send({
                success: false,
                message: err.message,
              });
            }
            console.log(result);
          }
        );
      }

      if (!req.file.mimetype.startsWith("image")) {
        return next(new HttpResponse(404, "Please Image Upload"));
      }
      const maxfile = parseInt(process.env.MAX_FILE_UPLOAD);
      if (!req.file.size > maxfile) {
        return next(
          new HttpResponse(
            404,
            `Please upload an image less than ${
              process.env.MAX_FILE_UPLOAD / 1000 / 1000
            }mb`
          )
        );
      }

      // //Profile Upload
      const files = await getDataUri(req.file);
      const cdb = await cloudinary.v2.uploader.upload(files.content);
      const UpUser = await UserModel.findByIdAndUpdate(id, {
        channelName: channelName,
        email: email,
        password: password,
        Avatar: {
          public_id: cdb.public_id,
          url: cdb.secure_url,
        },
      });
      res.status(200).json({
        success: true,
        message: "Updated Succefully",
        UpUser,
      });
    }
  } catch (error) {
    console.log(error);
    next(new HttpResponse(504, error.message));
  }
};
