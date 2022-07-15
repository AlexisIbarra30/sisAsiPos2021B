import React from 'react';
import * as constantes from '../Constantes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle} from '@fortawesome/free-solid-svg-icons';


class AssignGroups extends React.Component{
    state={
        grupos:[],
        alumnos:[],
        grupo:"",
        inscritos:[],
        alumno:""
    }

    //Llenamos los combos necesarios 
    componentDidMount=()=>{
        //Llenamos alumnos
        let url = `${constantes.PATH_API}alumnosMan.php`;
        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{
            this.setState(()=>({alumnos:data}));
        });

        //Llenamos grupos
        url = `${constantes.PATH_API}grupos.php`;
        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{
            this.setState(()=>({grupos:data}));
        });

    }


    //Obtener valor del combobox
    onGrupoChange = (e) => {
        const grupo = e.target.value;
        this.setState(() => ({ grupo }))
    }

    onHoraInChange=(e)=>{
        const hora_inicio = e.target.value;
        this.setState(()=>({hora_inicio}));
    }
    onAlumnChange=(e)=>{
        const alumno = e.target.value;
        this.setState(()=>({alumno}));
    }
    onHoraFinChange=(e)=>{
        const hora_fin = e.target.value;
        this.setState(()=>({hora_fin}));
    }

    //Agregar alumno al grupo
    addAlumnToGroup=()=>{

        //Primero verificar que no se ha agregado antes
        let existe = this.state.inscritos.filter((item)=>item.id==this.state.alumno);

        if(existe.length<1){
            //Se agrega al estado
            let temp = [...this.state.inscritos,];
            this.state.alumnos.forEach(
                (e)=>{
                    if(e.id==this.state.alumno){
                        temp.push(e);
                    }
                }
            );
            this.setState(()=>({inscritos:temp}));
        }else{
            alert("Ya ha agregado al alumno al grupo.");
            
        }
        
        

    }

    quitarAlumn=(id)=>{
        let temp = this.state.inscritos.filter((item)=>item.id!=id);
        this.setState(()=>({inscritos:temp}));
    }


    //Agregar nuevo horario
    addNewGroups=()=>{
        
        let json = {
            id_grupo: this.state.grupo,
            alumnos:this.state.inscritos
        }

        if(json.id_grupo.trim()==="" || json.alumnos.length<1){
            alert("Por favor no dejar campos en blanco");
        }else{
            let c = window.confirm("¿Confirmar asignación de grupo?");
            if(c){
                const url = `${constantes.PATH_API}assignGroups.php`;
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
                        }
                        alert(mensaje);
                        this.setState({
                            grupo:"",
                            inscritos:[],
                            alumno:""
                        });
                    }
                );
            }
            
            
        }

    }

 

    render(){

        return(
            <>
                <h4>Asignar grupos</h4>
                <div className="FormAddGroup">

                    <span className="mensaje-form">Seleccione un grupo y a los alumnos que se agregarán.</span>
                    <div className="form-item">
                        <label>Seleccione un grupo: </label>
                        <select name="selectGrupo" id="selectGrupo" onChange={this.onGrupoChange} value={this.state.grupo}>
                            {this.state.grupos.map(
                                (grupo,index)=>{
                                    return(<option key={index} value={grupo.grupoID} >{`${grupo.grupoNombre}`}</option>);
                                }
                            )
                            }
                            <option key={500000} value="">Seleccione una opcion</option>
                        </select>
                    </div>

                    <div className="form-item">
                        <div className="selecAlumnos">
                            <label>Agregar alumnos:</label>
                            <select name="selectAlum"  id="selectAlum" onChange={this.onAlumnChange} value={this.state.alumno}>
                                {this.state.alumnos.map(
                                    (alumno,index)=>{
                                        return(<option key={index} value={alumno.id} >{`${alumno.nombres} ${alumno.apePaterno} ${alumno.apeMaterno}`}</option>);
                                    }
                                )
                                }
                                <option key={500000} value="">Seleccione una opcion</option>
                            </select>

                        </div>

                        <div className="botones">
                            <button className="registerBack" onClick={this.addAlumnToGroup}>Agregar</button>
                        </div>
                            
                            
                    </div>
                    
                    <div className="inscritos" id="cajaInscritos">

                        {this.state.inscritos.length==0?(<span>No ha agregado a ningun alumno</span>):(

                            this.state.inscritos.map((al,index)=>{
                                return(
                                    <div className="inscritoItem" key={index}>
                                        <div className="info">
                                            <span>{`${al.nombres} ${al.apePaterno} ${al.apeMaterno}`}</span>
                                            <span>{al.programa}</span>
                                        </div>
                                        <div className="botones">
                                            <button title="Eliminar" onClick={()=>(this.quitarAlumn(al.id))}>
                                                <FontAwesomeIcon icon={faMinusCircle}/>
                                            </button>
                                        </div>
                                        
                                    </div>
                                );
                            }
                            )
                        )}

                    </div>



                    <div className="btnBox smallbtn morespace">
                        <button className="registerBack nomargin" onClick={this.addNewGroups}>Registrar</button>
                        <button className="registerBack nomargin">Cancelar</button>
                    </div>          

                </div>
            </>
        );
    }

}

export default AssignGroups;