import React from 'react';

const MenuItem = (props) =>{
    return(
        <div className="menu-item" onClick={() => {props.renderHandler(props.Component)}}>
            <div className="titulo">
                <span>{props.titulo}</span>
            </div>
            <div className="icono">
                <img src={props.icono}></img>
            </div>
        </div>
    );
}

export default MenuItem;