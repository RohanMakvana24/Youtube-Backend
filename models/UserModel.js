import mongoose from "mongoose";
import mongooseValidator from "mongoose-unique-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const UserSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: [true, "The ChannelName is required"],
      unique: true,
      uniqueCaseInsensitive: true,
    },
    email: {
      type: String,
      required: [true, "The Email is required"],
      unique: true,
      uniqueCaseInsensitive: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    Avatar: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Password is required "],
      minlength: [6, "must be six character long"],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

UserSchema.index({ channelName: "text" });

UserSchema.virtual("subscribers", {
  ref: "Subscription",
  localField: "_id",
  foreignField: "channelId",
  justOne: false,
  count: true,
});
UserSchema.virtual("videos", {
  ref: "Videos",
  localField: "_id",
  foreignField: "userId",
  justOne: false,
  count: true,
});

//plugin
UserSchema.plugin(mongooseValidator, { message: "{PATH} already exist" });

//Find
UserSchema.pre("find", function () {
  this.populate({ path: "subscribers" });
});

//Password Hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//Compare Password
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Generates Token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const UserModel = new mongoose.model("Users", UserSchema);

export default UserModel;
