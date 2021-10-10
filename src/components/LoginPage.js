import React from 'react';
import { history } from '../routers/AppRouter';
import * as constantes from './Constantes';
import ReCAPTCHA from 'react-google-recaptcha';
import CentralLoader from './CentralLoader';

const recaptchaRef = React.createRef();

export default class LoginPage extends React.Component {

    state = {
        error: undefined,
        user: "",
        password: "",
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
        this.setState(() => ({ user }))
    }

    onPasswordChange = (e) => {
        const password = e.target.value.trim();
        this.setState(() => ({ password }))
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
                    //Usuario comun
                    if (user.valido === true && user.tipo_usuario === "0") {
                        //Guardamos en el localStorage el usuario
                        sessionStorage.setItem("USER", JSON.stringify({ "id": user.id, "nombre": user.nombre, "apellidos": user.apellidos, "programa": user.programa_nombre, "programa_id": user.programa_id,"fecha_registro":user.fecha_registro,"picture_url":user.picture_url}));
                        history.push('/user');
                    } else {
                        // Administrador
                        if (user.valido === true && user.tipo_usuario === "1") {
                            //Guardamos en el localStorage el usuario
                            sessionStorage.setItem("USER", JSON.stringify({ "id": user.id, "nombre": user.nombre, "apellidos": user.apellidos, "programa": user.programa_nombre, "programa_id": user.programa_id,"fecha_registro":user.fecha_registro,"picture_url":user.picture_url}));
                            history.push('/admin');
                        } else {
                            // Limpiamos captcha
                            //recaptchaRef.current.reset();
                            this.setState(() => ({
                                //captcha: false,
                                error: "Usuario y/o contraseña incorrecto",
                                ready:true
                            }));
                            setTimeout(() => {
                                this.setState(() => ({
                                    error: undefined
                                }));
                            }, 3000)
                        }
                    }
                });
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
            <div className="container">                
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
                                    </div>
                                    <div className='optionContainer'>
                                        <p className='loginText'> Contraseña </p>
                                        <input onChange={this.onPasswordChange} value={this.state.password} className='loginInput' type='password' />
                                    </div>
                                    <div className='separador'></div>
                                    <div className='recaptcha'>
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey="6Ld-5V4cAAAAALyV-dtix6bash2w0rJn6ykgBRDh"
                                            onChange={this.onChange}
                                            theme='light'
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
