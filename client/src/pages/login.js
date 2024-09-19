import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  Typography,
  TextField,
  Stack,
  CardMedia
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import logo from '../images/mitaller_logo.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        username,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);

        //iniciar sesión exitosamente... navega a...
        navigate('/analytics'); // RUTA DE REDIRECCIÓN.
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Credenciales incorrectas');
      } else {
        setError('Ocurrió un error al intentar iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d5f5ff',
        height: '100vh',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '1em',
          bgcolor: '#ffffff',
          boxShadow: (theme) => theme.shadows[2],
          overflow: 'hidden',
        }}
      >
        <Stack
          height="100%"
          width="90%"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          p={3}
        >
          <Stack
            width="100%"
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <CardMedia
              component="img"
              alt="mitaller"
              image={logo}
              sx={{
                width: 200,
                height: 'auto',
                mb: 0,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              ¡Bienvenido!
            </Typography>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              Accede a tu cuenta
            </Typography>

            <Box
              component="form"
              width="100%"
              onSubmit={handleLogin}
            >
              <Stack spacing={2} width="100%">
                <TextField
                  label="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  error={!!error}
                  helperText={error || ""}
                />
                <TextField
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  error={!!error}
                  helperText={error || ""}
                />
                <LoadingButton
                  variant="contained"
                  loading={loading}
                  loadingPosition="end"
                  endIcon={<LoginIcon />}
                  type="submit"
                  sx={{
                    backgroundColor: '#00ADE2',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#008AB4',
                    },
                  }}
                >
                  Ingresar
                </LoadingButton>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};

export default Login;