
export const validateRut = (rut) => {
    // Remover caracteres no numéricos
    const cleanedRut = rut.replace(/[^0-9kK]/g, '');
    const body = cleanedRut.slice(0, -1);
    const dv = cleanedRut.slice(-1).toUpperCase();

    // Validar que el cuerpo del RUT sea un número
    if (!/^\d+$/.test(body)) return false;

    // Calcular el dígito verificador
    let sum = 0;
    let factor = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += factor * body[i];
        factor = factor === 7 ? 2 : factor + 1;
    }

    const calculatedDv = 11 - (sum % 11);
    const finalDv = calculatedDv === 11 ? '0' : calculatedDv === 10 ? 'K' : calculatedDv.toString();

    return finalDv === dv;
};