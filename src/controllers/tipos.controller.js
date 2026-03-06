const service = require("../services/tipos.service");

exports.getAll = async (req, res, next) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "Nombre requerido" });
    }

    const nuevo = await service.create(nombre);
    res.json(nuevo);
  } catch (err) {
    next(err);
  }
};