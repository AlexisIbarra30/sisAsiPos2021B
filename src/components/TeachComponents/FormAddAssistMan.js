import React from 'react';
import * as constantes from '../Constantes';
import moment from 'moment';
import CentralLoader from '../CentralLoader';
import {history}from '../../routers/AppRouter';


import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
import {getDay,addDays} from 'date-fns';
registerLocale("es",es);


class FormAddAssistMan extends React.Component{

    state={
        id_grupo:this.props.datos.grupo_id,
        nombre_grupo:this.props.datos.nombre,
        hora_inicio:this.props.datos.hora_inicio.substring(0,5),
        hora_fin:this.props.datos.hora_fin.substring(0,5),
        alumnos:[],
        asistencias:[],
        ids_asistencias:[],
        fecha:moment().format("YYYY/MM/DD"),
        f:new Date(),
        bloquear:false
    }

    //Recuperamos a los alumnos que pertenecen al grupo
    componentDidMount=()=>{
        //Obtenemos alumnos que pertenecen al grupo
        const url = `${constantes.PATH_API}addAssistMan.php?id_grupo=`+this.state.id_grupo+`&fecha=`+this.state.fecha;
        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{

            this.setState({alumnos:data.alumnos});
            this.setState({asistencias:data.asistencias});
            this.setState({ids_asistencias:data.ids_asistencias});

        });
    }
    
    //Controlador de cambios de los checkbox
    onCheckChange=(id_alumno,index)=>{
        let temp1 = this.state.asistencias;
        let temp2 = this.state.ids_asistencias;

        temp1[index] = !temp1[index];
        if(temp1[index]){
            temp2[index]=id_alumno;
        }else{
            temp2[index]=0;
        }

        this.setState({asistencias:temp1,ids_asistencias:temp2});

    }

    //Manipular checkboxs de asistencias
    changeChecks=(valor)=>{
        let a = new Array(this.state.alumnos.length).fill(valor);
        this.setState({asistencias:a});
        //De inicio 
        let b = new Array(this.state.alumnos.length).fill(0);

        if(valor){
            //llenamos arreglo de IDs
            let temp = [];
            this.state.alumnos.map(
                (alumno,index)=>{
                    b[index] = alumno.id;
                }
            );
        }   
        this.setState({ids_asistencias:b});
        
    }

    //Evitar dias domingo
    noDomingo=(dia)=>{
        let d = getDay(dia);
        return d !==0;
    }

    //Envio de las asistencias
    enviarAsistencias=()=>{

        let confirmar = window.confirm("¿Confirmar registro de asistencia? No podrá hacer correcciones desde este menú.");
        
        if(confirmar){
            let json = {
                fecha:this.state.fecha,
                id_alumnos:this.state.ids_asistencias,
                id_grupo:this.state.id_grupo,
                h_inicio:this.state.hora_inicio,
                h_fin:this.state.hora_fin
            }
            console.log(JSON.stringify(json));
            
            const url = `${constantes.PATH_API}addAssistMan.php`;
            fetch(url,{
                method:'POST',
                body: JSON.stringify(json)
            })
            .then(res=>res.text())
            .then(
                data=>{
                    if(data=="correcto"){
                        alert("Asistencias guardadas correctamente.");
                    }
                }
            );

        }

    }

    //Para actualizar los checks segun las asistencias existentes
    onDateAssistChange=(fecha)=>{
        //Obtenemos alumnos que pertenecen al grupo
        const url = `${constantes.PATH_API}addAssistMan.php?id_grupo=`+this.state.id_grupo+`&fecha=`+fecha;
        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{
            this.setState({alumnos:data.alumnos});
            this.setState({asistencias:data.asistencias});
            this.setState({ids_asistencias:data.ids_asistencias});
            this.setState({bloquear:false});
            data.asistencias.forEach(asis=>{
                if(asis==1){
                    this.setState({bloquear:true})
                }
            });
        });
    }

    

    render(){
        return(
            <div className="FormAddAssistMan">  
                <div className="datos_grupo">
                    <h4>Grupo: {this.state.nombre_grupo}</h4>
                    <span>Horario: {this.state.hora_inicio} a {this.state.hora_fin}</span>
                    <span className="ayuda">
                        Para registrar asistencia del alumno seleccione la casilla correspondiente. 
                        Puede retirar la selección para registrar una falta o ausencia del alumno.
                    </span>
                </div>

                <div className='botonesAux'>

                    <button className="registerBack nomargin" onClick={()=>{this.changeChecks(true)}} disabled={this.state.bloquear}>Seleccionar todos</button>
                    <button className="registerBack nomargin" onClick={()=>{this.changeChecks(false)}} disabled={this.state.bloquear}>Quitar selección</button>
                    
                    <div className="fechaAsis">
                        <label>Seleccione la fecha de asistencia: </label>
                        <DatePicker
                                    selected={this.state.f}
                                    onChange={(date) => {
                                        this.setState({f:date,fecha:moment(date).format("YYYY/MM/DD")});
                                        this.onDateAssistChange(moment(date).format("YYYY/MM/DD"));
                                    }}
                                    value={moment(this.state.f).format("DD/MM/YYYY")}
                                    minDate={new Date(this.props.datos.fecha_inicio)}
                                    maxDate={addDays(new Date(this.props.datos.fecha_fin),1)}
                                    dropdownMode="select"
                                    withPortal
                                    locale="es"
                                    filterDate={this.noDomingo}
                                />
                    </div>
                </div>
                <div className="botonesAux">
                    {this.state.bloquear?(<span className="textoAsis">Ya se tiene un registro de asistencias en la fecha dada.</span>):<span className="textoAsis"></span>}
                </div>
                
                <div className="tabla_asistencias">
                    
                    <div className="tabla">
                        <div className='registerHEader textBold'>
                            <h3> Nombres </h3>
                            <h3> Apellido Paterno </h3>
                            <h3> Apellido Materno </h3>
                            <h3> Programa </h3>
                            <h3> Asistencia</h3>
                        </div>
                            <div className="tablaScroll"> 
                                {this.state.alumnos.map(
                                        (alumno,index)=>{
                                            return(
                                                <div className='registerHEader' key={index}>
            
                                                    <h3> {alumno.nombres}</h3>
                                                    <h3> {alumno.apePaterno} </h3>
                                                    <h3> {alumno.apeMaterno} </h3>
                                                    <h3> {alumno.programa_nombre} </h3>
                                                    <div className="caja_asistencia">
                                                        <input type="checkbox" disabled={this.state.bloquear} value={alumno.id} checked={this.state.asistencias[index]} onChange={()=>this.onCheckChange(alumno.id,index)}/>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )
                                }
                            </div>
                    </div>


                </div>

                <div className="btnBox smallbtn morespace">
                    <button className="registerBack nomargin" onClick={this.enviarAsistencias} disabled={this.state.bloquear}> Registrar</button>
                    <button className="registerBack nomargin" onClick={()=>{this.props.renderHandler("","")}}>
                        Cancelar
                    </button>
                </div>

            </div>
        );
    }

}

export default FormAddAssistMan;