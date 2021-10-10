import React from 'react';


const HelpItem = (props)=>{
    return( 
        <div className="help-item">
            <div className="help-item-title">
                <h4>{props.titulo}</h4>
            </div>
            <div className="help-item-video">
                {props.video}
            </div>
            <div className="help-item-text">
                <p>{props.texto}</p>
            </div>
        </div>
    );
}

export default HelpItem;