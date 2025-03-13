export interface User {
  id?: number;           // ID opcional, lo que podría incluirse en la respuesta del backend
  name: string;          // Nombre del usuario
  lastname: string;      // Apellido del usuario
  email: string;         // El correo electrónico del usuario
  password: string;      // Contraseña (solo se envía al registrar o autenticar)
  direction?: string;    // Dirección (solo al registrar, opcional)
  postalcode?: string;   // Código postal (solo al registrar, opcional)
  saldo?: number;        // Saldo del usuario, puede estar en la respuesta de login o al consultar
  isAdmin?: boolean;     // Indicar si el usuario es administrador, opcional
}
