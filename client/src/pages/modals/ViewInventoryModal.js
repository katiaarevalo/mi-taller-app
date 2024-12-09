// src/modals/ViewInventoryModal.js
import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography, Divider, Box } from '@mui/material';

const ViewInventoryModal = ({ open, onClose, item }) => {
    if (!item) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    backgroundColor: '#ffffff',
                    width: '500px',
                    height: 'auto',
                    maxWidth: 'none',
                    border: '2px solid #000',
                    borderRadius: '8px',
                    padding: '16px',
                },
            }}
        >
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                        Información del artículo
                    </Typography>
                    <Divider />
                    <Typography variant="body1" sx={{ color: 'black' }}>
                        <strong>Nombre:</strong> {item.nombre}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'black' }}>
                        <strong>Cantidad:</strong> {item.cantidad}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'black' }}>
                        <strong>Descripción:</strong> {item.descripcion}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'black' }}>
                        <strong>Categoría:</strong> {item.categoria} {/* Mostrar la categoría */}
                    </Typography>
                </Box>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 'bold', color: 'black' }}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewInventoryModal;
