/**
 * Script para criar usuário admin no banco Manus
 * Email: admin@univesp.br
 * Senha: 123456
 */

import crypto from 'crypto';

// Gerar hash da senha usando SHA-256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const email = 'admin@univesp.br';
const password = '123456';
const name = 'Administrador';
const passwordHash = hashPassword(password);

// Gerar um openId único (UUID v4)
const openId = crypto.randomUUID();

console.log('🔐 Criando usuário admin no banco Manus...\n');
console.log('📧 Email:', email);
console.log('🔑 Senha:', password);
console.log('🔒 Password Hash:', passwordHash);
console.log('🆔 OpenID:', openId);
console.log('\n📋 Execute este SQL no banco Manus:\n');

const sql = `INSERT INTO users (openId, email, name, role, loginMethod, password_hash) 
VALUES ('${openId}', '${email}', '${name}', 'admin', 'email', '${passwordHash}');`;

console.log(sql);
console.log('\n✅ Depois de executar o SQL, você poderá fazer login com:');
console.log('   Email: admin@univesp.br');
console.log('   Senha: 123456\n');
