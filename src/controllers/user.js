// Models
const { user, transaction } = require("../../models");

// Controller
exports.addUser = async (req, res) => {
  try {
    await user.create(req.body);
    res.status(201).send({
      status: "Success",
      message: "Add User Success",
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const data = await user.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: transaction,
          as: "userPayment",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    res.status(200).send({
      status: "Success",
      message: "Get Users Success",
      data: {
        user: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await user.findAll({
      where: { id },
    });
    res.status(200).send({
      status: "Success",
      message: `Get User ${id} Success `,
      data: {
        user: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    await user.update(req.body, {
      where: { id },
    });

    res.status(200).send({
      status: "Success",
      message: `Update User id: ${id} Success `,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await user.destroy({
      where: { id },
    });

    res.status(200).send({
      status: "Success",
      message: `Delete User id: ${id} Success `,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Delete Failed",
      message: "Server Error",
    });
  }
};
