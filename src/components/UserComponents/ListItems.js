import React from 'react';

const ListItem = (props) => {
    return(
        <div className='registerHEader equalWidth'>
            <h3> {props.nombre} </h3>
            <h3> {props.fecha} </h3>
            <h3> {props.horaI} </h3>
            <h3> {props.horaF} </h3>
            <h3> {props.horas} </h3>
        </div>
    );
}

export default ListItem;