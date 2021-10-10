import React from 'react';

const ListItemReportes = (props) => {
    if(props.total_horas) {
        return(
            <div className='registerHEader reg'>
                <h3> {props.nombre} </h3>
                <h3> {props.apellidos} </h3>
                <h3> {props.fecha_inicio} </h3>
                <h3> {props.fecha_fin} </h3>
                <h3> {props.total_horas} </h3>
            </div>
        );
    }else{
        return(
            <div className='registerHEader reg'>
            <h3> {props.nombre} </h3>
            <h3> {props.apellidos} </h3>
            <h3> {props.fecha_inicio} </h3>
            <h3> {props.fecha_fin} </h3>
            </div>
        );
    }
}

export default ListItemReportes;