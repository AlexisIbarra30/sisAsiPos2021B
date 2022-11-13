import React from 'react';
import * as constantes from './Constantes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash,faCamera,faCheckCircle,faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';


export default class UserAccount extends React.Component{
    state={
        id:JSON.parse(sessionStorage.getItem("USER")).id,
        nombre:JSON.parse(sessionStorage.getItem("USER")).nombre,
        apellidos:JSON.parse(sessionStorage.getItem("USER")).apellidos,
        programa:JSON.parse(sessionStorage.getItem("USER")).programa,
        fecha_registro:JSON.parse(sessionStorage.getItem("USER")).fecha_registro,
        opciones:{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        current_foto_url:JSON.parse(sessionStorage.getItem("USER")).picture_url,
        preview_foto_url:JSON.parse(sessionStorage.getItem("USER")).picture_url,
        render_btn:false,
        view_changePass:false,
        viewPass1:false,
        viewPass2:false,
        viewPass3:false,
        pass1:"",
        pass2:"",
        pass3:""
    }

    handleViewCP=()=>{
        this.setState({view_changePass:!this.state.view_changePass});
    }

    onPs1Change=(e)=>{
        let pass1 = e.target.value;
        this.setState({pass1});
    }
    onPs2Change=(e)=>{
        let pass2 = e.target.value;
        this.setState({pass2});
    }
    onPs3Change=(e)=>{
        let pass3 = e.target.value;
        this.setState({pass3});
    }


    verPassword=(campo)=>{
        let tipo = document.querySelector(`#${campo}`);
        if(tipo.type=="password"){
            tipo.type = "text";
        }else{
            tipo.type = "password";
        }
        
        if(campo==="a-pass"){
            this.setState({viewPass1:!this.state.viewPass1});
        }
        if(campo==="n-pass"){
            this.setState({viewPass2:!this.state.viewPass2});
        }
        if(campo==="conf-n-pass"){
            this.setState({viewPass3:!this.state.viewPass3});
        }
            
    }


    modifPassword =()=>{
        const json = {
            a_pass:this.state.pass1,
            n_pass:this.state.pass2,
            id:this.state.id,
            op:"1",
            currentDate:new moment().format("YYYY-MM-DD")
        } 
        //Verificamos que no sean campos vacios
        if(json.a_pass.trim()!=="" && json.n_pass.trim()!==""){
            if(json.n_pass!==this.state.pass3){
                //Verificamos que las contraseñas nuevas no sean iguales
                alert("Verifique que la nueva contraseña y la confirmación sean iguales");
            }else{
                //Genereamos la consulta a la API
                console.log(json);
                const url = `${constantes.PATH_API}configAccount.php`;
                fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    body: JSON.stringify(json)
                })
                .then(res=>res.json())
                .then(data=>{
                    if(data.respuesta=="correcto"){
                        alert("Contraseña actualizada correctamente");
                        this.setState({
                            pass1:"",
                            pass2:"",
                            pass3:""
                        });
                    
                    }
                    if(data.respuesta=="error password"){
                        alert("La contraseña actual no es correcta. Volver a verificar.");
                    }
                    if(data.respuesta=="error update"){
                        alert("Error al actualizar. Intente más tarde.");
                    }
                    console.log(data);
                });
            }
        }else{
            alert("Por favor llenar todos los campos");
        }
    }

    onPictureChange=async(e)=>{
        let nombreImg = e.target.files[0];
        let imgUrl = (URL.createObjectURL(nombreImg));
        await this.setState({preview_foto_url:imgUrl});
        if(this.state.preview_foto_url!=this.state.current_foto_url){
            this.setState({render_btn:true});
        }
    }

    onCancelHandle=()=>{
        this.setState({preview_foto_url:this.state.current_foto_url,render_btn:false});
    }

    onConfirmHandle=()=>{

        let a = window.confirm("¿Cambiar foto de perfil?");
        if(a){
            let form_img = document.querySelector("#form_img");
            let data = new FormData(form_img);
            data.append("id",this.state.id);
            //Preparamos peticion al servidor
            const url = `${constantes.PATH_API}changePicture.php`;
            fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: data
            })
                .then(res=>res.json())
                .then(resultado=>{
                    if(resultado.respuesta=="correcto"){
                        let limite = resultado.nueva_ruta.length;
                        let ruta = resultado.nueva_ruta;
                        this.setState({current_foto_url:ruta,preview_foto_url:ruta,render_btn:false});
                        //Cambiamos sessionStorage
                        let respaldo = JSON.parse(sessionStorage.getItem("USER"));
                        respaldo.picture_url = this.state.current_foto_url;
                        sessionStorage.setItem("USER",JSON.stringify(respaldo));
                        alert("Foto cambiada correctamente");
                        window.location.reload();
                    }
                });
                
        }
    }

    render(){
        return(
            <div className="userConfig-container">
                <h3>Configuración de la cuenta</h3>
                <div className="userConfig">
                    <div className="userConfig-info">
                        <div className="userConfig-picture" style={{backgroundImage:`url(${this.state.preview_foto_url})`, backgroundRepeat:"no-Repeat",backgroundPosition:"center",backgroundSize:"cover"}}>
                            <form className="modal" id="form_img">
                                <FontAwesomeIcon icon={faCamera} className="icono-foto"/>
                                <span>Cambiar fotografía</span>
                                <input type="file" name="imagen" className="inputfile-picture" title="Cambiar foto" accept=".png, .jpg, .jpeg" onChange={this.onPictureChange}/>
                            </form>
                        </div>
                        {this.state.render_btn&&
                        <div className="btn-picture">
                            <span className="confirm-picture" onClick={this.onConfirmHandle}><FontAwesomeIcon icon={faCheckCircle} /></span>
                            <span className="cancel-picture" onClick={this.onCancelHandle}><FontAwesomeIcon icon={faTimesCircle} /></span>
                        </div>}
                        <div className="userConfig-data">
                            <div className="item">
                                <span>Nombre: </span>
                                <span>{`${this.state.nombre} ${this.state.apellidos}`}</span>
                            </div>
                            <div className="item">
                                <span>Programa: </span>
                                <span>{`${this.state.programa}`}</span>
                            </div>
                            <div className="item">
                                <span>Cuenta creada el: </span>
                                <span>{new Date(this.state.fecha_registro).toLocaleDateString("es-ES",this.state.opciones)}</span>
                            </div>
                            <div className="userConfig-opciones">
                                <div>
                                    {!this.state.view_changePass&&<input type="button" className="registerBack small-btn" value="Cambiar contraseña" onClick={this.handleViewCP}/>}
                                </div>
                            </div>
                        </div>   
                    </div>
                   
                    <hr/>
                    {this.state.view_changePass &&
                    <div className="formChangePass">
                        <h3>Cambiar contraseña</h3>
                        <div className="item">
                            <label>Contraseña actual </label>
                            <input type="password" id="a-pass" onChange={this.onPs1Change}/>
                            <button className="verPass"  onClick={()=>(this.verPassword("a-pass"))}>
                                {!this.state.viewPass1?<FontAwesomeIcon icon={faEyeSlash}/>:<FontAwesomeIcon icon={faEye} />}
                            </button>
                        </div>
                        <div className="item">
                            <label>Nueva contraseña </label>
                            <input type="password" id="n-pass" onChange={this.onPs2Change}/>
                            <button className="verPass"  onClick={()=>(this.verPassword("n-pass"))}>
                                {!this.state.viewPass2?<FontAwesomeIcon icon={faEyeSlash}/>:<FontAwesomeIcon icon={faEye} />}
                            </button>
                        </div>
                        <div className="item">
                            <label>Confirmar contraseña </label>
                            <input type="password" id="conf-n-pass" onChange={this.onPs3Change}/>
                            <button className="verPass" onClick={()=>(this.verPassword("conf-n-pass"))}>
                                {!this.state.viewPass3?<FontAwesomeIcon icon={faEyeSlash}/>:<FontAwesomeIcon icon={faEye} />}
                            </button>
                        </div>
                        <div className="formChangePass-buttons">
                            <input type="button" className="registerBack small-btn" value="Confirmar" onClick={this.modifPassword}/>
                            <input type="button" className="registerBack small-btn" value="Cancelar" onClick={this.handleViewCP}/>
                        </div>
                        
                    </div>
                    }

                </div>
            </div>
        );
    };
}