import { relativeTimeRounding } from 'moment';
import React from 'react';
import * as constantes from '../Constantes';


class FormListAlumns extends React.Component{

    //Estado
    state={
        ready:false,
        alumnos:[],
        tipo_programa:[],
        programa:""
    }

    componentDidMount=()=>{
        this.setState({ready:false});
        let url = `${constantes.PATH_API}alumnosMan.php`;
        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{
            this.setState(()=>({alumnos:data.sort()}));
        });

        //Obetenmos los programas para llenar el combo
        url = `${constantes.PATH_API}programas.php`;
        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{
            this.setState(()=>({tipo_programa:data.sort()}));
            this.setState({ready:true});
        });


    }

    //Funciones de borrado y modificar
    eliminarAlumn=(e,id)=>{
        console.log(id);
        let c = window.confirm("¿Desea eliminar el registro del alumno? Eliminará todo registro de asistencias asociado al mismo.");
        if(c){
            const url = `${constantes.PATH_API}alumnosMan.php?id=`+id;
            fetch(url,{
                method:'GET',
                mode:'cors'
            }).then(res=>res.text())
            .then(
                data=>{
                    this.componentDidMount();
                    alert(data);
                }
            );
        }

    }

     //Obtener valor del combobox
     onProgramaChange = (e) => {
        const programa = e.target.value;
        this.setState(() => ({ programa}))
    }

    render(){
        return(
            <>
                <h4>Listar alumnos</h4>
                <div>
                    <label>Seleccione un programa: </label>
                    <select name="tipo-programa" className="morespace" id="selectProg" onChange={this.onProgramaChange} value={this.state.programa}>
                        {this.state.tipo_programa.map(
                            (tipo,index)=>{
                                if(tipo.id!=0)
                                    return(<option key={index} value={tipo.id} >{`${tipo.programa_nombre}`}</option>);
                            }
                        )
                        }
                        <option key={500000} value="">Todos</option>
                    </select>
                </div>
                <div className="tabla">
                        <div className='registerHEader textBold registerHEaderMini'>
                            <h3> Nombres </h3>
                            <h3> Apellido Paterno </h3>
                            <h3> Apellido Materno </h3>
                            <h3> Programa </h3>
                            <h3> Estatus </h3>
                            <h3> Opciones </h3>
                        </div>
                        <div className="tablaScroll">
                            {this.state.alumnos.map(
                                    (alumno,index)=>{
                                        if(this.state.programa==""){
                                            return(
                                                <div className='registerHEader registerHEaderMini regHeader equalWidth' key={index}>
                                                    <h3>{alumno.nombres}</h3>
                                                    <h3>{alumno.apePaterno}</h3>
                                                    <h3>{alumno.apeMaterno}</h3>
                                                    <h3>{alumno.programa}</h3>
                                                    <h3 hidden>{alumno.programa_id}</h3>
                                                    <h3>{alumno.estatus}</h3>
                                                    <div className="buttonBorrar buttonBorrarMini">
                                                        <button onClick={(e)=>this.eliminarAlumn(e,alumno.id)}>Borrar</button>
                                                    </div>
                                                </div>
                                            );

                                        }else if(alumno.programa_id == this.state.programa){
                                            return(
                                                <div className='registerHEader registerHEaderMini regHeader equalWidth' key={index}>
                                                    <h3>{alumno.nombres}</h3>
                                                    <h3>{alumno.apePaterno}</h3>
                                                    <h3>{alumno.apeMaterno}</h3>
                                                    <h3>{alumno.programa}</h3>
                                                    <h3 hidden>{alumno.programa_id}</h3>
                                                    <h3>{alumno.estatus}</h3>
                                                    <div className="buttonBorrar buttonBorrarMini">
                                                        <button onClick={(e)=>this.eliminarAlumn(e,alumno.id)}>Borrar</button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    }
                                )
                                    
                            }

                        </div>
                    </div>
            </>
        );
    }

}

export default FormListAlumns;