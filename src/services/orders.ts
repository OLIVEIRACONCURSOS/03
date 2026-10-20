import { db } from '../db/schema';
import { Order, OrderItem, OrderStatus, PaymentRecord, CourseAccess } from '../types';
import { courseService } from './courses';

export interface CreateOrderParams {
  userId: string;
  userName: string;
  userEmail: string;
  items: {
    courseId: string;
    quantity: number;
    paymentMethod: 'pix' | 'card';
  }[];
  paymentMethod: 'pix' | 'card';
  discount?: number;
}

export const orderService = {
  getAllOrders(): Order[] {
    return db.getOrders();
  },

  getOrderById(id: string): Order | undefined {
    const orders = db.getOrders();
    return orders.find(o => o.id === id || o.orderNumber === id);
  },

  getOrdersByUser(userId: string): Order[] {
    const orders = db.getOrders();
    return orders.filter(o => o.userId === userId);
  },

  createOrder(params: CreateOrderParams): { success: boolean; message: string; order?: Order } {
    if (!params.items || params.items.length === 0) {
      return { success: false, message: 'O carrinho está vazio.' };
    }

    const courses = courseService.getAllCourses();
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const rawItem of params.items) {
      const course = courses.find(c => c.id === rawItem.courseId);
      if (!course) {
        return { success: false, message: `Curso com ID ${rawItem.courseId} não foi encontrado.` };
      }

      const priceUnit = rawItem.paymentMethod === 'pix' ? course.pricePix : course.priceCard;
      const quantity = rawItem.quantity || 1;

      orderItems.push({
        courseId: course.id,
        courseTitle: course.title,
        priceUnit,
        paymentMethod: rawItem.paymentMethod,
        quantity
      });

      subtotal += priceUnit * quantity;
    }

    const discount = params.discount || 0;
    const total = Math.max(0, subtotal - discount);

    const orderNumber = `OLV-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: `order_${Date.now()}`,
      orderNumber,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      items: orderItems,
      subtotal,
      discount,
      total,
      paymentMethod: params.paymentMethod,
      status: 'Aguardando Confirmação Manual',
      createdAt: now
    };

    const orders = db.getOrders();
    orders.unshift(newOrder);
    db.saveOrders(orders);

    // Criar registro de pagamento pendente
    const payments = db.getPayments();
    const paymentRecord: PaymentRecord = {
      id: `pay_${Date.now()}`,
      orderId: newOrder.id,
      method: params.paymentMethod,
      expectedAmount: total,
      status: 'pendente'
    };
    payments.push(paymentRecord);
    db.savePayments(payments);

    // Limpar carrinho
    db.saveCart([]);

    return { success: true, message: 'Pedido criado com sucesso!', order: newOrder };
  },

  updateOrderStatus(orderId: string, status: OrderStatus, adminId?: string): { success: boolean; message: string; order?: Order } {
    const orders = db.getOrders();
    const index = orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (index === -1) {
      return { success: false, message: 'Pedido não encontrado.' };
    }

    const order = orders[index];
    const now = new Date().toISOString();

    order.status = status;

    if (status === 'Pagamento Aprovado' || status === 'Acesso Liberado') {
      order.confirmedAt = now;
      if (adminId) {
        order.confirmedByAdminId = adminId;
      }

      // Atualizar pagamento correspondente
      const payments = db.getPayments();
      const payIndex = payments.findIndex(p => p.orderId === order.id);
      if (payIndex !== -1) {
        payments[payIndex].status = 'aprovado';
        payments[payIndex].checkedAt = now;
        if (adminId) payments[payIndex].approvedBy = adminId;
        db.savePayments(payments);
      }

      // Liberar acesso aos cursos para o aluno
      const accessList = db.getAccessList();
      for (const item of order.items) {
        const course = courseService.getCourseById(item.courseId);
        // Verificar se ja existe acesso
        const existingAccess = accessList.find(a => a.userId === order.userId && a.courseId === item.courseId);
        if (!existingAccess) {
          const durationDays = course?.accessDurationDays || 90;
          const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

          accessList.push({
            id: `access_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            userId: order.userId,
            courseId: item.courseId,
            orderId: order.id,
            status: 'active',
            grantedAt: now,
            expiresAt,
            driveLink: course?.driveLink || 'https://drive.google.com'
          });
        }
      }
      db.saveAccessList(accessList);
      order.status = 'Acesso Liberado';
    } else if (status === 'Cancelado' || status === 'Reembolsado') {
      const payments = db.getPayments();
      const payIndex = payments.findIndex(p => p.orderId === order.id);
      if (payIndex !== -1) {
        payments[payIndex].status = 'rejeitado';
        db.savePayments(payments);
      }
    }

    orders[index] = order;
    db.saveOrders(orders);

    return { success: true, message: `Status do pedido atualizado para: ${order.status}`, order };
  }
};
