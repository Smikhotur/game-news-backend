const jwt =require('jsonwebtoken')
const tokenModel = require('../models/TokenModel')

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:'15m'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:'30d'})
    console.log(accessToken.length);
    
    return {
      accessToken,
      refreshToken
    }
  }

  validateRefreshToken(token) {
    try {
      const userrData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userrData
    } catch (error) {
      return null;
    }
  }

  validateAccessToken(token) {
    try {
      const userrData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userrData
    } catch (error) {
      return null;
    }
  }


  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({user: userId})
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }

    const token = await tokenModel.create({user: userId, refreshToken})
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await tokenModel.deleteOne({refreshToken})
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await tokenModel.findOne({refreshToken})
    return tokenData;
  }
}

module.exports = new TokenService();
