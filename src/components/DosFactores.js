import React from 'react';
import { history } from '../routers/AppRouter';
import * as constantes from './Constantes';
//import ReCAPTCHA from 'react-google-recaptcha';
import CentralLoader from './CentralLoader';
import {expres,validaExpres,encuentraExpres} from './Validadiones';



export default class DosFactores extends React.Component {

    state = {
        error: undefined,
        code: "",
        usuario: JSON.parse(sessionStorage.getItem("USER")).usuario,
        correo: JSON.parse(sessionStorage.getItem("USER")).correo,
        uError: "",
        user:JSON.parse(sessionStorage.getItem("USER")),
        ready:true
    }



    
    valida_sesion=()=>{
        let user = JSON.parse(sessionStorage.getItem("USER"));
        if(user==null){
            history.push('/');
            window.location.reload();
        }
        
    }
    

    
    componentDidMount=()=>{
        this.valida_sesion();
    }
    

    onCodeChange = (e) => {

        

        const code = e.target.value.trim();
        let mensaje="";
        let valido = validaExpres(expres.code,code);

        if(valido){
            mensaje="";
        }else{
            code.length>0?
            mensaje="Por favor, introduce un código de verificación de 5 dígitos":
            mensaje=""
        }

        this.setState(() => ({ 
            code:code,
            uError:mensaje
        }))

    }

    


