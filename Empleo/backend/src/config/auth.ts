import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Información que viaja dentro del token JWT.
export interface TokenPayload {
  id: number; // id del admin o del cliente
  email: string;
  role: 'ADMIN' | 'CLIENT';
}

// Genera un token firmado válido por 7 días.
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verifica y decodifica un token. Lanza error si es inválido/expirado.
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
