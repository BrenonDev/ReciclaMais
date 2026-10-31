export interface AuthService {
  isAuthenticated(): boolean;
  signIn(email: string, password: string): Promise<boolean>;
  signOut(): void;
}

export const DEMO_CREDENTIALS = { email: 'admin@recicla.mais', password: 'recicla2026' };

/**
 * Apenas para demonstrar o fluxo do requisito 11. Validar senha no navegador não
 * protege nada: a autenticação real deve ser feita pelo back-end.
 */
export class DemoAuthService implements AuthService {
  private static readonly KEY = 'recicla-mais:sessao';
  private readonly storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

  constructor(storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>) {
    this.storage = storage;
  }

  isAuthenticated(): boolean {
    return this.storage.getItem(DemoAuthService.KEY) === 'ativa';
  }

  async signIn(email: string, password: string): Promise<boolean> {
    const valid =
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
    if (valid) this.storage.setItem(DemoAuthService.KEY, 'ativa');
    return valid;
  }

  signOut(): void {
    this.storage.removeItem(DemoAuthService.KEY);
  }
}
