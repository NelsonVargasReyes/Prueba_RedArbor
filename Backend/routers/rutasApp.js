const { Router } = require("express");
const { check } = require("express-validator");

const { validarToken } = require("../middlewares/validToken");
const { validarCampos } = require("../middlewares/validCampos");

/*
============================================================
Controladores
===========================================================
*/
const ControladorLogin = require("../controllers/loginControl");
const ControladorEmpleados = require("../controllers/empleadosControl");


/* ------------ api/ ------------- */
const router = Router();

/* ========================== Controlador login ========================== */
router.post(
    "/login",
    ControladorLogin.login
);

/* ========================== Controlador Empleados ========================== */
router.get(
    "/empleados/:pag",
    validarToken,
    ControladorEmpleados.empleados
);

router.delete(
    "/eliminarEmpleado",
    validarToken,
    ControladorEmpleados.eliminarEmpleado
);

router.post(
    "/newEmpleado",
    [
        validarToken,
        check("name", "El Nombre del empleado es necesario").not().isEmpty(),
        check("surname", "El Apellido del empleado es necesario").not().isEmpty(),
        check("dateOfBirth", "La fecha de nacimiento del empleado es necesaria").not().isEmpty().isDate(),
        check("email", "El correo del empleado es necesario").not().isEmpty().isEmail(),
        check("idRol", "El Rol del empleado es necesario").not().isEmpty().isNumeric(),
        validarCampos
    ],
    ControladorEmpleados.newEmpleado
);

router.put(
    "/updateEmpleado",
    [
        validarToken,
        check("name", "El Nombre del empleado es necesario").not().isEmpty(),
        check("surname", "El Apellido del empleado es necesario").not().isEmpty(),
        check("dateOfBirth", "La fecha de nacimiento del empleado es necesaria").not().isEmpty().isDate(),
        check("email", "El correo del empleado es necesario").not().isEmpty().isEmail(),
        check("idRol", "El Rol del empleado es necesario").not().isEmpty().isNumeric(),
        validarCampos
    ],
    ControladorEmpleados.updateEmpleado
);

/* ========================== Roles ========================== */
router.get(
    "/roles",
    validarToken,
    ControladorEmpleados.rolesEmpleado
);


module.exports = router;

