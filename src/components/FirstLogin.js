import React, { useEffect, useState } from 'react';
import * as constantes from './Constantes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash,faCamera,faCheckCircle,faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { encuentraExpres, expres, validaExpres, validaUsuario } from './Validadiones';
import {history} from '../routers/AppRouter';
import CentralLoader from './CentralLoader';


const FirstLogin = (props) => {

  const [viewPass1,setViewPass1] = useState(false);
  const [viewPass2, setViewPass2] = useState(false);
  const [viewPass3, setViewPass3] = useState(false);

  const [p1,setP1] = useState("");
  const [p2,setP2] = useState("");
  const [p3, setP3] = useState("");
  //Mensajes error
  const [pError,setPError] = useState("");
  //Loader
  const [ready,setReady] = useState(1);

  

  const verPassword=(campo)=>{
      let tipo = document.querySelector(`#${campo}`);
      if(tipo.type=="password"){
          tipo.type = "text";
      }else{
          tipo.type = "password";
      }


      if(campo==="a-pass"){
          setViewPass3(!viewPass3);
      }
      if(campo==="n-pass"){
          setViewPass1(!viewPass1);
      }
      if(campo==="conf-n-pass"){
          setViewPass2(!viewPass2);
      }
        
  }
  //Change primera contraseña
  const onPs1Change=(e)=>{
    //Se aplican las validaciones de contraseña segura
    let pass1 = e.target.value.trim();
    let mensaje = "";
    let valido = validaExpres(expres.contra,pass1);

    if(valido && pass1.length>=8){
        mensaje="";
    }else{
        pass1.length>0?
        mensaje="Debe incluir al menos, tres minúsculas, dos mayúsculas, un carácter especial (!@#$&*) y dos dígitos. Longitud mínima de 12 caracteres.":
        mensaje=""
    }

    setP1(pass1);  
    setPError(mensaje);
  }
  //Change segunda contraseña
  const onPs2Change=(e)=>{
    //Las validaciones para confirmar que es igual al campo anterior se hacen antes del envio de datos
    let pass2 = e.target.value;
    setP2(pass2); 
  }

  const onPs3Change=(e)=>{
    //No se aplican validaciones de contraseña ya que ingresa la que fue dada por el administrador
    let pass3 = e.target.value;
    setP3(pass3);
  }


  //Modificar contraseña
  const updatePass=()=>{
    const json = {
      a_pass:p3,
      n_pass:p1,
      id:props.user.id,
      op:"1",
      currentDate:new moment().format("YYYY-MM-DD")
    }
    //Verificamos que no sean campos vacios
    if(json.a_pass.trim()!=="" && json.n_pass.trim()!==""){
      if(json.n_pass!==p2){
          //Verificamos que las contraseñas nuevas no sean iguales
          alert("Verifique que la nueva contraseña y la confirmación sean iguales");
      }else{

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
                  window.location.reload();
              
              }
              if(data.respuesta=="error password"){
                  alert("La contraseña actual no es correcta. Volver a verificar.");
              }
              if(data.respuesta=="error update"){
                  alert("Error al actualizar. Intente más tarde.");
              }
              if(data.respuesta=="error mismo password"){
                alert("La contraseña nueva debe ser diferente a la actual. Volver a verificar.")
              }

          });
      }
  }else{
      alert("Por favor llenar todos los campos");
  }
  }

  

  //Salir
  const handleClose = () => {
    let salir = window.confirm("¿Desea cerrar sesión?");

    if(salir){
        sessionStorage.clear();
        history.push('/');
    }
    
  }

  //Mensajes según motivo de cambio de contraseña
  const mostrarMensaje=(m)=>{
    if(m==1){
      //Primer inicio de sesión
      return <p>
      Es la primera vez que inicias sesión en el Sistema de Registro de Asistencias, por lo que deberás <b>cambiar la contraseña</b> que te fué dada por el administrador.
      Se recomienda el uso de <b>contraseñas seguras</b>, además de que puedas cambiarla por lo menos <b>cada 6 meses</b>.
      <br/><b>No podrás hacer uso del sistema hasta que confirmes una nueva contraseña.</b>
      </p>;
    }else{
      //Periodo de 6 meses
      return <p>
      Han pasado <b>6 meses</b> desde tu ultimo cambio de contraseña. Por seguridad, es necesario que <b>cambies tu contraseña nuevamente</b>.
      Se recomienda el uso de <b>contraseñas seguras</b>, además de que puedas cambiarla por lo menos <b>cada 6 meses</b>.
      <br/><b>No podrás hacer uso del sistema hasta que confirmes una nueva contraseña.</b>
      </p>;
    }

  }


  return (
    <div className='container'>
        {ready?<div className='panel vertical-fl'>
            <h3>¡Bienvenid@ {props.user.nombre} {props.user.apellidos}!</h3>
            <section className=''>
              {mostrarMensaje(props.mensaje)}
            </section>
            <section className='cambiarPass'>

              <div className="formChangePass">
                  <h3>Cambiar contraseña</h3>

                  <div className="item">
                            <label>Contraseña actual </label>
                            <input type="password" id="a-pass" onChange={onPs3Change}/>
                            <button className="verPass"  onClick={()=>(verPassword("a-pass"))}>
                                {!viewPass3?<FontAwesomeIcon icon={faEyeSlash}/>:<FontAwesomeIcon icon={faEye} />}
                            </button>
                  </div>

                  <div className="item ">
                      <label>Nueva contraseña </label>
                      <input type="password" id="n-pass" onChange={onPs1Change}/>
                      <button className="verPass"  onClick={()=>(verPassword("n-pass"))}>
                          {!viewPass1?<FontAwesomeIcon icon={faEyeSlash}/>:<FontAwesomeIcon icon={faEye} />}
                      </button>
                      <span className='msgErrorForm'>{pError}</span>
                  </div>
                  <div className="item">
                      <label>Confirmar contraseña </label>
                      <input type="password" id="conf-n-pass" onChange={onPs2Change}/>
                      <button className="verPass" onClick={()=>(verPassword("conf-n-pass"))}>
                          {!viewPass2?<FontAwesomeIcon icon={faEyeSlash}/>:<FontAwesomeIcon icon={faEye} />}
                      </button>
                  </div>
                  <div className="formChangePass-buttons">
                      <input type="button" className="registerBack small-btn" value="Confirmar contraseña" onClick={updatePass}/>
                      <input type="button" className="registerBack small-btn" value="Salir" onClick={handleClose}/>
                  </div>
                  
              </div>
    
            </section>
        </div>:<CentralLoader/>}
    </div>
  )
}

export default FirstLogin