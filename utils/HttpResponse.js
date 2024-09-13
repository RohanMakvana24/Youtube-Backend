const messageList = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  500: "Internal Server Error",
};

function HttpResponse(status, message = messageList[status]) {
  const error = Error(message);
  error.status = status;
  return error;
}
export { HttpResponse };
