import React from 'react';
import XLSX from 'xlsx';
import moment from 'moment';
import SingleFile from '../SingleFile';
import ListItem from './ListItems';
import * as constantes from '../Constantes';

export default class RegisterPage extends React.Component {

    state = {
        arregloAsistencias: [],
        asistencias: [],
        archivos: [],
        assistList: undefined,
        alumnos: []
    }

 

    dropHandler = (ev) => {

        ev.stopPropagation();
        ev.preventDefault();

        let files = ev.dataTransfer.files;
        let i, f;
        for (i = 0, f = files[i]; i < files.length; i++) {

            this.setState((prevState) => ({
                archivos: prevState.archivos.concat(f.name)
            }));

            const reader = new FileReader();

            reader.onload = (e) => {

                var data = e.target.result;

                let workbook = XLSX.read(data, { type: 'binary' });
                workbook = workbook.Sheets[workbook.SheetNames[0]];
                const dat = XLSX.utils.sheet_to_json(workbook, { header: 1 })
                this.setState(() => ({
                    arregloAsistencias: dat
                }));
            };

            reader.readAsBinaryString(f);
        }
    }

    dragOverHandler = (e) => {
        e.preventDefault();
    }

    //Calcula el tiempo que estuvo en la facultad
    getDelay = (ant, sig) => {
        if (moment(ant).date() - moment(sig).date() !== 0) {
            //No checo entrada o salida
            return [0]
        } else if (Math.abs(moment(ant).hour() - moment(sig).hour()) > 0) {
            //Calculamos diferencia real de horas
            if(moment(sig).minutes() - moment(ant).minutes() < 0 ){  //Ejemplo: 01: 15 a 03:14 -> no seran 2 horas
                let dif = Math.abs(moment(sig).minutes() - moment(ant).minutes());
                let h = Math.abs(moment(ant).hour() -moment(sig).hour())-1; //horas completas
                let m = 60-dif>9?60-dif:`0${60-dif}`;
                return[h,m];
            }

            let mins = Math.abs(moment(ant).minutes() - moment(sig).minutes());
            //Retorna las horas que estuvo en la facultad
            return [Math.abs(moment(ant).hour() -
                moment(sig).hour()), mins>9?mins:`0${mins}`]
        }
        return [0]
    }

    //Crea un array con las asistencias de cada alumno
    getStudents = (array) => {
        let aux = [];
        const arrayAlumnos = []
        for (let i = 0; i < array.length; i++) {
            if (!!array[i + 1] && array[i][1] === array[i + 1][1]) {
                aux.push(array[i])
            } else {
                aux.push(array[i]);
                arrayAlumnos.push(aux);
                aux = []
            }
        }
        return arrayAlumnos;
    }

    //Ordena las fechas de cada arreglo de alumnos
    getStudentsDate = (array) => {
        let aux = []
        const arrayAlumnos = []
        array.forEach((alumnos) => {
            aux = alumnos.sort((ant, sig) => {
                if (moment(ant[0]).isBefore(moment(sig[0]))) {
                    return -1
                } else if (moment(ant[0]).isAfter(moment(sig[0]))) {
                    return 1
                }
                return 0
            })
            arrayAlumnos.push(aux)
        });
        return arrayAlumnos
    }

    //Registra las asistencias de los alumnos
    getAssist = (array) => {
        let aux = []
        const assists = []
        //Recorremos los arreglos de alumnos 
        array.forEach((alumnos) => {
            //Recorremos los arreglos individuales
            for (let i = 0; i < alumnos.length; i++) {
                //Calculamos las asistencias de cada alumno
                if (!!alumnos[i + 1] && this.getDelay(alumnos[i][0], alumnos[i + 1][0]).length > 1) {
                    const horas = this.getDelay(alumnos[i][0], alumnos[i + 1][0]);
                    //Registramos la asistencia
                    aux.push([this.getHour(alumnos[i][0]), this.getHour(alumnos[i + 1][0]), alumnos[i][1],
                    alumnos[i][2], alumnos[i][3], this.getDate(alumnos[i][0]),
                    `${horas[0]}:${horas[1]}`])
                }
            }
            assists.push(aux);
            aux = []
        })
        return assists
    };

    ReaderHandler = () => {

        //Ocultamos el dropZone
        this.setState(() => ({
            assistList: true
        }))

        // Obtenemos arreglo ordenado por ID
        let arregloOrdenado = this.state.arregloAsistencias.slice();

        // Eliminamos el encabezado de excel
        arregloOrdenado.shift();

        // Ordena array
        arregloOrdenado = arregloOrdenado.sort((ant, sig) => ant[1] - sig[1]);

        // Creamos un array por cada alumno ordenado por fechas
        const students = this.getStudentsDate(this.getStudents(arregloOrdenado));

        // Creamos un array con las asistencias y horas asistidas de cada alumno
        const asistencias = this.getAssist(students)
        console.log(asistencias)

        // Salvamos las asistencias en el estado de la app
        this.setState(() => ({
            asistencias
        }))

        const aux = []
        // Crea un arreglo unico de todas las asistencias
        asistencias.forEach((listaAlumno) => {
            if (listaAlumno.length > 0) {
                listaAlumno.forEach((alumno) => {
                    aux.push(alumno)
                })
            }
        })

        this.setState(() => ({
            alumnos: aux
        }))

    }

