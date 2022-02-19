const User = require('../models/User');
const bcrypt =require('bcryptjs');
const config = require('config');
const jwt =require('jsonwebtoken');
const { validationResult } = require('express-validator');
const AWS = require('aws-sdk');

const registration =  async (req, res) => {
  try {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).json({message: "Uncorrect request", errors});
    }

    const {
      email,
      password,
      nikname,
      lastName,
      firstName,
      file
    } = req.body;

    const candidate = await User.findOne({email});

    if(candidate) {
      return res.status(400).json({message: `User with email ${email} already exist`});
    }
    
    const hashPassword = await bcrypt.hash(password, 8);
    const s3 = new AWS.S3();
    (async () => {
      await s3
      .putObject({
        Body: 'game-news',
        Bucket: 'game-news-uploads',
        Key: `userAvatar/${req.file.originalname}`
      })
      .promise();
    })();

    const user = new User({
      email,
      password: hashPassword,
      nikname,
      lastName,
      firstName,
      avatar: file
    });

    if(req.file) {
      console.log('file',req.file)
      user.avatar = req.file.mimetype
    }

    // s3.upload(params, (err, data) => {
    //   if (err) {
    //     console.log('Error occured while trying to upload to S3 bucket', err);
    //   }

    //   if (data) {
    //     fs.unlinkSync(req.file.path); // Empty temp folder
    //     const locationUrl = data.Location;
    //     let newUser = new Users({ ...req.body, avatar: locationUrl });
    //     newUser
    //       .save()
    //       .then(user => {
    //         res.json({ message: 'User created successfully', user });
    //       })
    //       .catch(err => {
    //         console.log('Error occured while trying to save to DB');
    //       });
    //   }
    // });

    await user.save();

    const token = jwt.sign({id: user.id}, config.get('secretKey'), {expiresIn: "1h"});

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nikname: user.nikname,
        lastName: user.lastName,
        firstName: user.firstName,
        avatar: user.avatar,
        diskSpace: user.diskSpace,
        usedSpace: user.usedSpace
      }
    });
  } catch (error) {
    console.log('error',error);
    res.send({message: 'Server error'});
  }
};

const login =  async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({email});

    console.log(user);

    if(!user) {
      return res.status(404).json({message: 'user_not_found'})
    }

    const isPassValid = bcrypt.compareSync(password, user.password);

    if(!isPassValid) {
      return res.status(400).json({message: 'Invalid password'});
    }

    const token = jwt.sign({id: user.id}, config.get('secretKey'), {expiresIn: "1h"});
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nikname: user.nikname,
        lastName: user.lastName,
        firstName: user.firstName,
        avatar: user.avatar,
        diskSpace: user.diskSpace,
        usedSpace: user.usedSpace
      }
    });
  } catch (error) {
    res.send({message: 'Server error'});
  }
};

const authMiddlewareControllers =  async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user.id});
    const token = jwt.sign({id: user.id}, config.get('secretKey'), {expiresIn: "1h"});
    console.log(user);
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        diskSpace: user.diskSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.send({message: 'Server error'});
  }
};

module.exports = { registration, login, authMiddlewareControllers};

