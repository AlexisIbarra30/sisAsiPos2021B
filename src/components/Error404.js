import {history} from '../routers/AppRouter';


export default function Error004(){

    const handleClick=()=>{
        history.push('/');
    }

    return(
        <div className="error-container" style={{backgroundImage:`url('images/fi_background.jpg')`}}>
            <div className="bgwhite">
                <div className="caja-mensaje">
                    <div className="imagen">
                        <img src='images/404.png'/>
                        <h2>Error 404</h2>
                    </div>
                    <div className="mensaje">
                        <span>Recurso no encontrado o inexistente en el sitio.</span>
                    </div>
                    <div className="botones">
                        <input type="button" value="Pagina de inicio" className="loginButton inicioButton" onClick={handleClick}/>
                    </div>
                </div>
            </div>
            
        </div>
    );
}