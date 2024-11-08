import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Paper, MenuItem, Select, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import jsPDF from 'jspdf';
import { logoBase64 } from './pdf/logo'; // Importar el logo

const CotizacionFormulario = () => {
  const today = new Date().toISOString().split('T')[0];
  const [cotizacion, setCotizacion] = useState({
    nombre: '',
    rut: '',
    fecha: today,
    precio: '',
    descripcion: '',
    tipoVehiculo: '',
    tamañoVehiculo: '',
    patente: '',
  });

  const [openModal, setOpenModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [cotizaciones, setCotizaciones] = useState([]); // Estado para almacenar las cotizaciones generadas

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

    if (!cotizacion.nombre || !cotizacion.rut || !cotizacion.fecha || !cotizacion.precio || !cotizacion.descripcion || !cotizacion.tipoVehiculo || !cotizacion.tamañoVehiculo || !cotizacion.patente) {
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

    const empresaInfo = ['RUT: 76.123.456-7', 'Teléfono: +56 9 8765 4321', 'Dirección: Guillermo Hollstein 841'];
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

    doc.text(`Tamaño de vehículo: ${cotizacion.tamañoVehiculo}`, 20, verticalOffset);
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

    // Guardar la cotización en el estado
    setCotizaciones([...cotizaciones, { ...cotizacion, precioNeto, iva }]);

    setCotizacion({
      nombre: '',
      rut: '',
      fecha: today,
      precio: '',
      descripcion: '',
      tipoVehiculo: '',
      tamañoVehiculo: '',
      patente: '',
    });

    setOpenModal(false); // Cerrar el modal después de generar el PDF
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
        Crear Cotización
      </Button>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Crear Cotización</DialogTitle>
        <DialogContent>
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
              type="text"
              value={cotizacion.precio}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <DialogActions>
              <Button onClick={() => setOpenModal(false)} color="secondary">
                Cancelar
              </Button>
              <Button type="submit" color="primary">
                Generar Cotización
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mostrar las cotizaciones */}
      <Paper elevation={3} style={{ marginTop: '20px', padding: '10px' }}>
        <Typography variant="h6">Cotizaciones Generadas</Typography>
        <ul>
          {cotizaciones.map((cot, index) => (
            <li key={index}>
              <Typography variant="body2">{`${cot.nombre} - $${cot.precioNeto.toLocaleString()} (Válido hasta ${new Date(cot.fecha).toLocaleDateString()})`}</Typography>
            </li>
          ))}
        </ul>
      </Paper>
    </div>
  );
};

export default CotizacionFormulario;
