import React from 'react';
import * as constantes from '../Constantes';

export default class ProgramsPage extends React.Component{
    state = {
        r1i:undefined,
        r1s:undefined,
        r2i:undefined,
        r2s:undefined,
        r3i:undefined,
        r3s:undefined,
        r4i:undefined,
        r4s:undefined
    }

    //Para actualizar valores de rangos
    onR1iChange = (e) => {
        const r1i = parseInt(e.target.value,10);
        this.setState(() => ({ r1i }));
        document.querySelector("#r1i").value=r1i;
    }
    onR1sChange = (e) => {
        const r1s = parseInt(e.target.value,10);
        this.setState(() => ({ r1s }));
        document.querySelector("#r1s").value=r1s;
    }

    onR2iChange = (e) => {
        const r2i = parseInt(e.target.value,10);
        this.setState(() => ({ r2i }));
        document.querySelector("#r2i").value=r2i;
    }
    onR2sChange = (e) => {
        const r2s = parseInt(e.target.value,10);
        this.setState(() => ({ r2s }));
        document.querySelector("#r2s").value=r2s;
    }

    onR3iChange = (e) => {
        const r3i = parseInt(e.target.value,10);;
        this.setState(() => ({ r3i }));
        document.querySelector("#r3i").value=r3i;
    }
    onR3sChange = (e) => {
        const r3s = parseInt(e.target.value,10);
        this.setState(() => ({ r3s }));
        document.querySelector("#r3s").value=r3s;
    }

    onR4iChange = (e) => {
        const r4i = parseInt(e.target.value,10);
        this.setState(() => ({ r4i }));
        document.querySelector("#r4i").value=r4i;
    }
    onR4sChange = (e) => {
        const r4s = parseInt(e.target.value,10);
        this.setState(() => ({ r4s }));
        document.querySelector("#r4s").value=r4s;
    }
    //Obtenemos datos iniciales desde BD
    componentDidMount=()=>{
        var url = `${constantes.PATH_API}modifRangos.php`;
        fetch(url,{
            methd:'GET',
            mode:'cors'
        }).then(res=>res.json())
        .then(datos=>{
            //Guardamos valores en estados
            document.querySelector("#r1i").value = this.state.r1i = datos[0]['lim_inferior'];
            document.querySelector("#r1s").value = this.state.r1s = datos[0]['lim_superior'];

            document.querySelector("#r2i").value = this.state.r2i = datos[1]['lim_inferior'];
            document.querySelector("#r2s").value = this.state.r2s = datos[1]['lim_superior'];

            document.querySelector("#r3i").value = this.state.r3i = datos[2]['lim_inferior'];
            document.querySelector("#r3s").value = this.state.r3s = datos[2]['lim_superior'];

            document.querySelector("#r4i").value = this.state.r4i = datos[3]['lim_inferior'];
            document.querySelector("#r4s").value = this.state.r4s = datos[3]['lim_superior'];
            console.log(datos);
        });

    }


