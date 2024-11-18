/* ==================== Modelos =====================*/
const empleadosModel = require("../models/empleadosModel");

const ControladorEmpleados = {
  /* ============================================================================== */
  empleados: async (req, res) => {
    try {
      empleadosModel.empleados(
        req.params.pag,
        async (error, resp) => {
          if (error) {
            res.json({
              ok: false,
              error: error,
            });
          } else {
            res.json({
              ok: true,
              resp,
            });
          }
        }
      );
    } catch (error) {
      console.log("Controlador empleados: ", error);
      res.json({
        ok: false,
        code: 500,
        error,
      });
    }
  },

  /* ============================================================================== */
  eliminarEmpleado: async (req, res) => {
    try {      
      empleadosModel.eliminarEmpleados(
        req.body.ids,
        async (error, resp) => {
          if(error) {
            res.json({
              ok: false,
              error: error
            });
          }else{
            res.json({
              ok: true,
              resp
            });
          }
        }
      );
    } catch (error) {
      console.log("Controlador eliminarEmpleado: ", error);
      res.json({
        ok: false,
        code: 500,
        error,
      });      
    }    
  },

  /* ============================================================================== */
  updateEmpleado: async (req, res) => {
    try {
      empleadosModel.actualizarEmpleado(
        req.body,
        async (error, resp) => {              
          if(error) {
            res.json({
              ok: false,
              error: error
            });
          }else{
            res.json({
              ok: true,
              resp
            });
          }
        }
      );
    } catch (error) {
      console.log("Controlador updateEmpleado: ", error);
      res.json({
        ok: false,
        code: 500,
        error,
      });      
    }
  },

  /* ============================================================================== */
  newEmpleado: async (req, res) => {
    try {
      empleadosModel.newEmpleado(req.body, async(error, resp) => {
        if(error) {
          res.json({
            ok: false,
            error: error
          });
        }else{
          res.json({
            ok: true,
            resp
          });
        }
      });
    } catch (error) {
      console.log("Controlador newEmpleado: ", error);
      res.json({
        ok: false,
        code: 500,
        error,
      });       
    }
  },

  /* ============================================================================== */
  rolesEmpleado: async (req, res) => {
    try {
      empleadosModel.rolesEmpleado(
        async(error, resp) => {
          if(error) {
            res.json({
              ok: false,
              error: error
            });
          }else{
            res.json({
              ok: true,
              resp
            });
          }
        }
      );      
    } catch (error) {
      console.log("Controlador rolesEmpleado: ", error);
      res.json({
        ok: false,
        code: 500,
        error,
      });      
    }
  },

};

module.exports = ControladorEmpleados;
