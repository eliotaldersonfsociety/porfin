import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Tu archivo de conexión a la base de datos
import bcrypt from 'bcryptjs';
//import axios from 'axios';
import jwt from 'jsonwebtoken';
import { User } from '@/types/user'; // Asegúrate de tener el tipo User adecuado

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRATION = '15m'; // Token de acceso expira en 15 minutos
const REFRESH_TOKEN_EXPIRATION = '7d'; // Refresh token expira en 7 días

export async function POST(request: Request) {
  const { name, lastname, email, password, direction, phone, postalcode } = await request.json(); //recaptchaToken } = await request.json();

  // Verificar que todos los campos estén presentes
  if (!name || !lastname || !email || !password || !direction || !phone || !postalcode) { //!recaptchaToken) {
    return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
  }

  try {
    // Verificar que la clave secreta de reCAPTCHA esté configurada
    //const recaptchaSecret = process.env.RECAPTCHA_SECRET || "";
    //if (!recaptchaSecret) {
      //return NextResponse.json({ message: 'La clave secreta de reCAPTCHA no está configurada.' }, { status: 500 });
    //}

    // Verificar el token del reCAPTCHA
    //const recaptchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;
    //const recaptchaResponse = await axios.post(recaptchaVerificationUrl);

    //if (recaptchaResponse.status !== 200 || !recaptchaResponse.data.success) {
      //return NextResponse.json({ message: 'Fallo en la verificación del reCAPTCHA' }, { status: 400 });
    //}

    // Verificar si el usuario ya existe
    const existingUser = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email],
    });
    if (existingUser && existingUser.rows.length > 0) {
      return NextResponse.json({ message: 'El usuario ya está registrado' }, { status: 400 });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    await db.execute({
      sql: 'INSERT INTO users (name, lastname, email, password, direction, phone, postalcode, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [name, lastname, email, hashedPassword, direction, phone, postalcode, 0]
    });

    // Obtener el usuario recién creado
    const newUser = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email],
    });
    const user = newUser.rows[0];

    if (!user) {
      return NextResponse.json({ message: 'No se pudo encontrar el usuario creado' }, { status: 500 });
    }

    // Generar un token JWT para el nuevo usuario
    const accessToken = jwt.sign(
      { userId: user.id, username: user.name, isAdmin: user.isAdmin, email: user.email },
      process.env.JWT_SECRET || '',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRATION }
    );

    // Guardar el refreshToken en la base de datos
    await db.execute({
      sql: 'UPDATE users SET refresh_token = ? WHERE id = ?',
      args: [refreshToken, user.id],
    });

    const response = NextResponse.json({
      message: 'Registro exitoso',
      token: accessToken,
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    }, { status: 200 });

    const isProduction = process.env.NODE_ENV === 'production';

    // Configuración de las cookies HTTP-only
    // Cookie accessToken (HTTP-only)
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutos
      path: '/',
    });

    // Cookie refreshToken (HTTP-only)
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 días
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json({ message: 'Error en el servidor. Por favor, intente más tarde.' }, { status: 500 });
  }
}