// pages/register.tsx (o el archivo que estés usando para el formulario de registro)
'use client'; // Marca el componente como del lado del cliente

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha'; // Importar el componente

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [direction, setDirection] = useState('');
  const [postalcode, setPostalcode] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, lastname, email, password, direction, postalcode, recaptchaToken }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      router.push('/login');
    }
  };

  // Callback para manejar el token del reCAPTCHA
  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaToken(value || ''); // Guardar el token en el estado
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Registrarse</h1>
      <div>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Apellido"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Dirección"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Código Postal"
          value={postalcode}
          onChange={(e) => setPostalcode(e.target.value)}
        />
      </div>
      {/* Agregar el componente reCAPTCHA */}
      <div>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY_SITE || ""} // Usa tu clave del sitio reCAPTCHA
          onChange={handleRecaptchaChange} // Maneja el token del reCAPTCHA
        />
      </div>
      <div>
        <button onClick={handleRegister}>Registrarse</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