    //Actualiza los rangos
    modificaRangos=()=>{
        let json = {
            'r1i':this.state.r1i,
            'r1s':this.state.r1s,
            'r2i':this.state.r2i,
            'r2s':this.state.r2s,
            'r3i':this.state.r3i,
            'r3s':this.state.r3s,
            'r4i':this.state.r4i,
            'r4s':this.state.r4s
        }
        //validamos campos vacios
        if(isNaN(json.r1i)|| isNaN(json.r1s)||isNaN(json.r2i)||isNaN(json.r2s)||isNaN(json.r3i)||isNaN(json.r3s)||isNaN(json.r4i)||isNaN(json.r4s)){
            alert("Por favor no deje campos vacios.");
        }else{
            //Datos correctos, valida que no choquen
            /*
                Algoritmo: 
                Comparamos r1 y r2, si no se cruzan, creamos rango con r1i y r2s
                Comparamos r3 y r4, si no se cruzan, creamos rango con r3i y r4s

                Comparamos los dos nuevos rangos creados y si no se cruzan, los rangos con correctos.
                Si se cruzan en alguno de los puntos anteriores, mandamos error
            */ 

            //1.- Comparando r1 y r2 , r3 y r4
            var primero = this.comparaRango(parseInt(json.r1i,10),parseInt(json.r1s,10),parseInt(json.r2i,10),parseInt(json.r2s,10));
            var segundo = this.comparaRango(json.r3i,json.r3s,json.r4i,json.r4s);
            //Si uno de los dos es true, existe cruce
            if(primero||segundo){
                //Existe un cruce, error
                alert("Error. Verifique que los rangos no se crucen entre sí.");
            }else{
                //Verificamos los dos primeros rangos con los ultimos dos
                var tercero = this.comparaRango(parseInt(json.r1i,10),parseInt(json.r2s,10),parseInt(json.r3i,10),parseInt(json.r4s,10));
                if(tercero){
                    //Existe cruce, error
                    alert("Error. Verifique que los rangos no se crucen entre sí.");
                }else{
                    //Los datos son correctos, enviamos datos al servidor
                    this.enviaRangos(JSON.stringify(json));
                }
            }
        }
    }

    //Funciones auxiliares
    comparaRango = (r1i,r1s,r2i,r2s)=>{
        //Si se cumple, existe cruce de rangos
        if( (r1i>=r2i && r1i<=r2s) || (r1s>=r2i && r1s<=r2s) || (r2i>=r1i && r2i<=r1s) || (r2s>=r1i && r2s<=r1s) ){
            return true;
        }else{
            return false;
        }
    }

    enviaRangos=(json)=>{
        var url=`${constantes.PATH_API}modifRangos.php`;
        fetch(url,{
            method:'POST',
            mode:'cors',
            body:json
        }).then(res=>res.text())
        .then(datos=>{
            //Verificamos que sea correcta y mandamos alerta
            alert("Rangos modificados correctamente. Actualice la pagina para mostrar cambios.");
        });
    }



    render(){
        return(
            <div className ="programas-container">
                <div className="titulo"><h3>Modificar rangos</h3></div>
                <div className="programas-ayuda">
                    <p>
                        ** Aqui puede modificar el rango de ID's que correspondan a cada uno de los progranas mostrados.
                        Estas modificaciones no afectarán a los registros de asistencias ya guardados. <br/><b>Los valores de los
                        limites estan incluidos dentro del rango.</b>
                    </p>
                </div>
                <div className="seccion-programas">

                    <div className = "subtitulos">
                        <span>Programa</span>
                        <span>Limite inferior</span>
                        <span>Limite superior</span>
                    </div>

                    <div className = "seccion-programas-item">
                        <span>Doctorado en Ciencias de la Ingeniería:</span>
                        <input type="number" min="1" onChange={this.onR1iChange} id="r1i"></input>
                        <input type="number" min="1" onChange={this.onR1sChange} id="r1s"></input>
                    </div>

                    <div className = "seccion-programas-item">
                        <span>Maestría en Ciencias de la Ingeniería:</span>
                        <input type="number" min="1" onChange={this.onR2iChange} id="r2i"></input>
                        <input type="number" min="1" onChange={this.onR2sChange} id="r2s"></input>
                    </div>

                    <div className = "seccion-programas-item">
                        <span>Maestría en Movilidad y Transporte:</span>
                        <input type="number" min="1" onChange={this.onR3iChange} id="r3i"></input>
                        <input type="number" min="1" onChange={this.onR3sChange} id="r3s"></input>
                    </div>

                    <div className = "seccion-programas-item">
                        <span>Maestría en la Ingeniería de Cadena de Suministro:</span>
                        <input type="number" min="1" onChange={this.onR4iChange} id="r4i"></input>
                        <input type="number" min="1" onChange={this.onR4sChange} id="r4s"></input>
                    </div>

                    <div className="seccion">
                        <button className="registerBack buttons" onClick={this.modificaRangos}>Modificar</button>
                    </div>
                    
                </div>

            </div>
        );
    }

}