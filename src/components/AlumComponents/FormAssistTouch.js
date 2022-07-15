import React from 'react';
import moment from 'moment';
import * as constantes from '../Constantes';

class FormAssistTouch extends React.Component{

    state={
        fechaHoy:moment(new Date()).format("YYYY/MM/DD"),
        horaEntrada:"",
        horaSalida:"",
        mensaje:"Registrar Entrada",
        opciones:{
            enableHighAccuracy: true, // Alta precisión
            maximumAge: 0, // No queremos caché
            timeout: 5000 // Esperar solo 5 segundos
        },
        user:JSON.parse(sessionStorage.getItem("USER"))
    }

    componentDidMount=()=>{
        //Consultamos si existe un nuevo registro 
        let datos = {
            nombre:this.state.user.nombre,
            apellidos: this.state.user.apellidos,
            programa:this.state.user.programa_id,
            fecha:this.state.fechaHoy
        }
        let url = `${constantes.PATH_API}addAssistTouch.php?nombre=${datos.nombre}&apellidos=${datos.apellidos}&programa=${datos.programa}&fecha=${datos.fecha}`;

        fetch(url, {
            method: 'GET',
            mode: 'cors'
        })  
            .then(response => response.json())
            .then((data) => {
                let hS = data[0].hora_salida!=null?data[0].hora_salida:"";
                let hE = data[0].hora_entrada!=null?data[0].hora_entrada:"";
                let mens = data[0].hora_entrada!=null?"Registrar Salida":"Registrar Entrada";
                this.setState(()=>({
                    horaEntrada:hE,
                    horaSalida:hS,
                    mensaje:mens
                }));
                
            });
    
    }


    registroCorrecto=(ubicacion)=>{
        //Enviar hora 
        let hora = moment(new Date()).format("HH:mm:ss");
        let datos = {
            nombre:this.state.user.nombre,
            apellidos: this.state.user.apellidos,
            programa:this.state.user.programa_id,
            fecha:this.state.fechaHoy,
            hora_registro:hora,
            hora_entrada:this.state.horaEntrada,
            mensaje:this.state.mensaje
        }
        let url = `${constantes.PATH_API}addAssistTouch.php`;

        fetch(url, {
            method: 'POST',
            mode:'cors',
            body: JSON.stringify(datos)
        })
            .then(res => res.text())
            .then(data=>{
                alert("Registrado correctamente");
                window.location.reload();
            })

    }
    registroError=()=>{
        alert("Sucedió un error, intenta nuevamente.");
    }

    render(){

        return(
            <>
                <h3>Registro de asistencia</h3>
                <div>
                    <p>Bienvenido. En esta interfaz podrás registrar tu asistencia al edificio de posgrado (G) de la Facultad de Ingenieria UAEMex.</p>
                    <p>Haz clic en el botón "Registrar Entrada" o "Registrar Salida" según corresponda a tu registro.</p>
                    <p>Para el correcto funcionamiento del registro, activa los permisos de Ubicación unicamente hasta que se confirme que el registro de entrada o salida se hizo correctamente.</p>
                    
                    <div className="consultaRegistro">
                        <span>Fecha: {this.state.fechaHoy}</span>
                        <div className="item">
                            <span>Hora de entrada: </span>
                            <span>{this.state.horaEntrada.length>0?this.state.horaEntrada:"No registrada"}</span>
                        </div>
                        <div className="item">
                            <span>Hora de salida: </span>
                            <span>{this.state.horaSalida.length>0?this.state.horaSalida:"No registrada"}</span>
                        </div>
                    </div>
                    <div className="generaRegistro">
                        {this.state.horaSalida.length>0?<span className="mensajeBoton">Ya ha registrado su asistencia el dia de hoy.</span>:<button className="registerBack registroTouch" onClick={()=>{navigator.geolocation.getCurrentPosition(this.registroCorrecto,this.registroError,this.state.opciones)}}>{this.state.mensaje}</button>}
                    </div>

                </div>
            </>
           

        );
    }

}

export default FormAssistTouch;