import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import jsPDF from 'jspdf';
import { logoBase64 } from './pdf/logo';

const CotizacionFormulario = () => {
  const today = new Date().toISOString().split('T')[0];
  const [cotizacion, setCotizacion] = useState({
    nombre: '',
    rut: '',
    fecha: today,
    precio: '',
    descripcion: '',
    tipoVehiculo: '',
    patente: '',
  });

  const IVA_RATE = 0.19;

  const calcularIVA = (precioBruto) => {
    const iva = precioBruto * IVA_RATE / (1 + IVA_RATE);
    const precioNeto = precioBruto - iva;
    return { iva, precioNeto };
  };

  const validarRUT = (rut) => {
    const rutSinPuntos = rut.replace(/\./g, '').replace('-', '');
    const cuerpo = rutSinPuntos.slice(0, -1);
    const dv = rutSinPuntos.slice(-1).toUpperCase();
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
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

    if (!cotizacion.nombre || !cotizacion.rut || !cotizacion.fecha || !cotizacion.precio || !cotizacion.descripcion || !cotizacion.tipoVehiculo || !cotizacion.patente) {
      alert("Por favor complete todos los campos.");
      return;
    }

    if (!validarRUT(cotizacion.rut)) {
      alert("El RUT ingresado no es válido.");
      return;
    }

    const precioBruto = parseFloat(cotizacion.precio.replace(/\./g, ''));
    if (isNaN(precioBruto) || precioBruto <= 0 || cotizacion.precio.includes('e')) {
      alert("Por favor ingrese un precio válido mayor que cero.");
      return;
    }

    const { iva, precioNeto } = calcularIVA(precioBruto);

    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    doc.addImage(logoBase64, 'PNG', 10, 10, 30, 30);

    const empresaInfo = [
      'RUT: 76.123.456-7',
      'Teléfono: +56 9 8765 4321',
      'Dirección: Guillermo Hollstein 841'
    ];

    let yOffset = 15;
    empresaInfo.forEach((line, index) => {
      doc.text(line, 50, yOffset + index * 7);
    });

    let verticalOffset = 70;

    const title = "Cotización de vehículo";
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const xPositionTitle = (pageWidth - titleWidth) / 2;
    doc.setFontSize(18);
    doc.text(title, xPositionTitle, verticalOffset);
    verticalOffset += 20;

    const validityMessage = `***Esta cotización es válida por 15 días a partir de la fecha de ingreso.***`;
    const validityMessageWidth = doc.getTextWidth(validityMessage);
    const xPositionValidity = (pageWidth - validityMessageWidth) / 2;
    doc.setFontSize(12);
    doc.text(validityMessage, xPositionValidity, verticalOffset);
    verticalOffset += 10;

    doc.setFontSize(12);
    doc.text(`Nombre: ${cotizacion.nombre}`, 20, verticalOffset);
    verticalOffset += 10;

    doc.text(`RUT: ${cotizacion.rut}`, 20, verticalOffset);
    verticalOffset += 10;

    doc.text(`Fecha: ${cotizacion.fecha}`, 20, verticalOffset);
    verticalOffset += 10;

    doc.text(`Tipo de Vehículo: ${cotizacion.tipoVehiculo}`, 20, verticalOffset);
    verticalOffset += 10;

    doc.text(`Patente: ${cotizacion.patente}`, 20, verticalOffset);
    verticalOffset += 10;

    const description = `Descripción: ${cotizacion.descripcion}`;
    const descriptionWidth = doc.getTextWidth(description);
    const xPositionDescription = (pageWidth - descriptionWidth) / 2;
    doc.text(description, xPositionDescription, verticalOffset);
    verticalOffset += 15;

    const pageHeight = doc.internal.pageSize.getHeight();
    if (verticalOffset > pageHeight - 30) {
      doc.addPage();
      verticalOffset = 20;
    }

    doc.text(`Precio Bruto (Total): $${precioBruto.toLocaleString()}`, 20, verticalOffset);
    verticalOffset += 10;

    doc.text(`IVA (19%): $${iva.toFixed(2).toLocaleString()}`, 20, verticalOffset);
    verticalOffset += 10;

    doc.text(`Precio Neto: $${precioNeto.toFixed(2).toLocaleString()}`, 20, verticalOffset);
    verticalOffset += 10;

    doc.save(`${cotizacion.nombre}_cotizacion.pdf`);

    setCotizacion({
      nombre: '',
      rut: '',
      fecha: today,
      precio: '',
      descripcion: '',
      tipoVehiculo: '',
      patente: '',
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
              inputProps={{ min: today }} // Agregando el atributo `min` con el valor de la fecha actual
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
