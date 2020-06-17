const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('../config/keys')
const User = require('../models/User')

module.exports.login = async (req, res) => {
  const {email, password} = req.body
  const candidate = await User.findOne({ email })

  if (candidate) {
    const passwordResult = bcrypt.compareSync(password, candidate.password)
    if (passwordResult) {
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, JWT_KEY, { expiresIn: 60 * 60})
      res.status(200).json({
        token: `Bearer ${token}`
      })
    } else {
      res.status(401).json({
        message: 'Wrong password.'
      })
    }
  } else {
    res.status(404).json({
      message: 'User not found.'
    })
  }
};

module.exports.register = async (req, res) => {
  const { email, password } = req.body
  const candidate = await User.findOne({ email })
  if (candidate) {
    res.status(409).json({
      message: 'Email already exists.'
    })
  } else {
    const salt = bcrypt.genSaltSync(10)
    const user = new User({
      email,
      password: bcrypt.hashSync(password, salt)
    })

    try {
      await user.save()
      res.status(201).json(user)
    } catch (e) {

    }
  }
};