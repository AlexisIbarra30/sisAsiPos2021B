import React from 'react';
import * as constantes from '../Constantes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
export class FormAddAlum extends React.Component{
    
    state = {
        nombre:"",
        apePat:"",
        apeMat:"",
        programa:"",
        estatus:"",
        tipo_programa:[],
    }

    //Captura de datos 
    onNombreChange = (e) => {
        const nombre = e.target.value;
        this.setState(() => ({ nombre }))
    }
    onApePatChange = (e) => {
        const apePat = e.target.value;
        this.setState(() => ({ apePat }))
    }
    onApeMatChange = (e) => {
        const apeMat = e.target.value;
        this.setState(() => ({ apeMat }))
    }
     //Obtener valor del combobox
     onProgramaChange = (e) => {
        const programa = e.target.value;
        this.setState(() => ({ programa }))
    }

    onStatusChange=(e)=>{
        const estatus = e.target.value;
        this.setState(()=>({estatus}));
    }
    
    //Funcion para agregar usuarios
    addNewTeach = () =>{
        

        const json = {
            nombre:this.state.nombre,
            apellidos:this.state.apellidos,
            usuario:this.state.usuario,
            password:this.state.password,
            confirm_pass:this.state.confirm_pass,
            tipo_usuario:2,
            programa:5,
            fecha_registro:moment(new Date).format("YYYY/MM/DD"),
        }
        
        if(json.nombre.trim()==="" || json.apellidos.trim()==="" || json.usuario.trim()===""||json.password.trim()===""||json.confirm_pass.trim()===""||json.tipo_usuario===null||json.programa===""){
            alert("Por favor no dejar campos en blanco");
        }else{

            if(this.state.password === this.state.confirm_pass){
                const url = `${constantes.PATH_API}usuarios.php`;
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
                        }else{
                            mensaje="Ya existe cuenta para "+this.state.nombre+" "+this.state.apellidos;
                        }
                        alert(mensaje);
                    }

                );

            }else{
                alert("Las contraseñas no coinciden.");
            }
        }
    }


    //Para llenar combo de programas
    componentDidMount = ()=>{
        let url = `${constantes.PATH_API}programas.php`;
        if(this.props.programa>0){
            url = `${url}?id=${this.props.programa}`;
        }


        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{
            this.setState(()=>({tipo_programa:data}));
        });

    }

    //Enviar nuevo alumno
    addNewAlumn=()=>{
        let options = {weekday: "long", year: "numeric", month: "long", day: "numeric"}
        let user = JSON.parse(sessionStorage.getItem("USER"));
        let registro = {
            "usuario":user.nombre+" "+user.apellidos,
            "programa":user.programa,
            "accion":"Nuevo Alumno",
            "fecha":new Date().toLocaleDateString("es-ES", options)+" - "+new Date().toLocaleTimeString(),
            "extras":[`${this.state.nombre} ${this.state.apePat} ${this.state.apeMat}`]
        }

        let json = {
            nombre:this.state.nombre,
            apePat:this.state.apePat,
            apeMat:this.state.apeMat,
            programa:this.state.programa,
            estatus:this.state.estatus,
            registro:registro
        }

        if(json.nombre.trim()==="" || json.apePat.trim()==="" || json.apeMat.trim()===""||json.programa.trim()===""||json.estatus.trim()===""){
            alert("Por favor no dejar campos en blanco");
        }else{
            const url = `${constantes.PATH_API}alumnosMan.php`;
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
                }
            );

        }


    }


    

    render(){
      
        return(
            <>
                <h4>Nuevo Alumno </h4>
                <div className="FormAddAlumn">
                    <div className="form-item morespace">
                        <label>Nombre(s): </label>
                        <input type='text' id="nombre" name="nombre" className="text50" onChange={this.onNombreChange} value={this.state.nombre}></input>
                    </div>
                    <div className="form-item morespace">
                        <label>Apellido Paterno: </label>
                        <input type='text' id="apellidos" name="apellidos" className="text50" onChange={this.onApePatChange} value={this.state.apePat}></input>
                    </div>
                    <div className="form-item morespace">
                        <label>Apellido Materno: </label>
                        <input type='text' id="apellidos" name="apellidos" className="text50" onChange={this.onApeMatChange} value={this.state.apeMat}></input>
                    </div>
                    
                    <div className="form-item morespace">
                            <label className="morespace">Programa: </label>
                            <select name="tipo-programa" className="morespace" id="selectProg" onChange={this.onProgramaChange} value={this.state.programa}>
                                {this.state.tipo_programa.map(
                                    (tipo,index)=>{
                                        if(tipo.id!=0)
                                            return(<option key={index} value={tipo.id} >{`${tipo.programa_nombre}`}</option>);
                                    }
                                )
                                }
                                <option key={500000} value="">Seleccione una opcion</option>
                            </select>
                    </div>

                    <div className="form-item morespace">
                        <label className="morespace">Estatus: </label> 
                        <select name="estatus" className="morespace" id="selectEstat" onChange={this.onStatusChange} value={this.state.estatus}>
                                <option key={500000} value="">Seleccione una opcion</option>
                                <option key={1} value="1">Activo</option>
                                <option key={2} value="2">Inactivo</option>
                        </select>
                    </div>
                

                    <div className="btnBox smallbtn morespace">
                        <button className="registerBack nomargin" onClick={this.addNewAlumn}>Registrar</button>
                        <button className="registerBack nomargin">Cancelar</button>
                    </div>
                </div>
            </>
            
        );
    }
}
export default FormAddAlum;