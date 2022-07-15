import React from 'react';
import Header from './Header';
import Footer from './Footer';
import {history}from '../routers/AppRouter';
import MenuItem from './MenuItem';

import FormAssistTouch from './AlumComponents/FormAssistTouch';


class AlumPage extends React.Component{

    state = {
        renderComponent: FormAssistTouch
    }

    renderHandler = (renderComponent,selected) => {
        this.setState(() => ({
            renderComponent,
        }));
    }

    valida_sesion=()=>{
        let user = JSON.parse(sessionStorage.getItem("USER"));
        if(user==null){
            history.push(`/`);
            window.location.reload();
        }
    }

    componentDidMount=()=>{
        this.valida_sesion();
    }

    render(){
        return(
            <div>
                <Header renderHandler={this.renderHandler}/>
                <div className='container'>
                    <nav className="menu-navegacion">
                        <MenuItem renderHandler={this.renderHandler} Component={FormAssistTouch} titulo="Inicio" />
                    </nav>
                    <div className='panel panelTeach' id="panel">
                        <this.state.renderComponent/>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }


}

export default AlumPage;