export interface User {
    id?: number;          // El ID es opcional porque no se envía al registrar un usuario
    email: string;        // El email del usuario
    password: string;     // La contraseña del usuario
  }