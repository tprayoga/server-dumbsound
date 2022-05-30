const { user, chat } = require("../../models");

const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const connectedUser = {};

const socketIo = (io) => {
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next();
    } else {
      next(new Error("Not Authorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("client connect:", socket.id);

    const userId = socket.handshake.query.id;

    connectedUser[userId] = socket.id;

    // define listener on event “load admin contact”
    socket.on("load admin contact", async () => {
      try {
        const adminContact = await user.findAll({
          where: {
            status: "admin",
          },
          include: [
            {
              model: chat,
              as: "recipientMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: chat,
              as: "senderMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        });

        console.log(adminContact);

        // emit event to send admin data on event “admin contact”
        socket.emit("admin contact", adminContact);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("load customers contact", async () => {
      try {
        let customersContacts = await user.findAll({
          include: [
            {
              model: chat,
              as: "recipientMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: chat,
              as: "senderMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        });

        // customersContacts di convert agar dapat menampilkan gambar
        customersContacts = JSON.parse(JSON.stringify(customersContacts));

        customersContacts = customersContacts.map((item) => {
          return {
            ...item,
            // image: item.image ? process.env.PATH_FILE + item.image : null,
          };
        });

        // emit event to send admin data on event “admin contact”
        socket.emit("customers contact", customersContacts);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("load messages", async (payload) => {
      try {
        const token = socket.handshake.auth.token;

        const tokenKey = process.env.TOKEN_KEY;
        const verified = jwt.verify(token, tokenKey); // Create Token

        const idRecipient = payload; // catch recipient id sent from client
        const idSender = verified.id; //id user

        const data = await chat.findAll({
          where: {
            idSender: {
              [Op.or]: [idRecipient, idSender],
            },
            idRecipient: {
              [Op.or]: [idRecipient, idSender],
            },
          },
          include: [
            {
              model: user,
              as: "recipient",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
            {
              model: user,
              as: "sender",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
          ],
          order: [["createdAt", "ASC"]],
          attributes: {
            exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
          },
        });

        socket.emit("messages", data);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("send messages", async (payload) => {
      try {
        const token = socket.handshake.auth.token;

        const tokenKey = process.env.TOKEN_KEY;
        const verified = jwt.verify(token, tokenKey); // Create Token

        const idSender = verified.id; // id User
        const { message, idRecipient } = payload;

        await chat.create({
          message,
          idRecipient,
          idSender,
        });

        io.to(socket.id).to(connectedUser[idRecipient]).emit("new message", idRecipient);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("client disconnect", socket.id);
      delete connectedUser[userId];
    });
  });
};

module.exports = socketIo;
