import React from 'react';
import * as constantes from '../Constantes';
import FooterItem from './FooterItem';



export default class FormModifFooter extends React.Component {
    state = {
        datosFooter:[],
        nuevoNombre1:'',
        nuevoDato1:'',
        nuevoNombre2:'',
        nuevoDato2:''
    }

    //Para inputs de seccion 1
    onN1Change=(e)=>{
        const nuevoNombre1 = e.target.value;
        this.setState(() => ({ nuevoNombre1 }))
    }
    onN2Change=(e)=>{
        const nuevoNombre2 = e.target.value;
        this.setState(() => ({ nuevoNombre2 }))
    }

    onD1Change=(e)=>{
        const nuevoDato1 = e.target.value;
        this.setState(() => ({ nuevoDato1 }))
    }
    onD2Change=(e)=>{
        const nuevoDato2 = e.target.value;
        this.setState(() => ({ nuevoDato2 }))
    }




    //recuperar datos del footer desde la BD
    componentDidMount=()=>{
        const url = `${constantes.PATH_API}modifFooter.php`;
        fetch(url,{
            method:'GET',
            mode:'cors'
        }).then(res=>res.json())
        .then(resultado=>{
            this.setState(() => ({datosFooter:resultado}));
            
        });
    }

    getDatos = (m)=>{
        var datos = [];
        var i = 0;
        for(var pagina of this.state.datosFooter){
            if(pagina.mostrar==m){
                datos.push(
                    <FooterItem key={i} numero={i+1} nombre={pagina.nombre} dato={pagina.valor} bdid={pagina.id} componentDidMount={this.componentDidMount}/>
                )
            }
            i++;
        }
        return datos;
    }
    //Funcion para agregar nuevo campo al footer

    agregarNuevo1=()=>{
        
        var json ={
            nombre:this.state.nuevoNombre1,
            valor:this.state.nuevoDato1,
            mostrar:1
        }

        if(json.nombre.trim() === '' || json.valor.trim()===''){
            alert('Por favor no deje campos vacios');
        }else{
            //Enviar los datos para insertar en BD
            let confirmar=window.confirm("¿Desea guardar el nuevo dato de pie de pagina?");
            if(confirmar){
                const url = `${constantes.PATH_API}modifFooter.php`;
                fetch(url,{
                    method:'POST',
                    mode:'cors',
                    body:JSON.stringify(json)
                }).then(res=>res.text())
                .then(data =>{
                    if(data==="correcto"){
                        this.componentDidMount();
                        alert("Nuevo dato agregado correctamente.");
                    }else{
                        alert("Ya ha ingresado el nombre o URL en un campo anterior.");
                    }
                });
            }
        }
        
    }

    agregarNuevo3=()=>{
        
        var json ={
            nombre:this.state.nuevoNombre2,
            valor:this.state.nuevoDato2,
            mostrar:3
        }

        if(json.nombre.trim() === '' || json.valor.trim()===''){
            alert('Por favor no deje campos vacios');
        }else{
            //Enviar los datos para insertar en BD
            let confirmar= window.confirm("¿Desea guardar el nuevo dato de pie de pagina?");
            if(confirmar){
                const url = `${constantes.PATH_API}modifFooter.php`;
                fetch(url,{
                    method:'POST',
                    mode:'cors',
                    body:JSON.stringify(json)
                }).then(res=>res.text())
                .then(data =>{
                    if(data==="correcto"){
                        this.componentDidMount();
                        alert("Nuevo dato agregado correctamente.");
                    }else{
                        alert("Ya ha ingresado el nombre o URL en un campo anterior.");
                    }
                });
            }
        }
    }


    render(){

        var datos1=this.getDatos(1);
        var datos3=this.getDatos(3);

        return(
            <div className="form-container">
                <h3>Modificar pie de pagina</h3>
                <div className="seccion">
                    <div className="subtitulo"><h4>Información del sitio: </h4></div>
                    <div className="seccion-item subtitulos">
                        <span className="subtitulo">Nombre</span>
                        <span className="subtitulo">Direccion URL</span>
                    </div>
                    
                    {datos1}
                    <div className="caja-nuevo-dato">
                        <span className="agregar-titulo">Agregar nuevo: </span>
                        <label>Nombre:</label>
                        <input type="text" onChange={this.onN1Change} value={this.state.nuevoNombre1}/>
                        <label>Direccion URL:</label>
                        <input type="text" onChange={this.onD1Change} value={this.state.nuevoDato1}/>
                        <input type="button" value="Agregar" onClick={this.agregarNuevo1}/>
                    </div>

                </div>

                <div className="seccion">
                    <div className="subtitulo"><h4>Sitios de interes: </h4></div>
                    <div className="seccion-item subtitulos"><span className="subtitulo">Nombre</span><span span className="subtitulo">Direccion URL</span></div>
                    {datos3}
                    <div className="caja-nuevo-dato">
                        <span className="agregar-titulo">Agregar nuevo: </span>
                        <label>Nombre:</label>
                        <input type="text" onChange={this.onN2Change} value={this.state.nuevoNombre2}/>
                        <label>Direccion URL:</label>
                        <input type="text" onChange={this.onD2Change} value={this.state.nuevoDato2}/>
                        <input type="button" value="Agregar" onClick={this.agregarNuevo3}/>
                    </div>

                </div>
            </div>

        );
    }
}