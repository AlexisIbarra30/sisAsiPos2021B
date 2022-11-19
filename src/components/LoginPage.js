import React from 'react';
import { history } from '../routers/AppRouter';
import * as constantes from './Constantes';
import ReCAPTCHA from 'react-google-recaptcha';
import CentralLoader from './CentralLoader';
import {expres,validaExpres,encuentraExpres} from './Validadiones';

const recaptchaRef = React.createRef();

export default class LoginPage extends React.Component {

    state = {
        error: undefined,
        user: "",
        uError:"",
        password: "",
        pError:"",
        userRole: undefined,
        captcha:undefined, 
        ready:true
    }

    handleTypeUser = (userRole) => {
        this.setState(() => ({
            userRole
        }))
    }

    onUserChange = (e) => {
        const user = e.target.value.trim();
        let mensaje="";
        encuentraExpres(expres.caracteresEspeciales,user)?mensaje="":mensaje="";
        this.setState(() => ({ 
            user:user,
            uError:mensaje
        }))
    }

    onPasswordChange = (e) => {
        const password = e.target.value.trim();
        let mensaje="";
        validaExpres(expres.contra,password)?mensaje="":mensaje=""; //Corregir mensaje de error
        this.setState(() => ({ 
            password:password,
            pError:mensaje
        }))
    }

    onChange = (e) => {
        // Ha registrado el captcha
        if(recaptchaRef.current.getValue()) {
            this.setState(() => ({ captcha: true }))
        }else {
            this.setState(() => ({ captcha: false }))
        }
    }

    authUser = () => {
        //this.setState({ready:false});
        // Verificamos que haya completado el formulario
        if (this.state.user && this.state.password && this.state.captcha) {

            //Validamos que los campos cumplen con las validaciones
            if(this.state.uError.length == 0 && this.state.pError.length == 0){
                // Envolvemos los datos en un JSON
                this.setState({ready:false});
                const json = {
                    usuario: this.state.user,
                    password: this.state.password,
                };

                const url = `${constantes.PATH_API}login.php`;
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
                        const user = response[0];
                        const intentos = user.intentos;
                        let mensajeError = "Usuario y/o contraseña incorrecto. Te quedan " + intentos + " intentos.";
                        let tiempoMensaje = 5000;
                        //Usuario comun
                        if (user.valido === true && user.tipo_usuario === "0") {
                            //Guardamos en el localStorage el usuario
                            sessionStorage.setItem("USER", JSON.stringify({ "id": user.id, "nombre": user.nombre, "apellidos": user.apellidos, "programa": user.programa_nombre, "programa_id": user.programa_id,"fecha_registro":user.fecha_registro,"picture_url":user.picture_url,"tipo":user.tipo_usuario,"usuario":user.usuario,"correo":user.correo}));
                            history.push('/user');
                        } else {
                            // Administrador
                            if (user.valido === true && user.tipo_usuario === "1") {
                                //Guardamos en el localStorage el usuario
                                sessionStorage.setItem("USER", JSON.stringify({ "id": user.id, "nombre": user.nombre, "apellidos": user.apellidos, "programa": user.programa_nombre, "programa_id": user.programa_id,"fecha_registro":user.fecha_registro,"picture_url":user.picture_url,"tipo":user.tipo_usuario,"usuario":user.usuario,"correo":user.correo}));
                                history.push('/admin');
                            } else{
                                if(user.valido === true && user.tipo_usuario==="2"){
                                    sessionStorage.setItem("USER", JSON.stringify({ "id": user.id, "nombre": user.nombre, "apellidos": user.apellidos, "programa": user.programa_nombre, "programa_id": user.programa_id,"fecha_registro":user.fecha_registro,"picture_url":user.picture_url,"tipo":user.tipo_usuario,"usuario":user.usuario,"correo":user.correo}));
                                    history.push('/teach');
                                }else {
                                    if(user.valido ===true && user.tipo_usuario==="Alumno"){
                                        sessionStorage.setItem("USER", JSON.stringify({ "id": user.id, "nombre": user.nombre, "apellidos": user.apellidos, "programa": user.programa_nombre, "programa_id": user.programa_id,"picture_url":user.picture_url,"tipo":user.tipo_usuario,"usuario":user.usuario,"correo":user.correo}));
                                        history.push('/alum');
                                    }else{
                                        // Limpiamos captcha
                                        //recaptchaRef.current.reset();

                                        /*
                                        Si el motivo del error es que se sobrepaso el numero de intentos, se cambia el mensaje de error
                                        */
                                        if(user.valido === false && user.motivo === "TresIntentos"){
                                            mensajeError = "Has llegado al límite de 3 intentos. Intenta de nuevo en " + user.tiempo + " segundos";
                                            tiempoMensaje = user.tiempo * 1000;
                                        }

                                        this.setState(() => ({
                                            //captcha: false,
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
                // Limpiamos el captcha 
                recaptchaRef.current.reset();
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
            // Limpiamos el captcha 
            recaptchaRef.current.reset();
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
                        <h3 className='loginTitle'> Iniciar sesión </h3>
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
                                        <p className='loginText'> Usuario</p>
                                        <input onChange={this.onUserChange} value={this.state.user} className='loginInput' type='text' />
                                        <span className='msgErrorForm'>{this.state.uError}</span>
                                    </div>
                                    <div className='optionContainer'>
                                        <p className='loginText'> Contraseña </p>
                                        <input onChange={this.onPasswordChange} value={this.state.password} className='loginInput' type='password' />
                                        <span className='msgErrorForm'>{this.state.pError}</span>
                                    </div>
                                    <div className='separador'></div>
                                    <div className='recaptcha'>
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey="6Ld-5V4cAAAAALyV-dtix6bash2w0rJn6ykgBRDh"
                                            onChange={this.onChange}
                                            size='normal'
                                        />
                                        </div>
                                    <div className='optionContainer'>
                                        {/*<button onClick={this.authUser} className='loginButton'> Acceder </button>*/}
                                    <input type="submit" onClick={this.authUser} className='loginButton' value="Acceder"/>
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
