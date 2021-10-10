import React from 'react';
import * as constantes from './Constantes';

class Footer extends React.Component{
    state={
        datosFooter:[]
    }

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

    render(){

        var datos1 = [];
        var datos2 = [];
        var datos3 = [];
        var i = 0;
        for(var pagina of this.state.datosFooter){
            if(pagina.mostrar==1){
                datos1.push(
                    <div className="item-datos-footer" key={i}>
                        <span>{pagina.nombre}</span>
                        <span>{pagina.valor}</span>
                    </div>
                )
            }
            if(pagina.mostrar==3){
                datos3.push(
                    <li key={i} ><a href={pagina.valor} target="_blank" rel="noreferrer" id="footer-datod5">{pagina.nombre}</a></li>
                )
            }
            i++;
        }


        return(
            <footer>
                <div className="datos-footer">
                    {datos1}
                </div>

                <div className="social-footer">
                    <a href="https://www.facebook.com/estudiosavanzados.fiuaem" target="_blank" rel="noreferrer" id="footer-datod9">
                        <img src="./images/facebook-logo.png" alt="Facebook Logo Coordinacion de Estudios Avanzados FIUAEMex"></img>
                    </a>
                </div>

                <div className="webs-footer">
                    <span>Sitios de interes:</span>
                    <ul>
                        {datos3}
                    </ul>
                </div>
            </footer>
        );
    }

}

export default Footer;
