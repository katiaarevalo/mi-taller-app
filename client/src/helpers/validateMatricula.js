/*      MATRICULAS EN AUTOS CHILENOS      */
/*  Modelo antiguo:
    AA 1234  ;  Dos letras, cuatro números. 

    Modelo nuevo:
    BB.CC.12  ; Dos letras, dos letras, dos números

*/

export const validarMatricula = (matricula) => {
    // Expresión regular para el formato antiguo AA 1234
    const formatoAntiguo = /^[A-Z]{2} \d{4}$/;

    // Expresión regular para el formato moderno BB.CC.12
    const formatoModerno = /^[A-Z]{2}\.[A-Z]{2}\.\d{2}$/;

    // Verificar si la matrícula coincide con alguno de los formatos
    return formatoAntiguo.test(matricula) || formatoModerno.test(matricula);
};