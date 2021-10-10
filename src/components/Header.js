import React from 'react';
import UserAccount from './UserAccount';
import {history} from '../routers/AppRouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faDoorOpen,faUserCircle} from '@fortawesome/free-solid-svg-icons';
import * as constantes from './Constantes';

export default class Header extends React.Component{

    state = {
        name: undefined,
        app:undefined,
        programa:undefined,
        picture_url:undefined
    }

    componentDidMount() {
        this.getUserName();
        this.setState({picture_url:JSON.parse(sessionStorage.getItem("USER")).picture_url});
    }
    getUserName = () => {
        
        let user = JSON.parse(sessionStorage.getItem("USER"));
        this.setState(() => ({name: user.nombre}))
        this.setState(() => ({app: user.apellidos}))
        this.setState(() => ({programa: user.programa}))
        this.setState(()=>({picture_url:user.picture_url}));
        console.log(user.nombre);
    };

    handleClose = () => {
        let salir = window.confirm("¿Desea cerrar sesión?");

        if(salir){
            sessionStorage.clear();
            history.push('/');
        }
        
    }


    showMenu =()=>{
        let el = document.querySelector("#down-options");
        el.style.display="block";
    }

    valida_sesion=()=>{
        let user = JSON.parse(sessionStorage.getItem("USER"));
        if(user==null){
            history.push(`/`);
            window.location.reload();
        }
    }


    render() {
        return (
        <div>
            <div className='header'>
                <div className='header__container'>
                    <div className="header_logos">
                        <a href="https://www.uaemex.mx/" target="_blank" rel="noreferrer">
                            <img src='images/logo.png' alt="UAEMex Logo"/>
                        </a>
                        <h3>Sistema de Registro de Asistencias</h3>
                        <a href="http://fingenieria.uaemex.mx/portal/inicio/home.php" target="_blank" rel="noreferrer">
                            <img src='images/fingenieria-min.png' alt="Facultad Ingenieria UAEMex"/>
                        </a>
                    </div>
                </div>
            </div>
            <div className='bottom'></div>

            
            <div className="logout-container">

                <div className="userType">
                    <h3 className="title">{`Panel de ${this.state.programa=="Administrador"?this.state.programa:"Coordinador"}`}</h3>
                </div>

                <div className="userMenu">
                    {/*<div className='userMenu-item'>
                        <button className='headerImages'><img className='headerImages' src='./images/user.svg' alt="user logo"/></button>
                        <p className='logoutText'>Bienvenido de vuelta: {this.state.name}</p>
                    </div>
                    <div className='userMenu-item'>
                        <span className="logoutText">{this.state.programa}</span>
                    </div>
                    <div className='userMenu-item'>
                        <button onClick={this.handleClose} className='headerImages'><img className='headerImages' src='./images/logout.svg' alt="logout logo"/></button>
                        <p onClick={this.handleClose} className='logoutText'>Cerrar sesion</p>
                    </div>  */}
                    <div>
                        <div className="drop-options">
        
                            <div className="info-button">
                                <div className="picture" style={{backgroundImage:`url(${this.state.picture_url})`, backgroundRepeat:"no-Repeat",backgroundPosition:"center",backgroundSize:"cover"}}></div>
                                <span className="welcome">{` ${this.state.name}`} </span>
                                <FontAwesomeIcon icon={faChevronDown} className="icono"/>
                            </div>

                            <div className="down-options" id="down-options">
                                <div className="info-user">
                                    <b>Sesión Actual: </b>
                                    <span>{`${this.state.name} ${this.state.app}`}</span>
                                    <b>{this.state.programa}</b>
                                </div>
                                <hr/>
                                <div className="button-menu" onClick={()=>this.props.renderHandler(UserAccount)}>
                                    <FontAwesomeIcon icon={faUserCircle}/>
                                    <span> Configuración de cuenta</span>
                                </div>
                                <div className="button-menu" onClick={this.handleClose}>
                                    <FontAwesomeIcon icon={faDoorOpen}/>
                                    <span> Cerrar Sesión</span>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </div>


            </div>

        </div>
        );
    }
} 