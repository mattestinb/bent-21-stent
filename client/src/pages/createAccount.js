import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
//import { Link } from 'react-router-dom';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, TextField, Button, Typography, Box } from '@mui/material';

function Login(props) {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const token='test'
    Auth.login(token);
   };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };



  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Link to="/signup" variant="body2">← Go to Signup</Link>

        <Typography variant="h2" component="h2" sx={{ my: 2 }}>
          ShopWeb Login
        </Typography>
        <Box
            component="form"
            onSubmit={handleFormSubmit}
            sx={{ width: '100%', maxWidth: 360 }}
        >
          <Box sx={{ my: 2 }}>
            <TextField
                fullWidth
                placeholder="youremail@test.com"
                label="Email address"
                name="email"
                type="email"
                id="email"
                onChange={handleChange}
            />
          </Box>
          <Box sx={{ my: 2 }}>
            <TextField
                fullWidth
                placeholder="******"
                label="Password"
                name="password"
                type="password"
                id="pwd"
                onChange={handleChange}
            />
          </Box>
          {error && (
              <Box sx={{ my: 2 }}>
                <Typography variant="body1" color="error">
                  The provided credentials are incorrect
                </Typography>
              </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
  );
}
export default Login;
