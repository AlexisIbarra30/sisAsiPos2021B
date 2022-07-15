/*Definición de expresiones regulares para validación de formularios*/
export const expres = {
    caracteresEspeciales:/[\*'´¨~;:,+\?^${}#\/()|[\]\\\&"]+/,
    contra: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,15}$/,
    nombres:/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,
}

export function encuentraExpres(expresion,cadena){
    if(expresion.exec(cadena)){
        return true;
    }else{
        return false;
    }
}

export function validaExpres(expresion,cadena){
    if(expresion.test(cadena) || cadena.length == 0){
        return true;
    }else{
        return false;
    }
}
export function validaUsuario(cadena){
    let letrasm = /[a-z]+/;
    let letrasM = /[A-Z]+/;
    let numeros = /[0-9]+/;
    let simbolos= /[-_.]+/;
    if(letrasm.exec(cadena) && letrasM.exec(cadena) && numeros.exec(cadena) && simbolos.exec(cadena)){
        let v = true;
        expres.caracteresEspeciales.exec(cadena)?v = false: v = true;
        return v;
    }else{
        return false;
    }
}
