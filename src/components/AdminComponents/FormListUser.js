import React from 'react';
import * as constantes from '../Constantes';
import CentralLoader from '../CentralLoader';

export class FormListUser extends React.Component{

    state = {
        usuarios:[],
        currentUser:JSON.parse(sessionStorage.getItem("USER")),
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
            this.setState(()=>({usuarios:data}));
            this.setState({ready:true});
        });
        //console.log(this.state.currentUser);
        
    }

    eliminarUser=(e,id,usuario)=>{
        let c = window.confirm("¿Desea eliminar el usuario?");
        if(c){
            const url = `${constantes.PATH_API}usuarios.php?id=`+id;
            fetch(url,{
                method:'GET',
                mode:'cors'
            }).then(res=>res.text())
            .then(
                data=>{
                    this.componentDidMount();
                    //Escribimos la actividad en el log
                    let options = {weekday: "long", year: "numeric", month: "long", day: "numeric"}
                    let user = JSON.parse(sessionStorage.getItem("USER"));
                    let registro = {
                        "usuario":user.nombre+" "+user.apellidos,
                        "programa":user.programa,
                        "accion":"Eliminacion de usuario",
                        "fecha":new Date().toLocaleDateString("es-ES", options)+" - "+new Date().toLocaleTimeString(),
                        "extras":[`Nombre: ${usuario.nombre+' '+usuario.apellidos}`]
                    }

                    const url = `${constantes.PATH_API}registraLog.php`;
                    fetch(url,{
                        method:'POST',
                        body: JSON.stringify(registro)
                    }).then(resp =>resp.text());
                    //Fin de escritura del log
                    alert("Eliminado correctamente");
                }
            );
        }
        
    }

    

    render(){
        return(
            <div className="formListUser">
                <h3>Lista de Usuarios </h3>
                    <div className="tabla">
                        <div className='registerHEader textBold'>
                            <h3> Usuario</h3>
                            <h3> Nombre completo</h3>
                            <h3> Fecha de creación </h3>
                            <h3> Programa</h3>
                            <h3> Opciones</h3>
                        </div>
                        {!this.state.ready?<CentralLoader/>:
                            <>
                                <div className="tablaScroll"> 
                                    {this.state.usuarios.map(
                                            (user,index)=>{
                                                return(
                                                    <div className='registerHEader  regHeader equalWidth' key={index}>
                                                        <div className="foto">
                                                            <img src={user.picture_url}></img>
                                                        </div>
                                                        <h3> {user.nombre} {user.apellidos}</h3>
                                                        <h3> {user.fecha_registro} </h3>
                                                        <h3> {user.programa_nombre} </h3>
                                                        <div className="buttonBorrar">
                                                            {this.state.currentUser.nombre!=user.nombre&&this.state.currentUser!=user.apellidos?<button  onClick={(e)=>this.eliminarUser(e,user.id,user)}>Borrar</button>:<span>Sesión actual</span>}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )
                                    }
                                </div>
                            </>
                        }
                    </div>
                

            </div>
        );

    }
}

export default FormListUser;