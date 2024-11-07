import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import jsPDF from 'jspdf';
import { logoBase64 } from './pdf/logo'; // Importar el logo

const CotizacionFormulario = () => {
  const today = new Date().toISOString().split('T')[0]; // Obtener la fecha de hoy en formato YYYY-MM-DD
  const [cotizacion, setCotizacion] = useState({
    nombre: '',
    rut: '',
    fecha: today, // Establecer la fecha actual como valor inicial
    precio: '',
    descripcion: '',
    tipoVehiculo: '', // Tipo de vehículo vacío inicialmente
    tamañoVehiculo: '', // Tamaño del vehículo vacío inicialmente
    patente: '', // Campo para la patente
  });

  const IVA_RATE = 0.19; // Tasa de IVA (19%)

  // Función para calcular el precio neto y el IVA
  const calcularIVA = (precioBruto) => {
    const iva = precioBruto * IVA_RATE / (1 + IVA_RATE); // Calcular el IVA a partir del precio bruto
    const precioNeto = precioBruto - iva; // Calcular el precio neto
    return { iva, precioNeto };
  };

  // Función para validar el RUT usando el algoritmo módulo 11
  const validarRUT = (rut) => {
    const rutSinPuntos = rut.replace(/\./g, '').replace('-', ''); // Eliminar puntos y guion
    const cuerpo = rutSinPuntos.slice(0, -1); // Eliminar el dígito verificador
    const dv = rutSinPuntos.slice(-1).toUpperCase(); // El dígito verificador
    let suma = 0;
    let multiplicador = 2;

    // Calcular la suma de los dígitos multiplicados
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1; // Volver a 2 después del 7
    }

    const resto = suma % 11;
    const digitoCalculado = 11 - resto;
    const digitoVerificador = digitoCalculado === 11 ? '0' : digitoCalculado === 10 ? 'K' : digitoCalculado.toString();

    return dv === digitoVerificador;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCotizacion({ ...cotizacion, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica de campos
    if (!cotizacion.nombre || !cotizacion.rut || !cotizacion.fecha || !cotizacion.precio || !cotizacion.descripcion || !cotizacion.tipoVehiculo || !cotizacion.tamañoVehiculo || !cotizacion.patente) {
      alert("Por favor complete todos los campos.");
      return;
    }

    // Validación del RUT
    if (!validarRUT(cotizacion.rut)) {
      alert("El RUT ingresado no es válido.");
      return;
    }

    // Validación del precio (no debe ser negativo, cero ni contener 'e')
    const precioBruto = parseFloat(cotizacion.precio.replace(/\./g, '')); // Eliminar los puntos de los miles
    if (isNaN(precioBruto) || precioBruto <= 0 || cotizacion.precio.includes('e')) {
      alert("Por favor ingrese un precio válido mayor que cero.");
      return;
    }

    // Calcular IVA y precio neto
    const { iva, precioNeto } = calcularIVA(precioBruto);

    // Crear el documento PDF
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Agregar el logo en la parte superior izquierda
    doc.addImage(logoBase64, 'PNG', 10, 10, 30, 30); // Usando el logo importado

    // Información de la empresa al lado del logo
    const empresaInfo = [
      'RUT: 76.123.456-7',  // Reemplazar con el RUT de la empresa
      'Teléfono: +56 9 8765 4321', // Reemplazar con el número de teléfono de la empresa
      'Dirección: Guillermo Hollstein 841' // Reemplazar con la dirección de la empresa
    ];

    // Colocar la información de la empresa al lado del logo
    let yOffset = 15;
    empresaInfo.forEach((line, index) => {
      doc.text(line, 50, yOffset + index * 7); // Colocar cada línea debajo de la anterior
    });

    let verticalOffset = 70; // Inicializar desplazamiento vertical para el primer texto (debajo de la info de la empresa)

    // Título centrado
    const title = "Cotización de vehículo";
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const xPositionTitle = (pageWidth - titleWidth) / 2; // Calcular la posición para centrar
    doc.setFontSize(18);
    doc.text(title, xPositionTitle, verticalOffset);
    verticalOffset += 20;

    // Agregar mensaje de validez de la cotización
    const validityMessage = `***Esta cotización es válida por 15 días a partir de la fecha de ingreso.***`;
    const validityMessageWidth = doc.getTextWidth(validityMessage);
    const xPositionValidity = (pageWidth - validityMessageWidth) / 2; // Calcular la posición para centrar
    doc.setFontSize(12);
    doc.text(validityMessage, xPositionValidity, verticalOffset);
    verticalOffset += 10;

    // Agregar contenido al PDF con un desplazamiento incremental
    doc.setFontSize(12);
    doc.text(`Nombre: ${cotizacion.nombre}`, 20, verticalOffset);
    verticalOffset += 10;

    doc.text(`RUT: ${cotizacion.rut}`, 20, verticalOffset);
    verticalOffset += 10;

    doc.text(`Fecha: ${cotizacion.fecha}`, 20, verticalOffset);
    verticalOffset += 10;

    // Agregar el Tipo de Vehículo (por encima de la Descripción)
    doc.text(`Tipo de Vehículo: ${cotizacion.tipoVehiculo}`, 20, verticalOffset);
    verticalOffset += 10;

    // Agregar el Tamaño de Vehículo (campo seleccionable)
    doc.text(`Tamaño de vehículo: ${cotizacion.tamañoVehiculo}`, 20, verticalOffset);
    verticalOffset += 10;

    // Agregar la Patente (por encima de la Descripción)
    doc.text(`Patente: ${cotizacion.patente}`, 20, verticalOffset);
    verticalOffset += 10;

    // Centrar la Descripción
    const description = `Descripción: ${cotizacion.descripcion}`;
    const descriptionWidth = doc.getTextWidth(description);
    const xPositionDescription = (pageWidth - descriptionWidth) / 2; // Calcular la posición para centrar
    doc.text(description, xPositionDescription, verticalOffset);
    verticalOffset += 15;

    // Verificar si el contenido excede el espacio disponible en la página
    const pageHeight = doc.internal.pageSize.getHeight();
    if (verticalOffset > pageHeight - 30) {
      doc.addPage(); // Si el contenido sobrepasa la página, agregar una nueva página
      verticalOffset = 20; // Reiniciar el desplazamiento para la nueva página
    }

    // Mostrar los precios
    doc.text(`Precio Bruto (Total): $${precioBruto.toLocaleString()}`, 20, verticalOffset); // Formatear el precio con puntos
    verticalOffset += 10;

    doc.text(`IVA (19%): $${iva.toFixed(2).toLocaleString()}`, 20, verticalOffset); // Formatear el IVA
    verticalOffset += 10;

    doc.text(`Precio Neto: $${precioNeto.toFixed(2).toLocaleString()}`, 20, verticalOffset); // Formatear el precio neto
    verticalOffset += 10;

    // Descargar el PDF
    doc.save(`${cotizacion.nombre}_cotizacion.pdf`);

    // Limpiar el formulario después de enviar
    setCotizacion({
      nombre: '',
      rut: '',
      fecha: today, // Volver a establecer la fecha a hoy
      precio: '',
      descripcion: '',
      tipoVehiculo: '', // Limpiar el campo de tipo de vehículo
      tamañoVehiculo: '', // Limpiar el campo de tamaño de vehículo
      patente: '', // Limpiar el campo de patente
    });
  };

  return (
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            Crear cotización
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre"
              name="nombre"
              value={cotizacion.nombre}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="RUT"
              name="rut"
              value={cotizacion.rut}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Fecha"
              name="fecha"
              type="date"
              value={cotizacion.fecha}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Patente"
              name="patente"
              value={cotizacion.patente}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Descripción"
              name="descripcion"
              value={cotizacion.descripcion}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              multiline
              rows={4}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de vehículo</InputLabel>
              <Select
                name="tipoVehiculo"
                value={cotizacion.tipoVehiculo}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="Auto">Auto</MenuItem>
                <MenuItem value="Camioneta">Camioneta</MenuItem>
                <MenuItem value="Furgón">Furgón</MenuItem>
                <MenuItem value="Moto">Moto</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tamaño de vehículo</InputLabel>
              <Select
                name="tamañoVehiculo"
                value={cotizacion.tamañoVehiculo}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="Pequeño">Pequeño</MenuItem>
                <MenuItem value="Mediano">Mediano</MenuItem>
                <MenuItem value="Grande">Grande</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Precio"
              name="precio"
              value={cotizacion.precio}
              onChange={handleInputChange}
              fullWidth
              required
              type="number"
              inputProps={{ min: "0", step: "0.01" }}
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Generar cotización
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CotizacionFormulario;
