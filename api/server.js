// SUNUCUYU BU DOSYAYA KURUN

const express = require("express");

const Users = require("./users/model");

const server = express();

server.use(express.json());

server.get("/api/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Kullanıcı bilgisine ulaşılamıyor.",
      });
    });
});

server.get("/api/users/:id", (req, res) => {
  Users.findById(req.params.id)
    .then((user) => {
      if (user === undefined) {
        res.status(404).json({
          message: "Girilen id ile eşleşen kullanıcı bulunamadı.",
        });
      }
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Kullanıcı bilgisine ulaşılamıyor.",
      });
    });
});

server.post("/api/users", (req, res) => {
  const user = req.body;
  if (!user.name || !user.bio) {
    res.status(400).json({
      message: "Lütfen kullanıcı için bir name ve bio sa girin.",
    });
  } else {
    Users.insert(user)
      .then((newUser) => {
        res.status(201).json(newUser);
      })
      .catch((error) => {
        res.status(500).json({
          message: "Kullanıcıyı veritabanına kaydederken bir hata oluştu",
        });
      });
  }
});

server.delete("/api/users/:id", async (req, res) => {
  const possibleUser = await Users.findById(req.params.id);
  if (!possibleUser) {
    res.status(404).json({
      message: "Girilen id ile eşleşen kullanıcı bulunamadı.",
    });
  } else {
    Users.remove(possibleUser.id)
      .then((deletedUser) => {
        res.json(deletedUser);
      })
      .catch((error) => {
        res.status(500).json({
          message: "Kullanıcı silinemedi.",
        });
      });
  }
});

server.put("/api/users/:id", async (req, res) => {
  const possibleUser = await Users.findById(req.params.id);
  if (!possibleUser) {
    res.status(404).json({
      message: "Girilen id ile eşleşen kullanıcı bulunamadı.",
    });
  } else {
    if (!req.body.name || !req.body.bio) {
      res.status(400).json({
        message: "Lütfen kullanıcı name ve biosu girin.",
      });
    } else {
      Users.update(req.params.id, req.body)
        .then((updatedUser) => {
          res.status(200).json(updatedUser);
        })
        .catch((error) => {
          res.status(500).json({
            message: "Kullanıcı bilgileri güncellenemedi!",
          });
        });
    }
  }
});

module.exports = server; /*{};*/ // SERVERINIZI EXPORT EDİN {}
