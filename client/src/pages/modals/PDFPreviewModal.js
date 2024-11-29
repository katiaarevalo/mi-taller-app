import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const PDFPreviewModal = ({ open, onClose, pdfUri, orden }) => {
  const handleDownload = () => {
    const fecha = new Date().toLocaleDateString().replace(/\//g, '-');
    const nombreArchivo = `Orden_de_trabajo_${orden.id}_${fecha}.pdf`; // Nombre dinámico
    const link = document.createElement('a');
    link.href = pdfUri;
    link.download = nombreArchivo;
    link.click();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          p: 2, 
          bgcolor: 'white', 
          borderRadius: 1, 
          outline: 'none', 
          width: '80%', 
          maxWidth: '800px', 
          height: '80vh', // Limitar la altura del modal
          overflowY: 'auto', // Hacer que el contenido sea desplazable si es necesario
          overflowX: 'hidden', // Ocultar la barra de desplazamiento horizontal
          margin: 'auto', 
          mt: 5 
        }}
      >
        <Typography variant="h6" mb={2}>Vista previa del PDF de la orden de trabajo</Typography>
        {pdfUri ? (
          <iframe
            src={pdfUri}
            title="Vista previa de la orden de trabajo"
            width="100%"
            height="650px"
            style={{ border: '1px solid #ccc' }}
          />
        ) : (
          <Typography variant="body1">Cargando...</Typography>
        )}
        <Button variant="contained" color="primary" onClick={handleDownload} sx={{ mt: 2 }}>
          Descargar PDF
        </Button>
      </Box>
    </Modal>
  );
};

export default PDFPreviewModal;