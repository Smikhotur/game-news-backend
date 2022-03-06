const ApiError = require('../exceptions/api-error');
const tokenService = require('../services/token-service');

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorzedError());
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorzedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorzedError());
    }

    req.user = userData;
    next();
  } catch (error) {
    return next(ApiError.UnauthorzedError());
  }
}
