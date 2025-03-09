import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenido a Mi Aplicación</h1>
      <p>Por favor, inicia sesión o regístrate para continuar.</p>
      <div style={{ marginTop: '20px' }}>
        <Link href="/login" style={{ marginRight: '10px' }}>
          <button>Iniciar Sesión</button>
        </Link>
        <Link href="/register">
          <button>Registrarse</button>
        </Link>
      </div>
    </div>
  );
}