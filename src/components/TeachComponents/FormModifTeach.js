import React from 'react';
import * as constantes from '../Constantes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import CentralLoader from '../CentralLoader';


export class FormModifTeach extends React.Component{
    
    state = {
        nombre:"",
        apellidos:"",
        usuario:"",
        password:"",
        usuarios:[],
        sendId:"",
        viewPass:false,
        tipo_programa:[],
        ready:false
    }

    componentDidMount = ()=>{
        this.setState({ready:false});
        const url = `${constantes.PATH_API}profesores.php`;
        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{
            let currentUser = JSON.parse(sessionStorage.getItem("USER"));
            let newData = data.filter(el=>(el.nombre!==currentUser.nombre && el.apellidos!==currentUser.apellidos));
            this.setState(()=>({usuarios:newData}));
            this.setState({ready:true});
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


    modificaUser = ()=>{
        const json = {
            nombre:this.state.nombre,
            apellidos:this.state.apellidos,
            usuario:this.state.usuario,
            password:this.state.password,
            tipo_usuario:2,
            programa:5,
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
                
                <h3>Modificar Profesor </h3>
                {!this.state.ready?<CentralLoader/>:
                <>
                    <div className="form-header">
                        <div className="buscaUser">
                            <label>Selecciona a un profesor: </label>
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

export default FormModifTeach;