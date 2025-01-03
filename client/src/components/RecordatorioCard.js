import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const RecordatorioCard = () => {
  const [recordatorio, setRecordatorio] = useState('');

  // Cargar el recordatorio desde localStorage al iniciar
  useEffect(() => {
    const savedRecordatorio = localStorage.getItem('recordatorio');
    if (savedRecordatorio) {
      setRecordatorio(savedRecordatorio);
    }
  }, []);

  // Manejar el cambio en el recordatorio y guardarlo en localStorage
  const handleRecordatorioChange = (event) => {
    const newRecordatorio = event.target.value;
    setRecordatorio(newRecordatorio);
    localStorage.setItem('recordatorio', newRecordatorio); 
  };

  // Limpiar el recordatorio
  const handleClearRecordatorio = () => {
    setRecordatorio('');
    localStorage.removeItem('recordatorio'); 
  };

  return (
    <Card sx={{
      width: '515px',
      height: '218px',  
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',  
      padding: '16px',
      position: 'relative', 
    }}>
      <CardContent sx={{ padding: '0px', position: 'relative' }}>
        {/* Contenedor para título y botón */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
            Recordatorio
          </Typography>

          {/* Botón para limpiar el recordatorio */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearRecordatorio}
            sx={{
              padding: '5px',
              minWidth: 'auto', 
            }}
          >
            <DeleteIcon />
          </Button>
        </Box>

        {/* Campo de texto para el recordatorio */}
        <Box sx={{ marginTop: '5px' }}>
          <TextField
            label="Escribe tu recordatorio"
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            value={recordatorio}
            onChange={handleRecordatorioChange} 
            sx={{ marginBottom: 1 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecordatorioCard;