
export const truncateString = (str, num) => {
    if (!str) return ""; // Maneja caso de texto vacío
    return str.length > num ? str.slice(0, num) + '...' : str;
};