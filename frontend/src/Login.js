import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginExitoso }) {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const API_AUTH = 'http://localhost:3000/api/auth';

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const endpoint = esRegistro ? `${API_AUTH}/registro` : `${API_AUTH}/login`;
      const body = esRegistro 
        ? { email, contraseña, nombre }
        : { email, contraseña };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error en la autenticación');
        setCargando(false);
        return;
      }

      // Guardar token y usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      onLoginExitoso(data.usuario);
    } catch (err) {
      setError('Error de conexión: ' + err.message);
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{esRegistro ? 'Registrarse' : 'Iniciar Sesión'}</h1>
        <p className="login-subtitle">Tienda Online</p>

        {error && <div className="error-mensaje">{error}</div>}

        <form onSubmit={handleLogin}>
          {esRegistro && (
            <div className="form-grupo">
              <label>Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                required={esRegistro}
              />
            </div>
          )}

          <div className="form-grupo">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-grupo">
            <label>Contraseña</label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={cargando}>
            {cargando ? 'Cargando...' : (esRegistro ? 'Registrarse' : 'Iniciar Sesión')}
          </button>
        </form>

        <div className="login-toggle">
          <p>
            {esRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
            <button 
              type="button" 
              onClick={() => {
                setEsRegistro(!esRegistro);
                setError('');
                setEmail('');
                setContraseña('');
                setNombre('');
              }}
              className="toggle-btn"
            >
              {esRegistro ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
