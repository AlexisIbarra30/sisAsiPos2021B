/*Definición de expresiones regulares para validación de formularios*/
export const expres = {
    caracteresEspeciales:/[\*'´¨~;:,+\?^${}#\/()|[\]\\\&"]+/,
    //contra: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,15}$/,
    nombres:/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/,

    //"Debe incluir al menos, tres minúsculas, dos mayúsculas, un carácter especial (!@#$&*) y dos dígitos. Longitud mínima de 12 caracteres."
    contra:/^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{12,}$/,

    //"Debe combinar Mayusculas, digitos y minusculas. Longitud: 8-15"
    nombres_usuario:/^(?=.*[A-Z])(?=.*[-.])(?=.*[0-9])(?=.*[a-z]).{8,15}$/,

    //"Codigo de verificacion 5 digitos"
    code: /^[0-9]{5}$/,

    /*
    General Email Regex (RFC 5322 Official Standard)
    */
    correos: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
    
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
