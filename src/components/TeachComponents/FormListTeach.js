import React from 'react';
import * as constantes from '../Constantes';
import CentralLoader from '../CentralLoader';

export class FormListTeach extends React.Component{

    state = {
        usuarios:[],
        currentUser:JSON.parse(sessionStorage.getItem("USER")),
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
            this.setState(()=>({usuarios:data}));
            this.setState({ready:true});
        });
        //console.log(this.state.currentUser);
        
    }

    eliminarUser=(e,id)=>{
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
                            <h3> Profesor</h3>
                            <h3> Nombre completo</h3>
                            <h3> Nombre de Usuario </h3>
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
                                                        <h3> {user.usuario} </h3>
                                                        <h3> {user.programa_nombre} </h3>
                                                        <div className="buttonBorrar">
                                                            {this.state.currentUser.nombre!=user.nombre&&this.state.currentUser!=user.apellidos?<button  onClick={(e)=>this.eliminarUser(e,user.id)}>Borrar</button>:<span>Sesión actual</span>}
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

export default FormListTeach;