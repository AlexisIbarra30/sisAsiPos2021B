import React from 'react';
import Header from './Header';
import MenuItem from './MenuItem';
import RegisterPage from './UserComponents/RegisterPage';
import FormAddAssist from './UserComponents/FormAddAssist';
import ReportesPage from './UserComponents/ReportesPage';
import Footer from './Footer';
import {history} from '../routers/AppRouter';
import * as constantes from './Constantes';

export default class UserPage extends React.Component {

    state = {
        renderComponent: RegisterPage
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


    render() {
        return (
            <div>
                <Header renderHandler={this.renderHandler}/>
                <div className="container">
                    <nav className="menu-navegacion">
                        <MenuItem renderHandler={this.renderHandler} Component={RegisterPage} titulo="Cargar Archivo Asistencias" />
                        <MenuItem renderHandler={this.renderHandler} Component={FormAddAssist} titulo="Registrar Asistencia" />
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