import React from "react";
import * as constantes from '../Constantes';
import FormAddAssistMan from "./FormAddAssistMan";


export class ShowGroups extends React.Component{
    
    state = {
        grupos:[],
        user:JSON.parse(sessionStorage.getItem("USER")),
        renderComponent: ""
    }

    //Traer grupos que correspondan al profesor conectado
    componentDidMount=()=>{
        //Llenamos los grupos 
        let id = this.state.user.id;
        const url = `${constantes.PATH_API}addAssistMan.php?id=`+id;
        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(response => response.json())
        .then(data=>{
            this.setState(()=>({grupos:data}));
        });
    }

    //Render Handler
    renderHandler = (renderComponent,selected) => {
        this.setState(() => ({
            renderComponent,
        }));
    }

    render(){
        return(
            <>
                <h4>Mis grupos</h4>
                <div className="showGroups">
                    {this.state.renderComponent==""?(this.state.grupos.length<1?(<span>No tiene grupos asignados</span>):(
                        this.state.grupos.map(
                            (grupo,index)=>{
                                return(
                                    <div className="grupoItem" key={index}>
                                        <div className="info" key={index}>
                                            <h4>{grupo.nombre}</h4>
                                            <span>{grupo.descripcion}</span>
                                            <span>Fecha inicio: {grupo.fecha_inicio}</span>
                                            <span>Fecha fin: {grupo.fecha_fin}</span>
                                        </div>
                                        
                                        <div className="botones">
                                            <button className="registerBack nomargin" onClick={() => {this.renderHandler(
                                                e=>{
                                                    //Llamar al componente grupo donde se pasará asistencia
                                                    return(<FormAddAssistMan datos={grupo} renderHandler={this.renderHandler}/>);
                                                }
                                            )}}>Entrar</button>
                                        </div>
                                    </div>
                                );
                            }
                        )

                    )):(
                        <this.state.renderComponent/>
                    )}
                </div>
            </>
        );
    };

}

export default ShowGroups;