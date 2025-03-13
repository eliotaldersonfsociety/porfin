import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  // Extraer el token de acceso de las cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  console.log("Access Token:", accessToken);

  if (!accessToken) {
    return NextResponse.json({ message: 'Token de acceso no proporcionado' }, { status: 400 });
  }

  try {
    // Verificar el token y extraer el payload (asumimos que contiene "userId")
    const payload = jwt.verify(accessToken, JWT_SECRET) as { userId: number };
    const userId = payload.userId;

    // Consultar el saldo actual del usuario en la base de datos
    const saldoResult = await db.execute({
      sql: 'SELECT saldo FROM users WHERE id = ?',
      args: [userId],
    });

    if (!saldoResult || saldoResult.rows.length === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const saldo = saldoResult.rows[0].saldo;

    return NextResponse.json({ success: true, saldo });
  } catch (error) {
    console.error('Error al verificar token o consultar saldo:', error);
    return NextResponse.json({ message: 'Error al obtener saldo' }, { status: 500 });
  }
}
