import React from 'react';
import * as constantes from '../Constantes';
import CentralLoader from '../CentralLoader';
import FormAddTeach from '../TeachComponents/FormAddTeach';
import MenuItem from '../MenuItem';
import FormAddGroup from './FormAddGroup';
import ReCAPTCHA from 'react-google-recaptcha';
import moment from 'moment';

class FormListGroups extends React.Component{

    //Estado
    state={
        ready:false,
        grupos:[]
    }

    //Para traer los grupos existentes actualmente
    componentDidMount=()=>{
        this.setState({ready:false});
        const url = `${constantes.PATH_API}grupos.php`;
        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{
            this.setState(()=>({grupos:data}));
            this.setState({ready:true});
        });


    }

    //Funciones de borrado y modificar
    eliminarGroup=(e,id)=>{
        console.log(id);
        let c = window.confirm("¿Desea eliminar el grupo? Eliminará todo registro de asistencias asociado al grupo.");
        if(c){
            const url = `${constantes.PATH_API}grupos.php?id=`+id;
            fetch(url,{
                method:'GET',
                mode:'cors'
            }).then(res=>res.text())
            .then(
                data=>{
                    this.componentDidMount();
                    alert("Eliminado correctamente");
                }
            );
        }

    }


    render(){

        return(
            <>
                <h4>Listar grupos</h4>
                    <div className="tabla">
                        <div className='registerHEader textBold registerHEaderMini'>
                            <h3> Nombre del grupo </h3>
                            <h3> Descripción </h3>
                            <h3> Profesor </h3>
                            <h3> Fecha inicio </h3>
                            <h3> Fecha fin </h3>
                            <h3> Horario</h3>
                            <h3> Opciones </h3>
                        </div>
                        <div className="tablaScroll">
                            {this.state.grupos.map(
                                    (grupo,index)=>{
                                        return(
                                            <div className='registerHEader registerHEaderMini regHeader equalWidth' key={index}>
                                                <h3>{grupo.grupoNombre}</h3>
                                                <h3>{grupo.descripcion}</h3>
                                                <h3>{grupo.profNombre} {grupo.profApe}</h3>
                                                <h3>{moment(grupo.fecha_inicio).format("DD/MM/YYYY")}</h3>
                                                <h3>{moment(grupo.fecha_fin).format("DD/MM/YYYY")}</h3>
                                                <h3>{grupo.hora_inicio.substring(0,5)}  -  {grupo.hora_fin.substring(0,5)}</h3>
                                                <div className="buttonBorrar buttonBorrarMini">
                                                    <button onClick={(e)=>this.eliminarGroup(e,grupo.grupoID)}>Borrar</button>
                                                </div>
                                            </div>
                                        );

                                    }
                                )

                            }

                        </div>
                    </div>
                            
            </>

        );
    }


}

export default FormListGroups;