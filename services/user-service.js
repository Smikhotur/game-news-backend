const UserModel = require('../models/UserModel')
const bcrypt =require('bcryptjs')
const uuid =require('uuid')
const mailService = require('../services/mail-service')
const tokenService = require('../services/token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')
const { request } = require('express')
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const passport = require('passport');
const passportSetup = require('passport');

class UserService {
  async registration({email, password, nikname, lastName, firstName, file}) {
    const candidate = await UserModel.findOne({email})
    if (candidate) {
      throw ApiError.BadRequest(`User with email ${email} already exist`)
    }
    const hashPassword = await bcrypt.hash(password, 6);
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      email,
      password: hashPassword,
      nikname,
      lastName,
      firstName,
      avatar: file
    })
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate${activationLink}`)

    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {...tokens, user: {
      ...userDto,
      nikname: user.nikname,
      lastName: user.lastName,
      firstName: user.firstName,
      avatar: user.avatar,
    }}
  }

  async activate(activationLink) {
    const user = await UserModel.findOne(activationLink)
    if (!user) {
      throw ApiError.BadRequest('Invalid activation link')
    }
    user.isActivated = true
    await user.save()
  }

  async login(email, password) {
    const user = await UserModel.findOne({email})
    if (!user) {
      throw ApiError.BadRequest('User with this email not found')
    }

    const isPassEquals = await bcrypt.compare(password, user.password)

    if (!isPassEquals) {
      throw ApiError.BadRequest('Invalid password')
    }
    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {...tokens, user: {
      ...userDto,
      nikname: user.nikname,
      lastName: user.lastName,
      firstName: user.firstName,
      avatar: user.avatar,
    }}
  }

  async logout(refreshToken) {
    console.log(refreshToken)
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    console.log('services', refreshToken)

    if (!refreshToken) {
      throw ApiError.UnauthorzedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorzedError();
    }
    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto(user)
    const tokens = tokenService.generateToken({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {...tokens, user: {
      ...userDto,
      nikname: user.nikname,
      lastName: user.lastName,
      firstName: user.firstName,
      avatar: user.avatar,
    }}
  }

  async google() {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
        passReqToCallback: true
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return done(err, user);
          // const user = {
          //   username
          // }
        });
      }
    ));

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }

  async facebook() {
    const users = await UserModel.find();
    return users;
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();
