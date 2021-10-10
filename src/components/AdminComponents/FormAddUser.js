import React from 'react';
import * as constantes from '../Constantes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
export class FormAddUser extends React.Component{
    
    state = {
        nombre:"",
        apellidos:"",
        usuario:"",
        password:"",
        confirm_pass:"",
        tipo_usuario:null,
        programa:"",
        tipo_programa:[],
        viewPass1:false,
        viewPass2:false
    }

    //Captura de datos 
    onNombreChange = (e) => {
        const nombre = e.target.value;
        this.setState(() => ({ nombre }))
    }
    onApellidosChange = (e) => {
        const apellidos = e.target.value;
        this.setState(() => ({ apellidos }))
    }

    onPasswordChange = (e) => {
        const password = e.target.value;
        this.setState(() => ({ password }))
    }
    onConfirmPassChange = (e) => {
        const confirm_pass = e.target.value;
        this.setState(() => ({ confirm_pass }))
    }

    onUsuarioChange = (e) => {
        const usuario = e.target.value;
        this.setState(() => ({ usuario }))
    }
    handleTypeUser = (tipo_usuario) => {
        this.setState(() => ({
            tipo_usuario
        }))
        
        if(tipo_usuario==1){
            
            if(this.state.tipo_programa.length<5){
                let newData = [...this.state.tipo_programa,{id: "0", programa_nombre: "Administrador"}];
                this.setState({tipo_programa:newData});
            }
            this.setState({programa:0});
            document.querySelector("#selectProg").disabled=true;
        }else{

            let newData = this.state.tipo_programa.filter(el=>(el.id!=0));
            this.setState({tipo_programa:newData});

            document.querySelector("#selectProg").disabled=false;
            this.setState({programa:""});
        }
    }
    //Funcion para agregar usuarios
    addNewUser = () =>{
        const json = {
            nombre:this.state.nombre,
            apellidos:this.state.apellidos,
            usuario:this.state.usuario,
            password:this.state.password,
            confirm_pass:this.state.confirm_pass,
            tipo_usuario:this.state.tipo_usuario,
            programa:this.state.programa,
            fecha_registro:moment(new Date).format("YYYY/MM/DD")
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
                        console.log(data);
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
        const url = `${constantes.PATH_API}programas.php`;
        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{
            this.setState(()=>({tipo_programa:data}));
        });
    }

    //Obtener valor del combobox
    onProgramaChange = (e) => {
        const programa = e.target.value;
        this.setState(() => ({ programa }))
    }

    verPassword=(campo)=>{
        let tipo = document.querySelector(`#${campo}`);
        if(tipo.type=="password"){
            tipo.type = "text";
        }else{
            tipo.type = "password";
        }

        if(campo=="conf-password"){
            this.setState(()=>({viewPass2:!this.state.viewPass2}));
        }else{
            this.setState(()=>({viewPass1:!this.state.viewPass1}));
        }
            
    }

    render(){
      
        return(
            <div className="formAddUser">
                <h3>Nuevo Usuario </h3>
                <div className="form-item morespace">
                    <label>Nombre(s): </label>
                    <input type='text' id="nombre" name="nombre" className="text50" onChange={this.onNombreChange} value={this.state.nombre}></input>
                </div>
                <div className="form-item morespace">
                    <label>Apellidos: </label>
                    <input type='text' id="apellidos" name="apellidos" className="text50" onChange={this.onApellidosChange} value={this.state.apellidos}></input>
                </div>
                <div className="form-item morespace">
                    <label>Nombre de usuario: </label>
                    <input type='text' id="usuario" name="usuario" className="text50" onChange={this.onUsuarioChange} value={this.state.usuario}></input>
                </div>
                <div className="form-item">
                    <label>Contraseña: </label>
                    <input type='password' id="password" name="password" className="campoPass" onChange={this.onPasswordChange} value={this.state.password}></input>
                    <button className="verPass" onClick={()=>(this.verPassword("password"))}>
                        {!this.state.viewPass1?<FontAwesomeIcon icon={faEyeSlash}/>:<FontAwesomeIcon icon={faEye} />}
                    </button>
                </div>
                <div className="form-item">
                    <label>Confirmar contraseña: </label>
                    <input type='password' id="conf-password" name="conf-password" className="campoPass" onChange={this.onConfirmPassChange} value={this.state.confirm_pass}></input>
                    <button className="verPass" onClick={()=>(this.verPassword("conf-password"))}>
                        {!this.state.viewPass2?<FontAwesomeIcon icon={faEyeSlash}/>:<FontAwesomeIcon icon={faEye} />}
                    </button>
                </div>
                <div className="form-item morespace">
                    <label>Tipo de usuario: </label>
                    <div className="radios">
                        <div className="radio-item">
                            <input type="radio" value="0" name="tipo-usuario" id="check0" onClick={() => { this.handleTypeUser(0) }} ></input>
                            <label htmlFor="check0">Coordinador</label>
                        </div>
                       
                        <div className="radio-item">
                            <input type="radio" value="1" name="tipo-usuario" id="check1" onClick={() => { this.handleTypeUser(1) }}></input>
                            <label htmlFor="check1">Administardor</label>
                        </div>
                    </div>
                </div>
                <br/>
                <div className="form-item morespace">
                        <label className="morespace">Programa: </label>
                        <select name="tipo-programa" className="morespace" id="selectProg" onChange={this.onProgramaChange} value={this.state.programa}>
                            {this.state.tipo_programa.map(
                                (tipo,index)=>{
                                    return(<option key={index} value={tipo.id} >{`${tipo.programa_nombre}`}</option>);
                                }
                            )
                            }
                            <option key={500000} value="">Seleccione una opcion</option>
                        </select>
                </div>          

                <div className="btnBox smallbtn morespace">
                    <button className="registerBack nomargin" onClick={this.addNewUser}>Registrar</button>
                    <button className="registerBack nomargin">Cancelar</button>
                </div>
            </div>
        );
    }
}
export default FormAddUser;