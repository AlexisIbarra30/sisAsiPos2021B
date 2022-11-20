import React from 'react';
import Header from './Header';
import MenuItem from './MenuItem';
import FormAddUser from './AdminComponents/FormAddUser';
import FormListUser from './AdminComponents/FormListUser';

import Footer from './Footer';
import FormModifFooter from './AdminComponents/FormModifFooter';
import ProgramsPage from './AdminComponents/ProgramsPage';
import {history} from '../routers/AppRouter';
import RegisterPage from './UserComponents/RegisterPage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown} from '@fortawesome/free-solid-svg-icons';
import * as constantes from './Constantes';

import GroupMain from './GroupComponents/GroupMain';
import ReportesPage2 from './UserComponents/ReportesPage2';
import FirstLogin from './FirstLogin';
import moment, { months } from 'moment';
import CentralLoader from './CentralLoader';


export default class AdminPage extends React.Component {

    state = {
        renderComponent: RegisterPage,
        firstLogin:0,
        lastpass:'',
        showMenu:1,
        mensaje:1,
        ready:0
    }

    renderHandler = (renderComponent,selected) => {
        this.setState(() => ({
            renderComponent,
        }));
    }

    valida_sesion=async ()=>{
        let user = JSON.parse(sessionStorage.getItem("USER"));
        if(user==null){
            history.push(`/`);
            window.location.reload();
        }
    }

    valida_verificacion=()=>{
        let ver = JSON.parse(sessionStorage.getItem("TOKEN"));
        if(ver==null){
            history.push('/verificacion');
            window.location.reload();
        }
    }

    //Validar si es la primer vez que inicia sesión
    primerLogin= async()=>{
        this.valida_sesion();
        this.valida_verificacion();
        let user = JSON.parse(sessionStorage.getItem("USER"));
        let endpoint = `${constantes.PATH_API}usuarios.php?login=${user.id}`;
        let consulta = await fetch(endpoint);
        let json = await consulta.json();
        this.setState(()=>({firstLogin:json.first_login,lastpass:json.lastpass,showMenu:!json.first_login}));
        //Validar fecha de ultimo cambio
        let currentDate = new moment().format("YYYY-MM-DD");
        let lp = new moment(this.state.lastpass).add(6,"months").format("YYYY-MM-DD");
        
        //Validar ultima fecha de cambio de contraseña
        if(this.state.firstLogin==0){
            if(currentDate>lp){
                this.setState(()=>({firstLogin:1,mensaje:0}));
            }else{
                this.setState(()=>({firstLogin:0,mensaje:1,showMenu:1}));
            }
        }
        
        this.setState(()=>({ready:1}));
    }

    componentDidMount=async()=>{
        await this.primerLogin();
    }
    

    render(){
            if(this.state.ready){
                return(
                    <div>
                        <Header renderHandler={this.renderHandler} showMenu={this.state.showMenu}/>
                        {this.state.firstLogin==1?<FirstLogin user={JSON.parse(sessionStorage.getItem("USER"))} mensaje={this.state.mensaje}/>:
                        <div className='container'>
                            <nav className="menu-navegacion">
                                <MenuItem renderHandler={this.renderHandler} Component={RegisterPage} titulo="Cargar Archivo Asistencias"/>
                                {/*Agregamos drop menu para usuarios*/}
                                <div className="menu-item drop-menu-item">
                                    <div className="drop-menu-item-info">
                                        <span>Usuarios </span>
                                        <FontAwesomeIcon icon={faChevronDown} className="icono"/>
                                    </div>
                                    <div className="drop-menu-item-options">
                                        <MenuItem renderHandler={this.renderHandler} Component={FormAddUser} titulo="Agregar Usuario"/>
                                        <MenuItem renderHandler={this.renderHandler} Component={FormListUser} titulo="Listar Usuarios"/>
                                    </div>
                                </div>
        
                                {/*Agregamos drop menu para Profesores*/}
                                {/*<div className="menu-item drop-menu-item">
                                    <div className="drop-menu-item-info">
                                        <span>Profesores </span>
                                        <FontAwesomeIcon icon={faChevronDown} className="icono"/>
                                    </div>
                                    <div className="drop-menu-item-options">
                                        <MenuItem renderHandler={this.renderHandler} Component={FormAddTeach} titulo="Agregar Profesor"/>
                                        <MenuItem renderHandler={this.renderHandler} Component={FormListTeach} titulo="Listar Profesores"/>
                                    </div>
                                </div>
                                */}
                                <MenuItem renderHandler={this.renderHandler} Component={GroupMain} titulo="Grupos y Alumnos"/>
                                <MenuItem renderHandler={this.renderHandler} Component={FormModifFooter} titulo="Pie de Pagina"/>
                                <MenuItem renderHandler={this.renderHandler} Component={ProgramsPage} titulo="Programas"/>
                                <MenuItem renderHandler={this.renderHandler} Component={ReportesPage2} titulo="Generar Reportes" />
                            </nav>
                            <div className='panel' id="panel">
                                <this.state.renderComponent/>
                            </div>
                        </div>}

                        <Footer/>
                    </div>
                );
            } else{
                return (
                    <div className="container loginbg" style={{backgroundImage:`url('images/fi_background.jpg')`}}>                
                        <div className='loginContainer'>
                            <CentralLoader/>
                        </div>
                    </div>

                );
            }   
    }
}