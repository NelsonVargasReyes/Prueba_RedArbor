const { response } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const validarToken = (req, res = response, next) => {
  const token = req.header("x-token");  

  if (!token) {
    return res.json({
      ok: false,
      msm: "El Token de sesión es necesario",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msm: "Token no valido",
    });
  }
};

module.exports = { validarToken };