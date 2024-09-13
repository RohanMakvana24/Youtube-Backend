import { HttpResponse } from "../utils/HttpResponse.js";

const isEmptyBody = (req, res, next) => {
  const { length } = Object.keys(req.body);

  if (!length) {
    return next(HttpResponse(400, "Body mast have fields"));
  }
  next();
};

export default isEmptyBody;
