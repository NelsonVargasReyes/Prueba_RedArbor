const { generarToken } = require("../helpers/token");

/* ==================== Modelos =====================*/
const loginModel = require("../models/loginModel");


const ControladorLogin = {

    /* ============================================================================== */
    login: async (req, res) => {
        const password = '123456';
        try {
            if(password === req.body.password){

                loginModel.login(req.body.email, async(err, resp) => {
                    if(err){
                        return res.json({
                            ok: false,
                            error: err
                        });
                    }                    

                    if(resp.length === 0){
                        return res.json({
                            ok: false,
                            msm: 'Usuario o contraseña incorrecto'
                        });
                    }

                    const token = await generarToken(resp.id);
                    
                    res.json({
                        ok: true,
                        token
                    });                
                });

            }else{
                res.json({
                    ok: false,
                    msm: 'Usuario o contraseña incorrecto'
                });                 
            }       
            
        } catch (error) {
            console.log('Controlador login: ', error);
            res.json({
                ok: false,
                code: 500,
                error
            });            
        }
    },

};

module.exports = ControladorLogin;