import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography, Divider, Box } from '@mui/material';

const ViewSupplierModal = ({ open, onClose, supplier }) => {
    if (!supplier) return null;

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
                        Información del proveedor
                    </Typography>
                    <Divider />
                    <Typography variant="body1" sx={{ color: 'black' }}>
                        <strong>Empresa:</strong> {supplier.company}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'black' }}>
                        <strong>Nombre:</strong> {supplier.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'black' }}>
                        <strong>Teléfono:</strong> {supplier.phone}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'black' }}>
                        <strong>Email:</strong> {supplier.email}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'black' }}>
                        <strong>Dirección:</strong> {supplier.address}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'black' }}>
                        <strong>Productos:</strong> {supplier.provides}
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
}

export default ViewSupplierModal;