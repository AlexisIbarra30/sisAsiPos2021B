import React from 'react';
import Header from './Header';
import MenuItem from './MenuItem';
import RegisterPage from './UserComponents/RegisterPage';
import FormAddAssist from './UserComponents/FormAddAssist';
import ReportesPage from './UserComponents/ReportesPage';
import Footer from './Footer';
import {history} from '../routers/AppRouter';
import GroupMain from './GroupComponents/GroupMain';
import * as constantes from './Constantes';
import ReportesPage2 from './UserComponents/ReportesPage2';
import moment from 'moment';
import CentralLoader from './CentralLoader';
import FirstLogin from './FirstLogin';

export default class UserPage extends React.Component {

    state = {
        renderComponent: RegisterPage,
        user:JSON.parse(sessionStorage.getItem("USER")),
        firstLogin:0,
        lastpass:'',
        showMenu:1,
        mensaje:1,
        ready:0
    }

    renderHandler = (renderComponent) => {
        this.setState(() => ({
            renderComponent
        }));
    }

    valida_sesion=()=>{
        let user = JSON.parse(sessionStorage.getItem("USER"));
        if(user==null){
            history.push('/');
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
                console.log(currentDate+">"+lp);
                this.setState(()=>({firstLogin:1,mensaje:0}));
            }else{
                console.log(lp+">"+currentDate);
                this.setState(()=>({firstLogin:0,mensaje:1,showMenu:1}));
            }
        }
        
        this.setState(()=>({ready:1}));
    }

    dosFactores = async()=>{

    }

    componentDidMount=async()=>{
        await this.primerLogin();
    }

    muestraForm =()=>{
        return <GroupMain programa={this.state.user.programa_id}/>;
    }

    render() {
        if(this.state.ready){
            return (
                <div>
                    <Header renderHandler={this.renderHandler} showMenu={this.state.showMenu}/>
                    {this.state.firstLogin==1?<FirstLogin user={JSON.parse(sessionStorage.getItem("USER"))} mensaje={this.state.mensaje}/>:
                    <div className="container">
                        <nav className="menu-navegacion">
                            <MenuItem renderHandler={this.renderHandler} Component={RegisterPage} titulo="Cargar Archivo Asistencias" />
                            <MenuItem renderHandler={this.renderHandler} Component={FormAddAssist} titulo="Registrar Asistencia" />
                            <MenuItem renderHandler={this.renderHandler} Component={this.muestraForm} titulo="Grupos y Alumnos"/>
                            <MenuItem renderHandler={this.renderHandler} Component={ReportesPage} titulo="Generar Reportes" />
                        </nav>
                        <div className='Panel'>
                            <this.state.renderComponent/>
                        </div>
                    </div>}
                    <Footer />
                    
                </div>
            );
        }else{
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