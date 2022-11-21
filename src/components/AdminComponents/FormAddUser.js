import React from 'react';
import * as constantes from '../Constantes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { encuentraExpres, expres, validaExpres, validaUsuario } from '../Validadiones';
export class FormAddUser extends React.Component{
    
    state = {
        nombre:"",
        apellidos:"",
        usuario:"",
        password:"",
        correo:"",
        confirm_pass:"",
        programa:"",
        tipo_programa:[],
        viewPass1:false,
        viewPass2:false,
        nError:"",
        aError:"",
        uError:"",
        pError:"",
        cError:"",
    }

    //Limpiar state
    limpiarState=()=>{
        this.setState(()=>({
            nombre:"",
            apellidos:"",
            usuario:"",
            password:"",
            correo:"",
            confirm_pass:"",
            programa:"",
            nError:"",
            aError:"",
            uError:"",
            pError:"",
            cError:"",
        }));
    }
    //Captura de datos 
    onNombreChange = (e) => {
        const nombre = e.target.value;
        let mensaje="";

        validaExpres(expres.nombres,nombre)?mensaje="":
        mensaje="Solo incluir letras, los nombres inician con mayuscula y se separan por un unico espacio.";


        this.setState(() => ({
            nombre:nombre,
            nError:mensaje
        }));
    }

    //Captura de datos 
    onCorreoChange = (e) => {
        const correo = e.target.value;
        let mensaje="";

        validaExpres(expres.correos,correo)?mensaje="":
        mensaje="El correo ingresado debe tener un formato valido. Por ejemplo: correo@gmail.com";


        this.setState(() => ({
            correo:correo,
            cError:mensaje
        }));
    }

    onApellidosChange = (e) => {
        const apellidos = e.target.value;
        let mensaje="";
        validaExpres(expres.nombres,apellidos)?mensaje="":
        mensaje="Solo incluir letras, los apellidos inician con mayuscula y se separan por un unico espacio.";
        this.setState(() => ({
            apellidos:apellidos,
            aError:mensaje
        }));
    }

    onPasswordChange = (e) => {
        const password = e.target.value.trim();
        let mensaje="";
        let valido = validaExpres(expres.contra,password);

        if(valido && password.length>=8){
            mensaje="";
        }else{
            password.length>0?
            mensaje="Debe incluir al menos, tres minúsculas, dos mayúsculas, un carácter especial (!@#$&*) y dos dígitos. Longitud mínima de 12 caracteres.":
            mensaje=""
        }

        this.setState(() => ({ 
            password:password,
            pError:mensaje 
        }))
    }
    onConfirmPassChange = (e) => {
        const confirm_pass = e.target.value.trim();
        this.setState(() => ({ confirm_pass }))
    }

