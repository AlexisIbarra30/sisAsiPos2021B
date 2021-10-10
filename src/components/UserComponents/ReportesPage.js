import React from 'react';
import moment from 'moment';
//import { DateRangePicker } from 'react-dates';
import jsPDF from 'jspdf';
import ListItemReportes from './ListItemsReportes';
import * as constantes from '../Constantes';
//Para el datePicker
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale} from  "react-datepicker";
import es from 'date-fns/locale/es';
import {subDays} from 'date-fns';



registerLocale('es', es);


class ReportesPage extends React.Component {
    state = {
        alumnos: [],
        startDate:moment(subDays(new Date(),7)).format("YYYY/MM/DD"),
        endDate:moment(new Date()).format("YYYY/MM/DD"),
        focusedInput: null,
        fchI: subDays(new Date(),7),
        fchF: new Date()
    }

    componentDidMount() {
        this.getRegistros();
    }

    getRegistros = () => {
        
        let user = JSON.parse(sessionStorage.getItem("USER"));
        let programa = user.programa_id;
        let fecha_inicio = this.state.startDate;
        let fecha_fin = this.state.endDate;

        let json = new URLSearchParams({
            fecha_inicio,
            fecha_fin,
            programa
        });
        
        let url = `${constantes.PATH_API}total_horas.php?${json.toString()}`;
        console.log(url)
        // Lanzamos el fetch para obtener la lista de alumnos
        fetch(url, {
            method: 'GET',
            mode: 'cors'
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({alumnos:data})
            });
    }

    onFocusChange = (calendarFocused) => {
        this.setState(() => ({ calendarFocused }));
    }

    onDatesChange = () => {
        this.setState(() => ({}));
    }

    focusedInput = ({ focusedInput }) => {
        this.setState(() => ({ focusedInput }))
    }

    generatePDF = () => {
        // Creamos nuestro documento pdf
        let image = "./images/logo.png";
        let x = 20;
        let y = 10;
        let width = 70;
        let height = 25;
        let doc = new jsPDF();
        doc.addImage(
            image,
            "PNG",
            x,
            y,
            width,
            height
        );
        
        image = "./images/fingenieria-min.png";
        x = 140;
        width = 40
        
        doc.addImage(
            image,
            "PNG",
            x,
            y,
            width,
            height
        );
        
        //fondo: #2D5438
        //texto: #FFFFFF
        doc.setFontSize(18);
        doc.text(`Cordinacion de Estudios Avanzados`, 50,50);
        doc.text(`Registro de asistencias, de ${moment(this.state.startDate).format("DD/MM/YYYY")} hasta ${moment(this.state.endDate).format("DD/MM/YYYY")}`, 30,60);
        doc.setFontSize(10);
        //doc.cell(5, 70, 200, 300,'  Nombre        Apellidos            Fecha Inicio      Fecha Final      Horas Totales  ', 1);
        doc.cell(15,70,45,10,'Nombre',5,'c');
        doc.cell(15,70,45,10,'Apellidos',5,'c');
        doc.cell(15,70,30,10,'Fecha Inicio',5,'c');
        doc.cell(15,70,30,10,'Fecha Final',5,'c');
        doc.cell(15,70,30,10,'Horas Totales',5,'c');
        y = 90;
        doc.setFontSize(9);
        this.state.alumnos.forEach((asistencia, index) => {
          /*  doc.text(`  ${asistencia.nombre}    ${asistencia.apellidos}    ${this.state.fchI}     ${this.state.fchF}      ${asistencia.total_horas}`, 5, y);
            y = y +10;
            if(index > 18) {
                return false;
            }*/
            var temp_y = 70;
            if(index>0 && index%20==0){doc.cellAddPage();temp_y = 10;
                doc.setFontSize(10);
                doc.cell(15,temp_y,45,10,'Nombre',5,'c');
                doc.cell(15,temp_y,45,10,'Apellidos',5,'c');
                doc.cell(15,temp_y,30,10,'Fecha Inicio',5,'c');
                doc.cell(15,temp_y,30,10,'Fecha Final',5,'c');
                doc.cell(15,temp_y,30,10,'Horas Totales',5,'c');
                doc.setFontSize(9);
            }
            doc.cell(15,temp_y,45,8,`${asistencia.nombre}`,index,y);
            doc.cell(15,temp_y,45,8,`${asistencia.apellidos}`,index,y);
            doc.cell(15,temp_y,30,8,`${this.state.startDate}`,index,y);
            doc.cell(15,temp_y,30,8,`${this.state.endDate}`,index,y);
            doc.cell(15,temp_y,30,8,`${asistencia.total_horas}`,index,y);
            y = y +10;
            
            
        });

        doc.save("Asistencias.pdf");
    }
    