    sendCode = () => {


        // Envolvemos los datos en un JSON
        this.setState({ready:false});
        const json = {
            reenviar: true,
            usuario: this.state.user.usuario,
        };

        const url = `${constantes.PATH_API}dosFactores.php`;
        // Lanzamos los datos al servidor
        fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(json)
        })
            .then(res => res.json())
            .catch(error => {
                console.log('Error', error);
            })
            .then(response => {
                const resp = response[0];
                let mensajeError = "Error";
                let tiempoMensaje = 5000;
                if (resp.valido === true) {
                    alert("El correo con el nuevo codigo de verificacion se ha enviado a tu correo electronico: " + this.state.correo.substring(0,4) + "****" + ".com");
                    history.push('/verificacion');
                    window.location.reload();
                } 
                else{

                    if(resp.valido === false && resp.motivo === "TresIntentos"){
                        mensajeError = "Has llegado al límite de 3 intentos. Intenta de nuevo en " + resp.tiempo + " segundos";
                        tiempoMensaje = resp.tiempo * 1000;
                    }

                    this.setState(() => ({
                        error: mensajeError,
                        ready:true
                    }));
                    setTimeout(() => {
                        this.setState(() => ({
                            error: undefined
                        }));
                    }, tiempoMensaje)
                }
            });
        
    }

    //Salir
    handleClose = () => {
        let salir = window.confirm("¿Desea cerrar sesión?");

        if(salir){
            sessionStorage.clear();
            history.push('/');
        }
        
    }



    authCode = () => {
        //this.setState({ready:false});
        // Verificamos que haya completado el formulario
        if (this.state.code) {

            //Validamos que los campos cumplen con las validaciones
            if(this.state.uError.length == 0){
                // Envolvemos los datos en un JSON
                this.setState({ready:false});
                const json = {
                    codigo: this.state.code,
                    usuario: this.state.user.usuario,
                };

                const url = `${constantes.PATH_API}dosFactores.php`;
                // Lanzamos los datos al servidor
                fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    body: JSON.stringify(json)
                })
                    .then(res => res.json())
                    .catch(error => {
                        console.log('Error', error);
                    })
                    .then(response => {
                        const verif = response[0];
                        const intentos = verif.intentos;
                        let mensajeError = verif.motivo;
                        if(intentos != null){
                            mensajeError = mensajeError + ". Te quedan " + intentos + " intentos.";
                        }
                        
                        let tiempoMensaje = 5000;
                        //Usuario comun
                        //if (user.valido === true && user.tipo_usuario === "0") {
                        if (verif.valido === true && this.state.user.tipo == "0") {
                            //Guardamos en el localStorage el usuario
                            sessionStorage.setItem("TOKEN", JSON.stringify({ "token": verif.token}));
                            history.push('/user');
                        } else {
                            // Administrador
                            //if (user.valido === true && user.tipo_usuario === "1") {
                            if (verif.valido === true && this.state.user.tipo == "1") {
                                //Guardamos en el localStorage el usuario
                                //sessionStorage.setItem("USER", JSON.stringify({ "id": user.id, "nombre": user.nombre, "apellidos": user.apellidos, "programa": user.programa_nombre, "programa_id": user.programa_id,"fecha_registro":user.fecha_registro,"picture_url":user.picture_url}));
                                sessionStorage.setItem("TOKEN", JSON.stringify({ "token": verif.token}));
                                history.push('/admin');
                            } else{
                                //if(user.valido === true && user.tipo_usuario==="2"){
                                if(verif.valido === true && this.state.user.tipo == "2"){
                                    //sessionStorage.setItem("USER", JSON.stringify({ "id": user.id, "nombre": user.nombre, "apellidos": user.apellidos, "programa": user.programa_nombre, "programa_id": user.programa_id,"fecha_registro":user.fecha_registro,"picture_url":user.picture_url}));
                                    sessionStorage.setItem("TOKEN", JSON.stringify({ "token": verif.token}));
                                    history.push('/teach');
                                }else {
                                    //if(user.valido ===true && user.tipo_usuario==="Alumno"){
                                    if(verif.valido ===true && this.state.user.tipo == "Alumno"){
                                        //sessionStorage.setItem("USER", JSON.stringify({ "id": user.id, "nombre": user.nombre, "apellidos": user.apellidos, "programa": user.programa_nombre, "programa_id": user.programa_id,"picture_url":user.picture_url}));
                                        sessionStorage.setItem("TOKEN", JSON.stringify({ "token": verif.token}));
                                        history.push('/alum');
                                    }else{

                                        if(verif.valido === false && verif.motivo === "TresIntentos"){
                                            mensajeError = "Has llegado al límite de 3 intentos. Intenta de nuevo en " + verif.tiempo + " segundos";
                                            tiempoMensaje = verif.tiempo * 1000;
                                        }

                                        this.setState(() => ({
                                            error: mensajeError,
                                            ready:true
                                        }));
                                        setTimeout(() => {
                                            this.setState(() => ({
                                                error: undefined
                                            }));
                                        }, tiempoMensaje)
                                    }
                                }
                            }
                        }
                    });
            }else{
                // Si no se completo mostramos el error
                this.setState(() => ({
                    error: "Verifique los datos ingresados en los campos",
                    ready:true
                }));
                setTimeout(() => {
                    this.setState(() => ({
                        captcha: false,
                        error: undefined
                    }));
                }, 3000)
            }

        } else {
            // Si no se completo mostramos el error
            this.setState(() => ({
                error: "Complete el formulario para continuar",
                ready:true
            }));
            setTimeout(() => {
                this.setState(() => ({
                    captcha: false,
                    error: undefined
                }));
            }, 3000)
        }
    }

    render() {
        return (
            <div className="container loginbg" style={{backgroundImage:`url('images/fi_background.jpg')`}}>                
                <div className='loginContainer'>
                    {!this.state.ready?<CentralLoader/>: 
                    <>
                        <a href="https://www.uaemex.mx/" target="_blank" rel="noreferrer">
                            <img src='images/logo.png' className='loginImage' alt="UAEMex Logo"/>
                        </a>
                        <h2 className='loginTitle'>Sistema de Registro de Asistencia</h2>
                        <h3 className='loginTitle'> Verificación de seguridad </h3>
                        {!!!this.state.error ? (
                            <div></div>
                        ) : (
                            <div className='loginError'>
                                <p>{this.state.error}</p>
                            </div>
                        )}

                        <form onSubmit={(e)=>{e.preventDefault()}}>
                            <div className='loginPanel'>
                                <div className='loginForm'>
                                    <div className='optionContainer'>
                                        <p className='loginText'> Código de verificación de seguridad</p>
                                        <span className='msgDosFactores'>El código fue enviado a tu correo {`${this.state.correo.substring(0, 4)}`}**********{`${this.state.correo.substring(this.state.correo.length , this.state.correo.length - 8)}`}</span>
                                        <div className='separador'></div>
                                        <input onChange={this.onCodeChange} value={this.state.code} className='loginInput' type='text' placeholder='Código de verificación'/>
                                        <span className='msgErrorForm'>{this.state.uError}</span>
                                    </div>
                                    
       
                                    <div className='optionContainer'>
                                        {/*<button onClick={this.authUser} className='loginButton'> Acceder </button>*/}
                                        <input type="button" onClick={this.sendCode} className='sendButton' value="Volver a enviar el código"/>
                                        <div className="formDobleFactor-buttons">
                                            <input type="submit" onClick={this.authCode} className='loginButton2' value="Acceder"/>
                                            <input type="button" onClick={this.handleClose} className='cancelVerButton' value="Salir"/>
                                        </div>
                                    
                                    </div>
                                </div>
                            </div>
                        </form>
                    </>
                    }
                </div>
            </div>
        );
    }
}
