import React from 'react';
import HelpItem from './HelpItem';

export default class HelpPage extends React.Component {

    render(){
        return(
            <div className="help-container">
                <div className="help-title">
                    <h3>Sección de ayuda</h3>
                </div>
                <div className="help-items">
                    <HelpItem titulo="1.- ¿Como moverme dentro del sistema?" 
                    video={<iframe width="560" height="315" src="https://www.youtube.com/embed/_hQB5sHAjWs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>}
                    texto = "Ejemplo de como utilizar el sistema."/>
                </div>
            </div>
        );
    }


}