    render() {
        return (
            <div>
                <div className='titleContainer'>
                    <h1 className='title'> Reportes </h1>
                </div>
                <span style={{margin:10}}>** Solamente se muestran a los alumnos que pertenecen a la maestria/doctorado</span>

                <div className='panel123'>
                    <div className='container'>
                        <div className="form-Item">
                            <label style={{margin: 30}}> Rango en que seran generados: </label>
                            {/*<DateRangePicker
                                startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                                startDateId="start_date_id" // PropTypes.string.isRequired,
                                endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                                endDateId="end_date_id" // PropTypes.string.isRequired,
                                onDatesChange={({ startDate, endDate }) => {
                                    this.setState({ startDate, endDate })
                                    this.getRegistros();
                                }} // PropTypes.func.isRequired,
                                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                                isOutsideRange={() => false}
                                noBorder={true}
                                readOnly={true}
                            />*/}
                            <div className="datesRange">
                                <DatePicker
                                    selected={this.state.fchI}
                                    onChange={(date) => {
                                        this.setState({fchI:date,startDate:moment(date).format("YYYY/MM/DD"),fchF:date,startDate:moment(date).format("YYYY/MM/DD")});
                                        this.getRegistros();
                                    }}
                                    selectsStart
                                    startDate={this.state.fchI}
                                    endDate={this.state.fchF}
                                    value = {moment(this.state.fchI).format("DD/MM/YYYY")}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    withPortal
                                    locale="es"

                                />
                                <DatePicker
                                    selected={this.state.fchF}
                                    onChange={(date) => {
                                        this.setState({fchF:date,endDate:moment(date).format("YYYY/MM/DD")});
                                        this.getRegistros();
                                    }}
                                    selectsEnd
                                    startDate={this.state.fchI}
                                    endDate={this.state.fchF}
                                    minDate={this.state.fchI}
                                    value = {moment(this.state.fchF).format("DD/MM/YYYY")}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    withPortal
                                    locale="es"
                                />
                            </div>
                            
                            

                        </div>
                        <div className='registerHeader reg regHeader'>
                            <h3> Nombre </h3>
                            <h3> Apellidos </h3>
                            <h3> Fecha Inicio </h3>
                            <h3> Fecha Final </h3>
                            <h3> Horas Totales </h3>
                        </div>
                        <div className="tablaScroll">
                            {
                                // Revisamos cuantos registros se encontraron
                                this.state.alumnos.length > 0 ?
                                // Renderizamos las asistencias
                                (this.state.alumnos.map((asistencia, index) => (
                                    <ListItemReportes
                                        key={index}
                                        nombre={asistencia.nombre}
                                        apellidos={asistencia.apellidos}
                                        total_horas={asistencia.total_horas}
                                        fecha_inicio={this.state.startDate}
                                        fecha_fin={this.state.endDate}
                                    />
                                ))) : // Si no hay registros
                                (<ListItemReportes
                                    key={123}
                                    nombre={"No se encontro "}
                                    apellidos={"ningun registro, "}
                                    fecha_inicio={"pruebe cambiando "}
                                    fecha_fin={"la fecha."}
                                />)
                            }
                        </div>
                        <div className="btnBox smallbtn">
                            <button style={{visibility: 'hidden'}}></button>
                            <button onClick={this.generatePDF} disabled={this.state.alumnos.length === 0} className="registerBack nomargin">Guardar registro PDF</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ReportesPage;