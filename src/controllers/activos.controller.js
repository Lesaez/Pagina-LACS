const service = require("../services/activos.service");

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
    await service.create(req.body);
    res.json({ mensaje: "Activo creado" });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    await service.update(req.params.id, req.body);
    res.json({ mensaje: "Activo actualizado" });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ mensaje: "Activo eliminado" });
  } catch (err) {
    next(err);
  }
};