import { User, Course, Order, PaymentRecord, CourseAccess, SupportTicket, PlatformSettings } from '../types';

const STORAGE_KEYS = {
  USERS: 'oliveira_users_v1',
  COURSES: 'oliveira_courses_v1',
  ORDERS: 'oliveira_orders_v1',
  PAYMENTS: 'oliveira_payments_v1',
  ACCESS: 'oliveira_access_v1',
  SUPPORT: 'oliveira_support_v1',
  SETTINGS: 'oliveira_settings_v1',
  CURRENT_USER: 'oliveira_current_user_v1',
  CART: 'oliveira_cart_v1',
};

export const initialSettings: PlatformSettings = {
  brandName: 'OLIVEIRA CONCURSOS',
  slogan: 'Sua Aprovação Começa Aqui!',
  whatsappNumber: '5571992747496',
  pixKey: '00.123.456/0001-89',
  pixBeneficiary: 'Oliveira Concursos Educacional Ltda',
  supportEmail: 'suporte@oliveiraconcursos.com.br',
  promoChannelUrl: 'https://whatsapp.com/channel/0029VbDUiPKG8l5Fs1V8rh0w',
};

export const initialCourses: Course[] = [
  {
    id: 'oab-extensivo-48',
    title: 'CEISC Extensivo Premium — 48º Exame',
    slug: 'ceisc-extensivo-premium-48-exame',
    category: 'OAB',
    institution: 'CEISC',
    exam: '48º Exame de Ordem',
    phase: '1ª fase',
    description: 'Curso preparatório completo extensivo para o 48º Exame de Ordem com foco na 1ª fase. Material atualizado e videoaulas aprofundadas.',
    shortDescription: 'Preparação completa para a 1ª fase do 48º Exame com cronograma de 120 dias.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    modalidade: 'extensivo',
    pricePix: 497.00,
    priceCard: 547.00,
    contents: ['Videoaulas', 'Arquivos em PDF', 'Cronograma de estudos', 'Simulados', 'Banco de questões'],
    accessDurationDays: 120,
    status: 'published',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'oab-intensivo-48',
    title: 'CEISC Intensivo — 48º Exame',
    slug: 'ceisc-intensivo-48-exame',
    category: 'OAB',
    institution: 'CEISC',
    exam: '48º Exame de Ordem',
    phase: '1ª fase',
    description: 'Curso intensivo focado nos temas mais cobrados pela FGV no 48º Exame de Ordem.',
    shortDescription: 'Foco total na reta final para a 1ª fase da OAB com cronograma de 90 dias.',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800',
    modalidade: 'intensivo',
    pricePix: 397.00,
    priceCard: 437.00,
    contents: ['Videoaulas', 'PDFs direcionados', 'Simulados de reta final'],
    accessDurationDays: 90,
    status: 'published',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'oab-vicio-120',
    title: 'Vício de Uma Estudante — Extensivo 48º Exame',
    slug: 'vicio-de-uma-estudante-extensivo-48',
    category: 'OAB',
    institution: 'Vício de Uma Estudante',
    exam: '48º Exame de Ordem',
    phase: '1ª fase',
    description: 'Metodologia testada e aprovada para preparação de excelência rumo à vermelhinha.',
    shortDescription: 'Cronograma completo de 120 dias com foco em alta performance.',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800',
    modalidade: 'extensivo',
    pricePix: 450.00,
    priceCard: 490.00,
    contents: ['Videoaulas', 'PDFs', 'Cronograma detalhado', 'Tutoriais'],
    accessDurationDays: 120,
    status: 'published',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'oab-vicio-90',
    title: 'Vício de Uma Estudante — Intensivo 48º Exame',
    slug: 'vicio-de-uma-estudante-intensivo-48',
    category: 'OAB',
    institution: 'Vício de Uma Estudante',
    exam: '48º Exame de Ordem',
    phase: '1ª fase',
    description: 'Intensivo estratégico com início confirmado para 12/10.',
    shortDescription: 'Cronograma de 90 dias focado nos conteúdos essenciais.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    modalidade: 'intensivo',
    pricePix: 380.00,
    priceCard: 420.00,
    contents: ['Videoaulas', 'PDFs', 'Simulados'],
    accessDurationDays: 90,
    startDate: '2025-10-12',
    status: 'published',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'oab-2fase-adm',
    title: 'Direito Administrativo — CEISC (2ª Fase 48º Exame)',
    slug: 'direito-administrativo-ceisc-2-fase-48',
    category: 'OAB',
    institution: 'CEISC',
    exam: '48º Exame de Ordem',
    phase: '2ª fase',
    discipline: 'Direito Administrativo',
    description: 'Preparação especializada para a 2ª fase do 48º Exame de Ordem em Direito Administrativo.',
    shortDescription: 'Peças práticas, resoluções de questões discursivas e simulados corrigidos.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    modalidade: 'prática',
    pricePix: 80.00,
    priceCard: 85.00,
    contents: ['Videoaulas de Peças', 'Material em PDF', 'Simulados com correção'],
    accessDurationDays: 90,
    status: 'published',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'oab-2fase-civil',
    title: 'Direito Civil — CEISC (2ª Fase 48º Exame)',
    slug: 'direito-civil-ceisc-2-fase-48',
    category: 'OAB',
    institution: 'CEISC',
    exam: '48º Exame de Ordem',
    phase: '2ª fase',
    discipline: 'Direito Civil',
    description: 'Domine a elaboração de peças e fundamentação para a 2ª fase em Direito Civil.',
    shortDescription: 'Treinamento prático intensivo em Direito Civil para a OAB.',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800',
    modalidade: 'prática',
    pricePix: 80.00,
    priceCard: 85.00,
    contents: ['Videoaulas de Peças', 'Material em PDF', 'Simulados'],
    accessDurationDays: 90,
    status: 'published',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'oab-2fase-const-ceisc',
    title: 'Direito Constitucional — CEISC (2ª Fase 48º Exame)',
    slug: 'direito-constitucional-ceisc-2-fase-48',
    category: 'OAB',
    institution: 'CEISC',
    exam: '48º Exame de Ordem',
    phase: '2ª fase',
    discipline: 'Direito Constitucional',
    description: 'Curso focado na 2ª fase de Direito Constitucional com selo CEISC.',
    shortDescription: 'Peças, controle de constitucionalidade e questões discursivas.',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800',
    modalidade: 'prática',
    pricePix: 80.00,
    priceCard: 85.00,
    contents: ['Videoaulas', 'PDFs', 'Simulados práticos'],
    accessDurationDays: 90,
    status: 'published',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'oab-2fase-const-flavia',
    title: 'Direito Constitucional — Flávia Bahia (2ª Fase 48º Exame)',
    slug: 'direito-constitucional-flavia-bahia-2-fase-48',
    category: 'OAB',
    institution: 'Flávia Bahia',
    exam: '48º Exame de Ordem',
    phase: '2ª fase',
    discipline: 'Direito Constitucional',
    description: 'Metodologia renomada da Profa. Flávia Bahia para gabaritar a 2ª fase de Constitucional.',
    shortDescription: 'Aulas magnas, direcionamento de peças e simulados exclusivos.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    modalidade: 'prática',
    pricePix: 80.00,
    priceCard: 85.00,
    contents: ['Videoaulas', 'Caderno de Peças em PDF', 'Simulados'],
    accessDurationDays: 90,
    status: 'published',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'oab-2fase-penal',
    title: 'Direito Penal — CEISC (2ª Fase 48º Exame)',
    slug: 'direito-penal-ceisc-2-fase-48',
    category: 'OAB',
    institution: 'CEISC',
    exam: '48º Exame de Ordem',
    phase: '2ª fase',
    discipline: 'Direito Penal',
    description: 'Prática penal completa: peças processuais, teses defensivas e direito material.',
    shortDescription: 'Treinamento intensivo para a 2ª fase em Direito Penal.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    modalidade: 'prática',
    pricePix: 80.00,
    priceCard: 85.00,
    contents: ['Videoaulas', 'Modelos de Peças', 'Simulados'],
    accessDurationDays: 90,
    status: 'published',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'oab-2fase-empresarial',
    title: 'Direito Empresarial — CEISC (2ª Fase 48º Exame)',
    slug: 'direito-empresarial-ceisc-2-fase-48',
    category: 'OAB',
    institution: 'CEISC',
    exam: '48º Exame de Ordem',
    phase: '2ª fase',
    discipline: 'Direito Empresarial',
    description: 'Sociedades, títulos de crédito e falências aplicados à 2ª fase da OAB.',
    shortDescription: 'Resolução de casos práticos e peças empresariais.',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800',
    modalidade: 'prática',
    pricePix: 80.00,
    priceCard: 85.00,
    contents: ['Videoaulas', 'PDFs', 'Simulados'],
    accessDurationDays: 90,
    status: 'published',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'oab-2fase-trabalho',
    title: 'Direito do Trabalho — CEISC (2ª Fase 48º Exame)',
    slug: 'direito-trabalho-ceisc-2-fase-48',
    category: 'OAB',
    institution: 'CEISC',
    exam: '48º Exame de Ordem',
    phase: '2ª fase',
    discipline: 'Direito do Trabalho',
    description: 'Reclamações trabalhistas, recursos e prática processual para o 48º Exame.',
    shortDescription: 'Domine a CLT e as peças trabalhistas com o CEISC.',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800',
    modalidade: 'prática',
    pricePix: 80.00,
    priceCard: 85.00,
    contents: ['Videoaulas', 'Esquemas de Peças', 'Simulados'],
    accessDurationDays: 90,
    status: 'published',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'oab-2fase-tributario',
    title: 'Direito Tributario — CEISC (2ª Fase 48º Exame)',
    slug: 'direito-tributario-ceisc-2-fase-48',
    category: 'OAB',
    institution: 'CEISC',
    exam: '48º Exame de Ordem',
    phase: '2ª fase',
    discipline: 'Direito Tributário',
    description: 'Ações tributárias, mandados de segurança e defesas fiscais para a 2ª fase.',
    shortDescription: 'Preparação especializada em Direito Tributário.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    modalidade: 'prática',
    pricePix: 80.00,
    priceCard: 85.00,
    contents: ['Videoaulas', 'Modelos e PDFs', 'Simulados'],
    accessDurationDays: 90,
    status: 'published',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialAdminUser: User = {
  id: 'admin-01',
  name: 'Administrador Oliveira',
  email: 'admin@oliveiraconcursos.com.br',
  phone: '71992747496',
  passwordHash: 'admin123',
  role: 'admin',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const initialStudentUser: User = {
  id: 'student-01',
  name: 'Estudante Concurseiro',
  email: 'aluno@oliveiraconcursos.com.br',
  phone: '71988887777',
  passwordHash: 'aluno123',
  role: 'student',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const db = {
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      const initial = [initialAdminUser, initialStudentUser];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },
  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCourses(): Course[] {
    const data = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(initialCourses));
      return initialCourses;
    }
    return JSON.parse(data);
  },
  saveCourses(courses: Course[]): void {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },

  getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) return [];
    return JSON.parse(data);
  },
  saveOrders(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  getPayments(): PaymentRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!data) return [];
    return JSON.parse(data);
  },
  savePayments(payments: PaymentRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  },

  getAccessList(): CourseAccess[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACCESS);
    if (!data) return [];
    return JSON.parse(data);
  },
  saveAccessList(access: CourseAccess[]): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS, JSON.stringify(access));
  },

  getSupportTickets(): SupportTicket[] {
    const data = localStorage.getItem(STORAGE_KEYS.SUPPORT);
    if (!data) return [];
    return JSON.parse(data);
  },
  saveSupportTickets(tickets: SupportTicket[]): void {
    localStorage.setItem(STORAGE_KEYS.SUPPORT, JSON.stringify(tickets));
  },

  getSettings(): PlatformSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
      return initialSettings;
    }
    return JSON.parse(data);
  },
  saveSettings(settings: PlatformSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) return null;
    return JSON.parse(data);
  },
  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getCart(): { courseId: string; quantity: number; paymentMethod: 'pix' | 'card' }[] {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    if (!data) return [];
    return JSON.parse(data);
  },
  saveCart(cart: { courseId: string; quantity: number; paymentMethod: 'pix' | 'card' }[]): void {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }
};
