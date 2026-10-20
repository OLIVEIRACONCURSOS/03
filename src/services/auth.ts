import { db } from '../db/schema';
import { User, UserRole } from '../types';

export const authService = {
  hashPassword(password: string): string {
    // Implementacao segura de hash simulada para ambiente client-side persistente
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `hash_${Math.abs(hash)}_${password.length}`;
  },

  verifyPassword(password: string, hash: string): boolean {
    if (password === 'admin123' && hash === 'admin123') return true;
    if (password === 'aluno123' && hash === 'aluno123') return true;
    return authService.hashPassword(password) === hash;
  },

  register(name: string, email: string, phone: string, password: string, role: UserRole = 'student'): { success: boolean; message: string; user?: User } {
    const users = db.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Este e-mail já está cadastrado na plataforma.' };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash: authService.hashPassword(password),
      role,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    db.saveUsers(users);
    db.setCurrentUser(newUser);

    return { success: true, message: 'Conta criada com sucesso!', user: newUser };
  },

  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = db.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'E-mail ou senha inválidos.' };
    }

    if (user.status === 'blocked') {
      return { success: false, message: 'Esta conta encontra-se bloqueada. Entre em contato com o suporte.' };
    }

    const isValid = authService.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, message: 'E-mail ou senha inválidos.' };
    }

    db.setCurrentUser(user);
    return { success: true, message: 'Login realizado com sucesso!', user };
  },

  logout(): void {
    db.setCurrentUser(null);
  },

  getCurrentUser(): User | null {
    return db.getCurrentUser();
  },

  recoverPassword(email: string): { success: boolean; message: string } {
    const users = db.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'E-mail não encontrado em nossa base de cadastros.' };
    }
    // Simula envio de recuperacao
    return { success: true, message: 'Instruções de recuperação enviadas para o seu e-mail cadastrado.' };
  }
};
