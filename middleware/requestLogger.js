// Middleware to log each request with method, URL, and timestamp
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  // Log the request
  console.log(`[${timestamp}] ${method} ${url} from ${ip}`);

  // Optional: Store request details for later use
  req.requestTime = new Date();

  // Continue to next middleware/route handler
  next();
};

module.exports = requestLogger;
