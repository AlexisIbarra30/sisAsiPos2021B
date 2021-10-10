import React from 'react';
import * as constantes from '../Constantes';

export default class FooterItem extends React.Component {
    state={
        newNombre:this.props.nombre,
        newDato:this.props.dato
    }

    //Captura de nueva información
    onNombreChange = (e) => {
        const newNombre = e.target.value;
        this.setState(() => ({ newNombre }))
    }
    onDatoChange = (e) => {
        const newDato = e.target.value;
        this.setState(() => ({ newDato }))
    }

    //Funciones para modificar datos
    editarInfo =()=>{
        document.querySelector('#nombre'+this.props.numero).disabled=false;
        document.querySelector('#dato'+this.props.numero).disabled=false;
        document.querySelector('#editar'+this.props.numero).style = "display:none";
        document.querySelector('#eliminar'+this.props.numero).style = "display:none";
        document.querySelector('#guardar'+this.props.numero).style = "display:in-line";
        document.querySelector('#cancelar'+this.props.numero).style = "display:in-line";
    }

    guardar=()=>{
        //Proceso de actualizado en BD
        if(this.props.nombre.trim() !== this.state.newNombre.trim() || this.props.dato.trim() !== this.state.newDato.trim()){
            //Si no son los mismos valores con los que comenzamos, solo bloquea los campos
            //Verificamos ahora que no vengan campos vacios
            if(this.state.newNombre.trim()!=='' && this.state.newDato.trim()!==''){
                //Confirmar los cambios antes de guardar en BD
                let confirmar = window.confirm("¿Guardar cambios nuevos?\n"+this.state.newNombre+': '+this.state.newDato);
                if(confirmar){
                    //Actualizar base de datos
                    const url = `${constantes.PATH_API}modifFooter.php`;
                    var json={
                        nombre:this.state.newNombre,
                        valor:this.state.newDato,
                        bdid:this.props.bdid
                    }

                    fetch(url,{
                        method:'POST',
                        mode:'cors',
                        body:JSON.stringify(json)
                    }).then(response=>response.text())
                    .then(datos=>{
                        alert("Datos configurados correctamente. Actualice la pagina (F5) para comprobar los cambios.");
                        document.querySelector('#nombre'+this.props.numero).disabled=true;
                        document.querySelector('#dato'+this.props.numero).disabled=true;
                        document.querySelector('#guardar'+this.props.numero).style = "display:none";
                        document.querySelector('#cancelar'+this.props.numero).style = "display:none";
                        document.querySelector('#editar'+this.props.numero).style = "display:in-line";
                        document.querySelector('#eliminar'+this.props.numero).style = "display:in-line";
                    })
                }

            }else{
                alert('Por favor no deje campos vacios');
            }


        }else{
            document.querySelector('#nombre'+this.props.numero).disabled=true;
            document.querySelector('#dato'+this.props.numero).disabled=true;
            document.querySelector('#guardar'+this.props.numero).style = "display:none";
            document.querySelector('#cancelar'+this.props.numero).style = "display:none";
            document.querySelector('#editar'+this.props.numero).style = "display:in-line";
            document.querySelector('#eliminar'+this.props.numero).style = "display:in-line";
        }

        
        
    }

    eliminar =()=>{
        let confirmar=window.confirm("¿Desea eliminarlo del pie de pagina?");
        if(confirmar){
            var json ={
                bdid:this.props.bdid,
                eliminar:true
            }
            const url = `${constantes.PATH_API}modifFooter.php`;
            fetch(url,{
                method:'POST',
                mode:'cors',
                body:JSON.stringify(json)
            }).then(res=>res.text())
            .then(data=>{
                console.log(data);
                this.props.componentDidMount();
                alert("Eliminado correctamente. Actualice la pagina (F5) para comprobar los cambios.");
            })
        }
    }

    cancelar =()=>{
        this.setState(() => ({newNombre:this.props.nombre,newDato:this.props.dato}));
        document.querySelector('#nombre'+this.props.numero).disabled=true;
        document.querySelector('#dato'+this.props.numero).disabled=true;
        document.querySelector('#guardar'+this.props.numero).style = "display:none";
        document.querySelector('#cancelar'+this.props.numero).style = "display:none";
        document.querySelector('#editar'+this.props.numero).style = "display:in-line";
        document.querySelector('#eliminar'+this.props.numero).style = "display:in-line";
    }


    render(){
        return( 
            <div className="seccion-item ">
                <input type="text" name={'nombre'+this.props.numero} id={'nombre'+this.props.numero} value={this.state.newNombre} disabled onChange={this.onNombreChange}/>
                <input type="text" name={'dato'+this.props.numero} id={'dato'+this.props.numero} value={this.state.newDato} disabled onChange={this.onDatoChange}/>
                <input type="button" name={'guardar'+this.props.numero} id={'guardar'+this.props.numero} value="Guardar" onClick={this.guardar} style={{display:'none'}}/>
                <input type="button" name={'cancelar'+this.props.numero} id={'cancelar'+this.props.numero} value="Cancelar" onClick={this.cancelar} style={{display:'none'}}/>
                <input type="button" name={'editar'+this.props.numero} id={'editar'+this.props.numero} value="Editar" onClick={this.editarInfo}/>
                <input type="button" name={'eliminar'+this.props.numero} id={'eliminar'+this.props.numero} value="Eliminar" onClick={this.eliminar}/>
                
            </div>
        );
    }
    
}
