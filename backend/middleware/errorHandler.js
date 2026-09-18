const databaseErrors = {
  ER_DUP_ENTRY: [409, "A record with the same value already exists"],
  ER_ROW_IS_REFERENCED_2: [
    409,
    "This record cannot be deleted because it is being used",
  ],
  ER_NO_REFERENCED_ROW_2: [400, "The referenced record does not exist"],
  ER_BAD_NULL_ERROR: [400, "A required field is missing"],
  ER_DATA_TOO_LONG: [400, "A field exceeds the allowed length"],
  ER_WARN_DATA_OUT_OF_RANGE: [400, "A numeric value is outside the allowed range"],
  ER_TRUNCATED_WRONG_VALUE: [400, "A field contains an invalid value"],
  ER_CHECK_CONSTRAINT_VIOLATED: [400, "A field contains an invalid value"],
};

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body contains invalid JSON" });
  }

  const databaseError = databaseErrors[error.code];
  const statusCode =
    error.statusCode || error.status || databaseError?.[0] || 500;
  const message =
    databaseError?.[1] ||
    (statusCode < 500 ? error.message : "Internal server error");

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({ error: message });
}

export default errorHandler;
