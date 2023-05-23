const express = require("express");
const app = express();
const crypto = require("crypto");

const key = crypto.randomBytes(32);
//AES Advanced Encryption Standard CBC Cipher Block Chain Mode
const algo = "aes-256-cbc";
//Initialization Vector
const iv = crypto.randomBytes(16);

console.log(key.toString());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let encrypted_data = null;
let decrypted_data = null;
const encrypt = (data) => {
  const cipher = crypto.createCipheriv(algo, key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (data) => {
  const decipher = crypto.createDecipheriv(algo, key, iv);
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

app.get("/", (req, res) => {
  res.render("index", {
    title: "Hello",
    key: key.toString('ascii'),
    iv: iv.toString('ascii'),
    encrypted_data,
  });
});

app.get("/decryption", (req, res) => {
  res.render("decrypter", { title: "Decrypter",decrypted_data });
});
app.post("/encrypt", (req, res) => {
  let msg = req.body.message;
  encrypted_data = encrypt(msg);
  console.log(encrypted_data);
  res.redirect("/");
});

app.post("/decrypt", (req, res) => {
  let msg = req.body.message;
  let key = req.body.key;
  let iv = req.body.iv;
  decrypted_data = decrypt(msg);
  console.log('Encripted',encrypted_data);
  res.redirect("/decryption");
});

app.listen(3000, () => {
  console.log("server is running");
});