    onUsuarioChange = (e) => {
        const usuario = e.target.value.trim();
        let mensaje="";
        let valido = validaExpres(expres.nombres_usuario,usuario);
        /*mensaje="Incluir al menos una: minuscula, mayuscula, punto o guión. Longitud: 8 caracteres.";*/
        if(valido && usuario.length>=8){
            mensaje="";
        }else{
            usuario.length>0?
            mensaje="Combinar minusculas, mayusculas, puntos y/o guiones. Longitud: 8 a 15 caracteres.":
            mensaje=""
        }
        this.setState(() => ({ 
            usuario:usuario,
            uError:mensaje
        }))
    }
    /*handleTypeUser = (tipo_usuario) => {
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
    }*/
    //Funcion para agregar usuarios
    addNewUser = () =>{
        const json = {
            nombre:this.state.nombre,
            apellidos:this.state.apellidos,
            usuario:this.state.usuario,
            password:this.state.password,
            confirm_pass:this.state.confirm_pass,
            programa:this.state.programa,
            correo:this.state.correo,
            fecha_registro:moment(new Date).format("YYYY/MM/DD"),
        }
        
        if(json.nombre.trim()==="" || json.apellidos.trim()==="" || json.usuario.trim()===""||json.password.trim()===""||json.confirm_pass.trim()===""||json.programa===""){
            alert("Por favor no dejar campos en blanco");
        }else{

            //       nError:"",

            if (this.state.nError === "" && this.state.aError === "" && this.state.uError === "" && this.state.pError === "" && this.state.cError === ""){

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
                                //Escribimos la actividad en un log
                                let options = {weekday: "long", year: "numeric", month: "long", day: "numeric"}
                                let user = JSON.parse(sessionStorage.getItem("USER"));
                                let registro = {
                                    "usuario":user.nombre+" "+user.apellidos,
                                    "programa":user.programa,
                                    "accion":"Alta de usuario",
                                    "fecha":new Date().toLocaleDateString("es-ES", options)+" - "+new Date().toLocaleTimeString(),
                                    "extras":[`Nombre: ${json.nombre+' '+json.apellidos}`,`Correo:${json.correo}`]
                                }

                                const url = `${constantes.PATH_API}registraLog.php`;
                                fetch(url,{
                                    method:'POST',
                                    body: JSON.stringify(registro)
                                }).then(resp =>resp.text());
                                //Fin del log
                                
                                this.limpiarState();
                            }else{
                                
                                mensaje="Ya existe cuenta para "+this.state.nombre+" "+this.state.apellidos;
                            }
                            alert(mensaje);
                            
                        }

                    );

                }else{
                    alert("Las contraseñas no coinciden.");
                }
            } else {
                alert("Verifica que los campos sean correctos.");
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
            let newData = this.state.tipo_programa.filter(el=>(el.id!=0));
            this.setState({tipo_programa:newData.sort()});
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
                <div className="morespace withMessage">
                    <div className='withMessageContent'>
                        <label>Nombre(s): </label>
                        <input type='text' id="nombre" name="nombre" className="text50" onChange={this.onNombreChange} value={this.state.nombre}></input>
                    </div>
                   
                    <span className='msgErrorForm'>{this.state.nError}</span>
                </div>
                <div className="morespace withMessage">
                    <div className='withMessageContent'>
                        <label>Apellidos: </label>
                        <input type='text' id="apellidos" name="apellidos" className="text50" onChange={this.onApellidosChange} value={this.state.apellidos}></input>
                    </div>
                    
                    <span className='msgErrorForm'>{this.state.aError}</span>
                </div>
                <div className="morespace withMessage">
                    <div className='withMessageContent'>
                        <label>Correo electrónico:: </label>
                        <input type='text' id="correo" name="correo" className="text50" onChange={this.onCorreoChange} value={this.state.correo}></input>
                    </div>
                    
                    <span className='msgErrorForm'>{this.state.cError}</span>
                </div>
                <div className="morespace withMessage">
                    <div className='withMessageContent'>
                        <label>Nombre de usuario: </label>
                        <input type='text' id="usuario" name="usuario" className="text50" onChange={this.onUsuarioChange} value={this.state.usuario}></input>
                    </div>
                    
                    <span className='msgErrorForm'>{this.state.uError}</span>
                </div>
                <div className="withMessage">
                    <div className="withMessageContent">
                        <label>Contraseña: </label>
                        <input type='password' id="password" name="password" className="campoPass" onChange={this.onPasswordChange} value={this.state.password}></input>
                        <button className="verPass" onClick={()=>(this.verPassword("password"))}>
                            {!this.state.viewPass1?<FontAwesomeIcon icon={faEyeSlash}/>:<FontAwesomeIcon icon={faEye} />}
                        </button>
                    </div>
                    
                    <span className='msgErrorForm'>{this.state.pError}</span>
                </div>
                <div className="form-item">
                    <label>Confirmar contraseña: </label>
                    <input type='password' id="conf-password" name="conf-password" className="campoPass" onChange={this.onConfirmPassChange} value={this.state.confirm_pass}></input>
                    <button className="verPass" onClick={()=>(this.verPassword("conf-password"))}>
                        {!this.state.viewPass2?<FontAwesomeIcon icon={faEyeSlash}/>:<FontAwesomeIcon icon={faEye} />}
                    </button>
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