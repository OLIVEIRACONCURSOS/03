export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  status: 'active' | 'blocked' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export type CourseCategory = 'OAB' | 'Concursos Públicos' | 'Carreiras Jurídicas' | 'Outros';
export type CoursePhase = '1ª fase' | '2ª fase' | 'Geral' | 'Intensivo' | 'Extensivo';
export type CourseModalidade = 'extensivo' | 'intensivo' | 'ao vivo' | 'online' | 'prática';
export type CourseStatus = 'published' | 'draft' | 'archived' | 'unavailable';

export interface Course {
  id: string;
  title: string;
  slug: string;
  category: CourseCategory;
  institution: string; // ex: CEISC, Flávia Bahia, Vício de Uma Estudante
  exam: string; // ex: 48º Exame de Ordem, PRF, INSS
  phase?: CoursePhase;
  discipline?: string; // ex: Direito Administrativo, Penal
  description: string;
  shortDescription?: string;
  image: string;
  modalidade: CourseModalidade;
  pricePix: number;
  priceCard: number;
  contents: string[]; // ex: ['Videoaulas', 'PDFs', 'Simulados']
  driveLink?: string;
  accessDurationDays?: number;
  status: CourseStatus;
  isFeatured?: boolean;
  isPromotion?: boolean;
  startDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'Aguardando Pagamento'
  | 'Aguardando Confirmação Manual'
  | 'Pagamento Aprovado'
  | 'Em preparação'
  | 'Acesso Liberado'
  | 'Cancelado'
  | 'Reembolsado';

export interface OrderItem {
  courseId: string;
  courseTitle: string;
  priceUnit: number;
  paymentMethod: 'pix' | 'card';
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'pix' | 'card';
  status: OrderStatus;
  createdAt: string;
  confirmedAt?: string;
  confirmedByAdminId?: string;
  receiptUrl?: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  method: 'pix' | 'card';
  expectedAmount: number;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  reference?: string;
  checkedAt?: string;
  approvedBy?: string;
}

export interface CourseAccess {
  id: string;
  userId: string;
  courseId: string;
  orderId: string;
  status: 'active' | 'expired' | 'suspended';
  grantedAt: string;
  expiresAt?: string;
  driveLink?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderId?: string;
  subject: string;
  description: string;
  status: 'aberto' | 'em andamento' | 'resolvido' | 'fechado';
  assignedTo?: string;
  createdAt: string;
  closedAt?: string;
}

export interface PlatformSettings {
  brandName: string;
  slogan: string;
  whatsappNumber: string;
  pixKey: string;
  pixBeneficiary: string;
  supportEmail: string;
  promoChannelUrl: string;
}
