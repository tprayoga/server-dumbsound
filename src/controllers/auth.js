const { user } = require("../../models");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ============= REGISTER =============
exports.register = async (req, res) => {
  const schema = Joi.object({
    fullName: Joi.string().min(2).required(),
    email: Joi.string().email().min(3).required(),
    password: Joi.string().min(6).required(),

  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    // Cek Email
    const email = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (email) {
      return res.status(401).send({
        status: "failed",
        message: "Email telah terdaftar",
      });
    }

    // Hashed Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Tambah user
    const newUser = await user.create({
      fullName: req.body.fullName,
      email: req.body.email.toLowerCase(),
      status: "customers",
      statusPayment: "Not Active",
      password: hashedPassword,
    });



    // Generate token
    const token = jwt.sign({ id: newUser.id }, process.env.TOKEN_KEY);

    res.status(201).send({
      status: "Success",
      message: "Register success",
      data: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

// ============== LOGIN ===============
exports.login = async (req, res) => {
  //Validation
  const schema = Joi.object({
    email: Joi.string().min(5).required(),
    password: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).send({
      message: error.details[0].message,
    });
  }

  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email.toLowerCase(),
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // Check Email
    if (!userExist) {
      return res.status(400).send({
        status: "failed",
        message: "Email belum terdaftar",
      });
    }

    // Check Password
    const isValid = await bcrypt.compare(req.body.password, userExist.password);
    if (!isValid) {
      return res.status(400).send({
        status: "failed",
        message: "Password Salah",
      });
    }

    // Json Web Token
    const token = jwt.sign({ id: userExist.id }, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "Success",
      message: "Berhasil Login",
      data: {
        id: userExist.id,
        fullName: userExist.fullName,
        email: userExist.email,
        status: userExist.status,
        statusPayment: userExist.statusPayment,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

// ============= CHECK USER ================
exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "Failed",
      });
    }

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          fullName: dataUser.fullName,
          email: dataUser.email,
          status: dataUser.status,
          statusPayment: dataUser.statusPayment
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};
