import UserModel from "../models/UserModel.js";
import sendEmail from "../utils/emailSend.js";
import { getDataUri } from "../utils/features.js";
import { HttpResponse } from "../utils/HttpResponse.js";
import cloudinary from "cloudinary";
import crypto from "crypto";

// @access  Public
// @desc    Register user
// @route   POST /api/v1/auth/signup
export const Signup = async (req, res) => {
  try {
    var { channelName, email, password } = req.body;

    if (!channelName || !email || !password) {
      return res.status(404).send({
        success: false,
        message: "All Fields are required",
      });
    }
    email = email.toLowerCase();
    //Email Check
    const User = await UserModel.findOne({ email });
    if (User) {
      throw HttpResponse(404, "Email is Already Ragistered");
    }

    //Store
    const newUser = await UserModel.create({
      channelName,
      email,
      password,
    });

    res.status(201).send({
      success: true,
      message: "The User Ragistered Succefully",
    });
  } catch (error) {
    res.status(504).send({
      success: false,
      message: error.message,
    });
  }
};

//___________________*** End Signup Section 😁 ***______________________//

// @access  Public
// @desc    Login User
// @route   POST /api/v1/auth/signin
export const Signin = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const User = await UserModel.findOne({ email });
    if (!User) {
      throw HttpResponse(404, "Email is not ragistered try ragistration");
    }
    const matchPass = await User.matchPassword(password);
    if (!matchPass) {
      throw HttpResponse(404, "Password is incorrect");
    }
    //Token Generates
    const token = await User.getSignedJwtToken();
    res.cookie("token", token, { httpOnly: true }).status(504).send({
      success: true,
      message: "User Login Succefully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(504).send({
      success: false,
      message: error.message,
    });
  }
};
//___________________*** End Signin Section 😁 ***______________________//

// @access  Public
// @desc    Logout User
// @route   GET /api/v1/auth/logout
export const logout = async (req, res) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).send({
      success: true,
      message: "The User Logout Succefully",
    });
  } catch (error) {
    console.log(error);
    res.status(504).send({
      success: false,
      message: error.message,
    });
  }
};
//___________________*** End Logout Section 😁 ***______________________//

// @access  Private
// @desc    Get Current User
// @route   GET /api/v1/auth/me

export const GetMe = async (req, res) => {
  try {
    const User = req.user;
    res.status(200).send({
      success: true,
      data: User,
    });
  } catch (error) {
    console.log(error);
    res.status(504).send({
      success: false,
      message: error.message,
    });
  }
};
//___________________*** End Get Current User Section 😁 ***______________________//

// @access  Private
// @desc    Update User
// @route   GET /api/v1/auth/updatesdetails
export const UpdateDetails = async (req, res) => {
  try {
    var { channelName, email } = req.body;
    email.toLowerCase();
    if (!channelName || !email) {
      return res.status(200).send({
        success: false,
        message: "All Fields are required",
      });
    }
    const fieldUpdate = {
      channelName: channelName,
      email: email,
    };

    const User = await UserModel.findByIdAndUpdate(req.user.id, fieldUpdate, {
      new: true,
      runValidators: true,
      context: "query",
    });
    if (User) {
      res.status(200).send({
        success: true,
        data: User,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(504).send({
      success: false,
      message: error.message,
    });
  }
};

//___________________*** End Update User Section 😁 ***______________________//

// @access  Private
// @desc    Update Avtar
// @route   GET /api/v1/auth/avtar
export const UploadAvtar = async (req, res, next) => {
  try {
    const file = req.file;
    const { id } = req.user;

    //validation section
    if (!file) {
      return next(new HttpResponse(400, "file is required "));
    }

    //file type validation
    if (!file.mimetype.startsWith("image")) {
      return next(new HttpResponse(404, "Please Upload a image file"));
    }

    //file size validation
    if (!file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new HttpResponse(
          404,
          `Please upload an image less than ${
            process.env.MAX_FILE_UPLOAD / 1000 / 1000
          }mb`
        )
      );
    }

    const files = await getDataUri(file);
    const cdb = await cloudinary.v2.uploader.upload(files.content);
    const update = await UserModel.findByIdAndUpdate(
      id,
      {
        Avatar: {
          public_id: cdb.public_id,
          url: cdb.secure_url,
        },
      },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );
    res.status(200).send({
      success: true,
      message: "succefully Uploaded chennal Avatar",
      data: {
        public_id: cdb.public_id,
        url: cdb.secure_url,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(504).send({
      success: false,
      message: error.message,
    });
  }
};

//___________________*** End Upload Avatar Section 😁 ***______________________//

// @access  Private
// @desc    Update Password
// @route   GET /api/v1/auth/update-password
export const UpdatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    //💣 Validaion
    if (!currentPassword || !newPassword) {
      return next(new HttpResponse(400, "all Fields are required"));
    }

    //💣 Get Current User
    const { id } = req.user;
    const User = await UserModel.findById(id);

    //💣 Check Current Password
    const matchPassword = await User.matchPassword(currentPassword);
    if (!matchPassword) {
      return next(new HttpResponse(400, "The Current Password is incorrect"));
    }

    //💣 Store new Password
    User.password = newPassword;
    await User.save();

    //💣 Response
    res.status(200).send({
      success: true,
      message: "The Password Updated Succefullly",
    });
  } catch (error) {
    console.log(error);
    res.status(504).send({
      success: false,
      message: error.message,
    });
  }
};

//___________________*** End Update Password Section 😁 ***______________________//

// @access  Public
// @desc    Forgot  Password
// @route   POST /api/v1/auth/forgot-password
export const Forgot_Password = async (req, res, next) => {
  try {
    const { email } = req.body;

    //💣  Validation
    if (!email) {
      return next(new HttpResponse(404, "All Fields are required"));
    }

    //💣  Email Check
    const User = await UserModel.findOne({ email });
    if (!User) {
      return next(new HttpResponse(400, "Email is not ragisstered "));
    }

    //💣  Reset Password Token Save
    const resetToken = User.getResetPasswordToken();
    await User.save({ validateBeforeSave: false });

    //Email Send Credentia;s
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetPassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    await sendEmail({
      email: User.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    User.resetPasswordToken = undefined;
    User.resetPasswordExpire = undefined;

    await User.save({ validateBeforeSave: false });

    return next(new HttpResponse(500, "Email could not be sent"));
  }
};

//___________________*** End Forgot Password  Email Send Section 😁 ***______________________//

// @access  Public
// @desc    Forgot  Password 2
// @route   PUT /api/v1/auth/resetPassword/:resetToken
export const Forgot_Password2 = async (req, res, next) => {
  try {
    // 💣  Get Hashed Token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    console.log(resetPasswordToken);

    const user = await UserModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new HttpResponse(400, "Invalid token"));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password Forgoted Succefully",
    });
  } catch (error) {
    console.log(error);
    return next(new HttpResponse(500, error.message));
  }
};
