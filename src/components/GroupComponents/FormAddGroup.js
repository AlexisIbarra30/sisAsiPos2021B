import React from 'react';
//Librerias
import moment from 'moment';
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
import {subDays} from 'date-fns';
import * as constantes from '../Constantes';
registerLocale("es",es);


export class FormAddGroup extends React.Component{

    state={
        nombre:"",
        descripcion:"",
        id_profesor:"",
        startDate:moment(subDays(new Date(),7)).format("YYYY/MM/DD"),
        endDate:moment(new Date()).format("YYYY/MM/DD"),
        fchI: subDays(new Date(),7),
        fchF: new Date(),
        usuarios:[],
        limiteDesc:80,
        hora_inicio:"12:00",
        hora_fin:"15:00"

    }

    //Al momento de montar el componente
    componentDidMount = ()=>{
        const url = `${constantes.PATH_API}profesores.php`;
        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{
            let currentUser = JSON.parse(sessionStorage.getItem("USER"));
            let newData = data.filter(el=>(el.nombre!==currentUser.nombre && el.apellidos!==currentUser.apellidos));
            this.setState(()=>({usuarios:newData.sort()}));
        }); 
    }


    //Manejadores de cambios en campos
    onNombreChange = (e) => {
        const nombre = e.target.value;
        this.setState(() => ({ nombre }))
    }
    onDescChange = (e) => {
        const descripcion = e.target.value;
        let caracteres = 80 - e.target.value.length;
        this.setState(() => ({ descripcion,limiteDesc:caracteres }))
    }
    onProfChange = (e) => {
        const id_profesor = e.target.value;
        this.setState(() => ({ id_profesor }))
    }
    onHoraInChange=(e)=>{
        const hora_inicio = e.target.value;
        this.setState(()=>({hora_inicio}));
    }
    onHoraFinChange=(e)=>{
        const hora_fin = e.target.value;
        this.setState(()=>({hora_fin}));
    }
    
    //Agregar nuevo grupo
    addNewGroup = () =>{
        let options = {weekday: "long", year: "numeric", month: "long", day: "numeric"}
        let user = JSON.parse(sessionStorage.getItem("USER"));
        let registro = {
            "usuario":user.nombre+" "+user.apellidos,
            "programa":user.programa,
            "accion":"Nuevo Grupo",
            "fecha":new Date().toLocaleDateString("es-ES", options)+" - "+new Date().toLocaleTimeString(),
            "extras":[this.state.nombre + " - "+this.state.descripcion]
        }

        let json = {
            nombre:this.state.nombre,
            descripcion:this.state.descripcion,
            fecha_inicio:this.state.startDate,
            fecha_fin:this.state.endDate,
            id_profesor:this.state.id_profesor,
            hora_inicio:this.state.hora_inicio,
            hora_fin:this.state.hora_fin,
            registro:registro
        }

        if(json.nombre.trim()===""||json.descripcion.trim()===""||json.fecha_inicio.trim()===""||json.fecha_fin.trim()===""||json.id_profesor.trim()===""){
            alert("Por favor no dejar campos en blanco");
        }else{
            if(json.hora_inicio>json.hora_fin){
                alert("Verifique que la hora de inicio sea menor a la hora de termino.");
            }else{
                //enviamos datos a backend
                const url = `${constantes.PATH_API}grupos.php`;
                fetch(url,{
                    method:'POST',
                    body: JSON.stringify(json)
                })
                .then(res=>res.text())
                .then(
                    (data) =>{
                        var mensaje="";
                        if(data==="correcto"){
                            mensaje="Agregado correctamente";
                        }
                        alert(mensaje);
                        //Limpiamos estados
                        this.setState({
                            nombre:"",
                            descripcion:"",
                            id_profesor:"",
                            startDate:moment(subDays(new Date(),7)).format("YYYY/MM/DD"),
                            endDate:moment(new Date()).format("YYYY/MM/DD"),
                            fchI: subDays(new Date(),7),
                            fchF: new Date(),
                            usuarios:[],
                            limiteDesc:80,
                            hora_inicio:"12:00",
                            hora_fin:"15:00"
                        });
                    }
                );
            }
        }

    }


    render(){

        return(
            <>
                <h4>Nuevo grupo</h4>
                    <div className="FormAddGroup">
                        <h4>Datos del grupo</h4>
                        <div className="form-item">
                            <label>Nombre del grupo: </label>
                            <input type='text' id="nombre" name="nombre" className="text50" onChange={this.onNombreChange} value={this.state.nombre}></input>
                        </div>
                        <div className="form-item">
                            <label>Descripción: </label>
                            {/*<input type='text' id="descripcion" name="descripcion" className="text50" onChange={this.onDescChange} value={this.state.descripcion}></input>*/}
                            <div className="descipcion-grupos">
                                <textarea id="descripcion" name="descripcion" className="text50" onChange={this.onDescChange} value={this.state.descripcion} maxLength="80"></textarea>    
                                <span>Limite: {this.state.limiteDesc}</span>
                            </div>

                        </div>

                        <div className="form-item">
                            <label>Profesor: </label>
                            <select name="user-to-modify" onChange={this.onProfChange} value={this.state.id_profesor}>
                                {this.state.usuarios.map(
                                    (user,index)=>{
                                        return(<option key={index} value={user.id} >{`${user.nombre} ${user.apellidos}`}</option>);
                                    }
                                )
                                }
                                <option key={500000} value="">Seleccione una opcion</option>
                            </select>
                        </div>

                        <h4>Periodo</h4>
                        <span className="mensaje-form">A continuación seleccione el periodo de tiempo que estará vigente el grupo. Generalmente consta de un semestre (6 meses).</span>
                        
                        <div className="form-item-calendar">
                                <label>Fecha de inicio del grupo: </label>
                                <DatePicker
                                    selected={this.state.fchI}
                                    onChange={(date) => {
                                        this.setState({fchI:date,startDate:moment(date).format("YYYY/MM/DD"),fchF:date,startDate:moment(date).format("YYYY/MM/DD")});
                                    }}
                                    selectsStart
                                    startDate={this.state.fchI}
                                    endDate={this.state.fchF}
                                    value={moment(this.state.fchI).format("DD/MM/YYYY")}
                                    showMonthDropdown
                                    dropdownMode="select"
                                    withPortal
                                    locale="es"
                                    
                                />
                        </div>
                        <div className="form-item-calendar">
                                <label>Fecha de fin del grupo: </label>
                                <DatePicker
                                    selected={this.state.fchF}
                                    onChange={(date) => {
                                        this.setState({fchF:date,endDate:moment(date).format("YYYY/MM/DD")});
                                    }}
                                    selectsEnd
                                    startDate={this.state.fchI}
                                    endDate={this.state.fchF}
                                    minDate={this.state.fchI}
                                    value = {moment(this.state.fchF).format("DD/MM/YYYY")}
                                    showMonthDropdown
                                    dropdownMode="select"
                                    withPortal
                                    locale="es"
                                />
                        </div>
                        
                        <h4>Horario</h4>
                        <span className="mensaje-form">Seleccione la hora de inicio y de término de clase para el grupo.</span>
                        <div>
                            <div className="form-item">
                                <label>Hora de inicio (formato 24hrs): </label>
                                <input type="time" value={this.state.hora_inicio} className="text50" onChange={this.onHoraInChange} />
                            </div>
                            
                            <div className="form-item">
                                <label>Hora de término (formato 24hrs): </label>
                                <input type="time" value={this.state.hora_fin} className="text50" onChange={this.onHoraFinChange} />
                            </div>
                           
                        </div>
                        
                        
                    </div>
                    <div className="btnBox smallbtn morespace">
                        <button className="registerBack nomargin" onClick={this.addNewGroup}>Registrar</button>
                        <button className="registerBack nomargin">Cancelar</button>
                    </div>
            </>
        );
    }

}

export default FormAddGroup;