    // Separa la fecha de la hora
    getDate = (date) => {
        const fecha = date.split(' ');
        return fecha[0];
    }

    getHour = (date) => {
        const hour = date.split(' ');
        return hour[1];
    }

    handleDelete = (index) => {
        let archivos = this.state.archivos.slice();
        archivos.splice(index, 1);
        this.setState(() => ({
            archivos
        }))
    }

    handleBack = () => {
        this.setState(() => ({
            assistList: false,
            alumnos: [],
            arregloAsistencias: [],
            asistencias: [],
            archivos: []
        }))
    }

    //loader para carga de archivos
    loader = (espera) => {

        this.setState(() => ({
            btnInactivo: espera
        }));
        document.querySelector("#btn1").disabled = espera;
        document.querySelector("#btn2").disabled = espera;

        if (espera) {
            document.body.style.cursor = 'progress'; //cursos espera
        } else {
            document.body.style.cursor = 'default'; //cursos default
        }
    }
    //Guarda los registros en la BD
    guardaBD = () => {

        this.loader(true); //Mostramos cursor loader
        const url = `${constantes.PATH_API}asistencias.php`;
        var json = [];
        console.log(this.state.alumnos);
        //Generamos json con todos los registros            
        this.state.alumnos.map((asistencia, index) => {
            let datos = {
                "id":asistencia[2],
                "nombre": asistencia[3],
                "apellidos": asistencia[4],
                "fecha": asistencia[5],
                "hora_entrada": asistencia[0],
                "hora_salida": asistencia[1],
                "horas_permanencia": asistencia[6]
            }
            json.push(datos);
        });

        //Enviamos json al servidor
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(json)
        })
            .then(res => res.json())
            .then(
                (data) => {
                    var mensaje = "";
                    if (data['nuevos'] == 0) {
                        mensaje = `Las asistencias que quiere registrar ya existen en la base de datos.`;
                    } else if (data['nuevos'] != 0) {
                        mensaje = `Terminado: Se agregaron ${data['nuevos']} asistencias, con : ${data['repetidos']} registros repetidos`;
                    }
                    this.loader(false); //Quitamos cursor loader
                    
                    alert(mensaje);
                }
            );
    }

    clickFile=()=>{
        console.log("holaa");
    }


    render() {
        return (
            <div>
                {/*<h1 className='title'> Registro de Asistencia </h1>*/}
                <h3>Registro de Asistencia</h3>
                <div className='container'>
                    {
                        !!this.state.assistList ? (
                            <div>
                                <div className='registerHeader'>
                                    <h3> Nombre </h3>
                                    <h3> Fecha </h3>
                                    <h3> Hora Entrada </h3>
                                    <h3> Hora Salida </h3>
                                    <h3> Horas Asistidas </h3>
                                </div>
                                <div className="tablaScroll">
                                    {
                                        // Renderizamos las asistencias
                                        this.state.alumnos.map((asistencia, index) => (
                                            <ListItem
                                                key={index}
                                                id={asistencia[2]}
                                                nombre={asistencia[3]+" "+asistencia[4]}
                                                fecha={asistencia[5]}
                                                horaI={asistencia[0]}
                                                horaF={asistencia[1]}
                                                horas={asistencia[6]}
                                            />
                                        ))
                                    }
                                </div>
                                <div className="btnBox">
                                    <button onClick={this.handleBack} className='registerBack' id="btn1"> Regresar </button>
                                    <button onClick={this.guardaBD} className='registerBack' id="btn2"> Guardar Registros</button>
                                </div>
                            </div>) : (
                            <div>
                                <div
                                    className='dropZone'
                                    onDrop={this.dropHandler}
                                    onDragOver={this.dragOverHandler}
                                    onClick={this.clickFile}>
                                    <img src='./images/excel.svg' />
                                    <h2 className='registerText'> Arrastre sus archivos aqui para agregarlos al registro </h2>
                                </div>
                                {this.state.archivos.map((name, index) => (
                                    <SingleFile key={index} name={name} index={index} handleDelete={this.handleDelete} />
                                ))}
                                <button disabled={this.state.archivos.length === 0} className='registerAsistencias' onClick={this.ReaderHandler}> Lista de Asistencias </button>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}