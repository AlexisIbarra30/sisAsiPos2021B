import React from 'react';
import * as constantes from '../Constantes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import CentralLoader from '../CentralLoader';
export class FormModifUser extends React.Component{
    
    state = {
        nombre:"",
        apellidos:"",
        usuario:"",
        password:"",
        tipo_usuario:"",
        usuarios:[],
        sendId:"",
        viewPass:false,
        programa:"",
        tipo_programa:[],
        ready:false
    }

    componentDidMount = ()=>{
        this.setState({ready:false});
        const url = `${constantes.PATH_API}usuarios.php`;
        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{
            let currentUser = JSON.parse(sessionStorage.getItem("USER"));
            let newData = data.filter(el=>(el.nombre!==currentUser.nombre && el.apellidos!==currentUser.apellidos));
            this.setState(()=>({usuarios:newData}));
        });
        
        const url2 = `${constantes.PATH_API}programas.php`;
        fetch(url2,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{
            this.setState(()=>({tipo_programa:data}));
            this.setState({ready:true})
        });
        
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

    buscarDato =(dato,json)=>{
        var regresa="";
        json.map((fila,index)=>{
            if(fila.id === dato){
                regresa=fila;
            }
        })
        return regresa;
    }

    onChangeSelect = (e) =>{
        const sendId = e.target.value;
        if(sendId == ""){
            this.setState(()=>({sendId:"",nombre:"",apellidos:"",usuario:"",password:"",tipo_usuario:"",programa:""}));
        }else{
            const nombre = this.buscarDato(sendId,this.state.usuarios).nombre;
            const apellidos= this.buscarDato(sendId,this.state.usuarios).apellidos;
            const usuario = this.buscarDato(sendId,this.state.usuarios).usuario;
            const password = this.buscarDato(sendId,this.state.usuarios).password;
            const tipo_usuario = parseInt(this.buscarDato(sendId,this.state.usuarios).tipo_usuario);
            const programa = this.buscarDato(sendId,this.state.usuarios).programa;
            this.setState(()=>({sendId:sendId,nombre:nombre,apellidos:apellidos,usuario:usuario,password:password,programa:programa}));
            this.setState(()=>({tipo_usuario}));

            if(tipo_usuario==1){
                document.querySelector("#selectProg").disabled=true;
            }else{
                document.querySelector("#selectProg").disabled=false;
            }

        }
        



    }

    modificaUser = ()=>{
        const json = {
            nombre:this.state.nombre,
            apellidos:this.state.apellidos,
            usuario:this.state.usuario,
            password:this.state.password,
            tipo_usuario:this.state.tipo_usuario,
            programa:this.state.programa,
            id:this.state.sendId
        }
        console.log(json);
        if(json.nombre.trim()==="" || json.apellidos.trim()==="" || json.usuario.trim()===""||json.password.trim()===""||json.id.trim()===""||json.programa===""){
            alert("Por favor no dejar campos en blanco");
        }else{
            const url = `${constantes.PATH_API}usuarios.php`;
            fetch(url,{
                method:'POST',
                body: JSON.stringify(json)
            })
            .then(res=>res.text())
            .then(
                (res2) =>{
                    var mensaje="";
                    console.log(res2);
                    if(res2==="correcto"){
                        mensaje="Modificado correctamente";
                    }
                    alert(mensaje);
                    let newUsers = this.state.usuarios.map(el=>el.id==json.id?json:el);
                    
                    this.setState({nombre:"",apellidos:"",usuario:"",password:"",tipo_usuario:"",programa:"", sendId:"",usuarios:newUsers});
                }

            );
        }
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
        this.setState(()=>({viewPass:!this.state.viewPass}));
    }

    render(){
        return(
            <div className="formModifUser">
                
                <h3>Modificar Usuario </h3>
                {!this.state.ready?<CentralLoader/>:
                <>
                    <div className="form-header">
                        <div className="buscaUser">
                            <label>Selecciona un usuario: </label>
                            <select name="user-to-modify" onChange={this.onChangeSelect} value={this.state.sendId}>
                                {this.state.usuarios.map(
                                    (user,index)=>{
                                        return(<option key={index} value={user.id} >{`${user.nombre} ${user.apellidos}`}</option>);
                                    }
                                )
                                }
                                <option key={500000} value="">Seleccione una opcion</option>
                            </select>
                        </div>
                    </div>
                    <div className="formAddUser modifuser">
                        <div className="form-item">
                            <label>Nombre(s): </label>
                            <input type='text' id="nombre" name="nombre" className="text50" onChange={this.onNombreChange} value={this.state.nombre}></input>
                        </div>
                        <div className="form-item">
                            <label>Apellidos</label>
                            <input type='text' id="apellidos" name="apellidos" className="text50" onChange={this.onApellidosChange} value={this.state.apellidos}></input>
                        </div>
                        <div className="form-item">
                            <label>Nombre de usuario: </label>
                            <input type='text' id="usuario" name="usuario" className="text50" onChange={this.onUsuarioChange} value={this.state.usuario}></input>
                        </div>
                        <div className="form-item">
                            <label>Contraseña: </label>
                            <input type='password' id="password" name="password" className="campoPass" onChange={this.onPasswordChange} value={this.state.password}></input>
                            
                            <button className="verPass" onClick={()=>(this.verPassword("password"))}>
                                {!this.state.viewPass?<FontAwesomeIcon icon={faEyeSlash}/>:<FontAwesomeIcon icon={faEye} />}
                            </button>
                        </div>
                        <div className="form-item">
                            <label>Tipo de usuario: </label>
                            <div className="radios">
                                <div className="radio-item">
                                    <input type="radio" value="0" name="tipo_usuario" checked={this.state.tipo_usuario===0?true:false} onClick={() => { this.handleTypeUser(0) }} id="radio0"></input>
                                    <label htmlFor="radio0">Coordinador</label>
                                </div>
                            
                                <div className="radio-item">
                                    <input type="radio" value="1" name="tipo_usuario"checked={this.state.tipo_usuario===1?true:false} onClick={() => { this.handleTypeUser(1) }} id="radio1"></input>
                                    <label htmlFor="radio1">Administardor</label>
                                </div>
                            </div>
                        </div>

                        <div className="form-item morespace">
                            <label className="morespace">Programa: </label>
                            <select name="tipo-programa" className="morespace"  id="selectProg" onChange={this.onProgramaChange} value={this.state.programa}>
                                {this.state.tipo_programa.map(
                                    (tipo,index)=>{
                                        return(<option key={index} value={tipo.id}>{`${tipo.programa_nombre}`}</option>);
                                    }
                                )
                                }
                                <option key={500000} value="">Seleccione una opcion</option>
                            </select>
                        </div>  

                        <div className="btnBox smallbtn">
                            <button className="registerBack nomargin" onClick={this.modificaUser}>Modificar</button>
                            <button className="registerBack nomargin">Cancelar</button>
                        </div>
                    </div>
                </>}
            </div>
        );

    }
}

export default FormModifUser;