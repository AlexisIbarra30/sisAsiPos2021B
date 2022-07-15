import React from 'react';
import * as constantes from '../Constantes';
import CentralLoader from '../CentralLoader';
import FormAddTeach from '../TeachComponents/FormAddTeach';
import MenuItem from '../MenuItem';
import FormAddGroup from './FormAddGroup';
import FormListGroups from './FormListGroups';
import FormAddAlumn from '../AlumComponents/FormAddAlum';
import FormListAlumns from '../AlumComponents/FormListAlums';
import AssignGroups from './AssignGroups';



export class GroupMain extends React.Component{

    state={
        ready:false,
        renderComponent:FormAddGroup
    }

    //Render Handler
    renderHandler = (renderComponent,selected) => {
        this.setState(() => ({
            renderComponent,
        }));
    }

    //Antes de que se monten los componentes
    componentDidMount = ()=>{
        this.setState({ready:false});
        //Peticion para traer valores que requerimos 

        this.setState({ready:true});
        
    }

    agregaAlumno =()=>{
        return <FormAddAlumn programa={this.props.programa}/>
    }
    agregaGrupo =()=>{
        return <FormAddGroup programa={this.props.programa}/>
    }
    listaAlumnos=()=>{
        return <FormListAlumns programa={this.props.programa}/>
    }
    listaGrupos =()=>{
        return <FormListGroups programa ={this.props.programa}/>
    }
    asignaGrupos =()=>{
        return <AssignGroups programa={this.props.programa}/>
    }

    //Funcion render

    render(){
        return(
            <div className="form-container-mini">
                <h3>Grupos y Alumnos</h3>
                <div className="seccion-horizontal">
                    <div className="seccion-menu">
                        <div className="seccion-menu-botones">
                            <MenuItem renderHandler={this.renderHandler} Component={this.agregaGrupo} titulo="Nuevo grupo"/>
                            <MenuItem renderHandler={this.renderHandler} Component={this.listaGrupos} titulo="Listar grupos"/>
                        
                        </div>

                        <div className="seccion-menu-botones">
                            <MenuItem renderHandler={this.renderHandler} Component={this.agregaAlumno} titulo="Nuevo alumno"/>
                            <MenuItem renderHandler={this.renderHandler} Component={this.listaAlumnos} titulo="Listar alumnos"/>
                        </div>

                        <div className="seccion-menu-botones">
                            <MenuItem renderHandler={this.renderHandler} Component={this.asignaGrupos} titulo="Asignar grupos"/>
                        </div>
                        
                    </div>
                    <div className="seccion-main">
                        <this.state.renderComponent/>
                    </div>
                </div>
            </div>
        );
    }

}

export default GroupMain;