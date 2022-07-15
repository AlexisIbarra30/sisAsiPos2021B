import React from 'react';
import Header from './Header';
import Footer from './Footer';
import {history}from '../routers/AppRouter';
import MenuItem from './MenuItem';
import FormAddAlum from './AlumComponents/FormAddAlum';
import FormAddAssistMan from './TeachComponents/FormAddAssistMan';
import ReportesPage2 from './UserComponents/ReportesPage2';
import ShowGroups from './TeachComponents/ShowGroups';

class TeachPage extends React.Component{

    state = {
        renderComponent: ShowGroups
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
  
                    <div className='panel panelTeach' id="panel">
                        <this.state.renderComponent/>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }


}

export default TeachPage;