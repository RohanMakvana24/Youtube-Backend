import { HttpResponse } from "../utils/HttpResponse.js";

const ValidateBody = (schema) => {
  function func(req, res, next) {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpResponse(400, error.message));
    }
    next();
  }
  return func;
};

export default ValidateBody;
