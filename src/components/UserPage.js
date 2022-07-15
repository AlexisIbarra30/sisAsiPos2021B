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

export default class UserPage extends React.Component {

    state = {
        renderComponent: RegisterPage,
        user:JSON.parse(sessionStorage.getItem("USER")),
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

    componentDidMount=()=>{
        this.valida_sesion();
    }

    muestraForm =()=>{
        return <GroupMain programa={this.state.user.programa_id}/>;
    }

    render() {
        return (
            <div>
                <Header renderHandler={this.renderHandler}/>
                
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
                </div>
                <Footer />
                
            </div>
        );
    }
}