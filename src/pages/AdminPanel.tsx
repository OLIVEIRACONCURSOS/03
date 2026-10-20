import React, { useState } from 'react';
import { Shield, BookOpen, Users, ShoppingBag, BarChart3, Settings as SettingsIcon, CheckCircle, XCircle, Plus, Edit2, Trash2, Search, Eye, Lock, Unlock, DollarSign, RefreshCw, AlertTriangle, FileText } from 'lucide-react';
import { db } from '../db/schema';
import { courseService } from '../services/courses';
import { orderService } from '../services/orders';
import { authService } from '../services/auth';
import { Course, Order, User, PlatformSettings, CourseCategory, CoursePhase, CourseModalidade, CourseStatus } from '../types';

export const AdminPanel: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'orders' | 'students' | 'settings'>('dashboard');
  
  // States for data refresh
  const [courses, setCourses] = useState<Course[]>(courseService.getAllCourses());
  const [orders, setOrders] = useState<Order[]>(orderService.getAllOrders());
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [settings, setSettings] = useState<PlatformSettings>(db.getSettings());

  // Course Modal state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'OAB' as CourseCategory,
    institution: 'CEISC',
    exam: '48º Exame de Ordem',
    phase: '1ª fase' as CoursePhase,
    discipline: '',
    description: '',
    shortDescription: '',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    modalidade: 'extensivo' as CourseModalidade,
    pricePix: 80,
    priceCard: 85,
    contents: 'Videoaulas, PDFs, Cronograma',
    driveLink: '',
    status: 'published' as CourseStatus,
    isFeatured: false,
    isPromotion: false
  });

  // Settings Form
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsMessage, setSettingsMessage] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F3F5F8] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-4 border-red-600">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#071A33] mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-6">Você precisa estar autenticado como administrador para acessar este painel.</p>
          <a href="/login" className="bg-[#071A33] text-white font-bold px-6 py-3 rounded-lg block hover:bg-[#D4AF37] hover:text-[#071A33] transition-colors">
            Fazer Login como Administrador
          </a>
        </div>
      </div>
    );
  }

  // Handlers for Orders
  const handleApproveOrder = (orderId: string) => {
    orderService.confirmPayment(orderId, currentUser.id);
    setOrders(orderService.getAllOrders());
  };

  const handleCancelOrder = (orderId: string) => {
    const allOrders = orderService.getAllOrders();
    const updated = allOrders.map(o => o.id === orderId ? { ...o, status: 'Cancelado' as const } : o);
    db.saveOrders(updated);
    setOrders(orderService.getAllOrders());
  };

  // Handlers for Courses
  const handleOpenNewCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      title: '',
      category: 'OAB',
      institution: 'CEISC',
      exam: '48º Exame de Ordem',
      phase: '1ª fase',
      discipline: '',
      description: '',
      shortDescription: '',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
      modalidade: 'extensivo',
      pricePix: 80,
      priceCard: 85,
      contents: 'Videoaulas, PDFs, Cronograma',
      driveLink: '',
      status: 'published',
      isFeatured: false,
      isPromotion: false
    });
    setIsCourseModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      category: course.category,
      institution: course.institution,
      exam: course.exam,
      phase: course.phase || '1ª fase',
      discipline: course.discipline || '',
      description: course.description,
      shortDescription: course.shortDescription || '',
      image: course.image,
      modalidade: course.modalidade,
      pricePix: course.pricePix,
      priceCard: course.priceCard,
      contents: course.contents.join(', '),
      driveLink: course.driveLink || '',
      status: course.status,
      isFeatured: course.isFeatured || false,
      isPromotion: course.isPromotion || false
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const contentsArr = courseForm.contents.split(',').map(s => s.trim()).filter(Boolean);
    
    if (editingCourse) {
      courseService.updateCourse(editingCourse.id, {
        ...courseForm,
        contents: contentsArr
      });
    } else {
      courseService.createCourse({
        ...courseForm,
        contents: contentsArr
      });
    }
    setCourses(courseService.getAllCourses());
    setIsCourseModalOpen(false);
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      courseService.deleteCourse(id);
      setCourses(courseService.getAllCourses());
    }
  };

  // Handlers for Students
  const handleToggleUserStatus = (userId: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, status: (u.status === 'blocked' ? 'active' : 'blocked') as const };
      }
      return u;
    });
    db.saveUsers(updated);
    setUsers(db.getUsers());
  };

  // Handlers for Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveSettings(settingsForm);
    setSettings(db.getSettings());
    setSettingsMessage('Configurações salvas com sucesso!');
    setTimeout(() => setSettingsMessage(''), 3000);
  };

  // Dashboard Stats
  const totalOrdersCount = orders.length;
  const approvedOrders = orders.filter(o => o.status === 'Pagamento Aprovado' || o.status === 'Acesso Liberado');
  const pendingOrders = orders.filter(o => o.status === 'Aguardando Pagamento' || o.status === 'Aguardando Confirmação Manual');
  const totalRevenue = approvedOrders.reduce((acc, o) => acc + o.total, 0);
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.status === 'published').length;

  return (
    <div className="min-h-screen bg-[#F3F5F8] text-[#071A33] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#071A33] text-white flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37] flex items-center justify-center text-[#071A33] font-extrabold">
              OC
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">PAINEL ADMIN</h1>
              <p className="text-xs text-[#D4AF37]">Oliveira Concursos</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${activeTab === 'dashboard' ? 'bg-[#D4AF37] text-[#071A33] font-bold' : 'text-gray-300 hover:bg-white/10'}`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard & Métricas</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${activeTab === 'courses' ? 'bg-[#D4AF37] text-[#071A33] font-bold' : 'text-gray-300 hover:bg-white/10'}`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Gestão de Cursos</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${activeTab === 'orders' ? 'bg-[#D4AF37] text-[#071A33] font-bold' : 'text-gray-300 hover:bg-white/10'}`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Gestão de Pedidos</span>
              {pendingOrders.length > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {pendingOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${activeTab === 'students' ? 'bg-[#D4AF37] text-[#071A33] font-bold' : 'text-gray-300 hover:bg-white/10'}`}
            >
              <Users className="w-5 h-5" />
              <span>Alunos e Cadastros</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${activeTab === 'settings' ? 'bg-[#D4AF37] text-[#071A33] font-bold' : 'text-gray-300 hover:bg-white/10'}`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span>Configurações</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-gray-400 mb-2">Logado como: <span className="text-white font-bold">{currentUser.name}</span></div>
          <a
            href="/"
            className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg text-center block text-sm transition-colors"
          >
            Voltar ao site principal
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-[#071A33]">Dashboard e Relatórios</h1>
              <p className="text-gray-600 text-sm">Visão geral do desempenho comercial e operacoes da plataforma.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-[#D4AF37]">
                <div className="text-xs text-gray-500 font-medium uppercase">Faturamento Aprovado</div>
                <div className="text-3xl font-extrabold text-[#071A33] mt-2">R$ {totalRevenue.toFixed(2)}</div>
                <div className="text-xs text-emerald-600 mt-1 font-medium">{approvedOrders.length} pedidos aprovados</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-amber-500">
                <div className="text-xs text-gray-500 font-medium uppercase">Aguardando Confirmação Pix</div>
                <div className="text-3xl font-extrabold text-amber-600 mt-2">{pendingOrders.length}</div>
                <div className="text-xs text-gray-500 mt-1">Requer conferência de comprovante</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-600">
                <div className="text-xs text-gray-500 font-medium uppercase">Alunos Cadastrados</div>
                <div className="text-3xl font-extrabold text-[#071A33] mt-2">{totalStudents}</div>
                <div className="text-xs text-blue-600 mt-1 font-medium">Contas ativas na plataforma</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-emerald-600">
                <div className="text-xs text-gray-500 font-medium uppercase">Cursos Publicados</div>
                <div className="text-3xl font-extrabold text-[#071A33] mt-2">{publishedCourses} / {totalCourses}</div>
                <div className="text-xs text-emerald-600 mt-1 font-medium">Disponíveis no catálogo</div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-lg text-[#071A33] mb-4">Pedidos Recentes</h3>
              {orders.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">Nenhum pedido registrado até o momento.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                      <tr>
                        <th className="p-3">Pedido</th>
                        <th className="p-3">Aluno</th>
                        <th className="p-3">Cursos</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Pagamento</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-[#071A33]">{order.orderNumber}</td>
                          <td className="p-3">
                            <div className="font-medium text-gray-900">{order.userName}</div>
                            <div className="text-xs text-gray-500">{order.userEmail}</div>
                          </td>
                          <td className="p-3 text-xs text-gray-600">
                            {order.items.map(i => i.courseTitle).join(', ')}
                          </td>
                          <td className="p-3 font-bold text-emerald-700">R$ {order.total.toFixed(2)}</td>
                          <td className="p-3 uppercase text-xs font-semibold">{order.paymentMethod}</td>
                          <td className="p-3">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                              order.status === 'Pagamento Aprovado' || order.status === 'Acesso Liberado'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'Cancelado'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3">
                            {(order.status === 'Aguardando Confirmação Manual' || order.status === 'Aguardando Pagamento') && (
                              <button
                                onClick={() => handleApproveOrder(order.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded font-bold transition-colors"
                              >
                                Aprovar Pix
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-[#071A33]">Gestão de Cursos e Produtos</h1>
                <p className="text-gray-600 text-sm">Cadastre, edite ou altere preços e disponibilidades do catálogo.</p>
              </div>
              <button
                onClick={handleOpenNewCourse}
                className="bg-[#D4AF37] hover:bg-[#c29d2f] text-[#071A33] font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Curso</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                    <tr>
                      <th className="p-4">Curso</th>
                      <th className="p-4">Categoria</th>
                      <th className="p-4">Instituição / Exame</th>
                      <th className="p-4">Preço Pix</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {courses.map(course => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={course.image} alt={course.title} className="w-12 h-12 rounded object-cover border" />
                            <div>
                              <div className="font-bold text-[#071A33]">{course.title}</div>
                              <div className="text-xs text-gray-500">{course.modalidade} {course.phase ? `• ${course.phase}` : ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-gray-700">{course.category}</td>
                        <td className="p-4 text-gray-600">
                          <div>{course.institution}</div>
                          <div className="text-xs text-gray-400">{course.exam}</div>
                        </td>
                        <td className="p-4 font-bold text-emerald-700">R$ {course.pricePix.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            course.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : course.status === 'draft'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {course.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="bg-gray-100 hover:bg-gray-200 text-[#071A33] p-2 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#071A33]">Gestão de Pedidos e Pagamentos Pix</h1>
              <p className="text-gray-600 text-sm">Confirme pagamentos manuais via Pix e libere os acessos aos alunos.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                    <tr>
                      <th className="p-4">Pedido</th>
                      <th className="p-4">Comprador</th>
                      <th className="p-4">Itens</th>
                      <th className="p-4">Valor Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Ações de Aprovação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="p-4 font-bold text-[#071A33]">
                          <div>{order.orderNumber}</div>
                          <div className="text-xs text-gray-400 font-normal">{new Date(order.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{order.userName}</div>
                          <div className="text-xs text-gray-500">{order.userEmail}</div>
                        </td>
                        <td className="p-4 text-xs text-gray-600">
                          {order.items.map((item, i) => (
                            <div key={i}>• {item.courseTitle} (R$ {item.priceUnit.toFixed(2)})</div>
                          ))}
                        </td>
                        <td className="p-4 font-extrabold text-emerald-700">R$ {order.total.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Pagamento Aprovado' || order.status === 'Acesso Liberado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Cancelado'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {(order.status === 'Aguardando Confirmação Manual' || order.status === 'Aguardando Pagamento') && (
                            <button
                              onClick={() => handleApproveOrder(order.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-bold shadow transition-colors"
                            >
                              Aprovar Pix
                            </button>
                          )}
                          {order.status !== 'Cancelado' && order.status !== 'Pagamento Aprovado' && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                            >
                              Cancelar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#071A33]">Gestão de Alunos</h1>
              <p className="text-gray-600 text-sm">Consulte os alunos cadastrados e controle o acesso à plataforma.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                    <tr>
                      <th className="p-4">Nome</th>
                      <th className="p-4">E-mail</th>
                      <th className="p-4">Telefone</th>
                      <th className="p-4">Cadastro</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.filter(u => u.role === 'student').map(student => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="p-4 font-bold text-[#071A33]">{student.name}</td>
                        <td className="p-4 text-gray-600">{student.email}</td>
                        <td className="p-4 text-gray-600">{student.phone || 'Não informado'}</td>
                        <td className="p-4 text-gray-500 text-xs">{new Date(student.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            student.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(student.id)}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                              student.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            }`}
                          >
                            {student.status === 'active' ? 'Bloquear Acesso' : 'Ativar Acesso'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#071A33]">Configurações Gerais da Plataforma</h1>
              <p className="text-gray-600 text-sm">Ajuste dados comerciais, chave Pix e número de WhatsApp oficial.</p>
            </div>

            {settingsMessage && (
              <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 p-4 rounded-lg font-medium">
                {settingsMessage}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nome da Marca</label>
                  <input
                    type="text"
                    value={settingsForm.brandName}
                    onChange={e => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                    className="w-full p-3 border rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Slogan</label>
                  <input
                    type="text"
                    value={settingsForm.slogan}
                    onChange={e => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                    className="w-full p-3 border rounded-lg text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Comercial (com DDI e DDD)</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full p-3 border rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">E-mail de Suporte</label>
                  <input
                    type="email"
                    value={settingsForm.supportEmail}
                    onChange={e => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                    className="w-full p-3 border rounded-lg text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Chave Pix para Pagamento</label>
                  <input
                    type="text"
                    value={settingsForm.pixKey}
                    onChange={e => setSettingsForm({ ...settingsForm, pixKey: e.target.value })}
                    className="w-full p-3 border rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nome do Beneficiário Pix</label>
                  <input
                    type="text"
                    value={settingsForm.pixBeneficiary}
                    onChange={e => setSettingsForm({ ...settingsForm, pixBeneficiary: e.target.value })}
                    className="w-full p-3 border rounded-lg text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Link do Canal de Promoções do WhatsApp</label>
                <input
                  type="url"
                  value={settingsForm.promoChannelUrl}
                  onChange={e => setSettingsForm({ ...settingsForm, promoChannelUrl: e.target.value })}
                  className="w-full p-3 border rounded-lg text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-[#071A33] hover:bg-[#D4AF37] hover:text-[#071A33] text-white font-bold px-8 py-3 rounded-lg transition-colors shadow"
              >
                Salvar Configurações
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Course Create/Edit Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h3 className="text-xl font-bold text-[#071A33]">
                {editingCourse ? 'Editar Curso' : 'Cadastrar Novo Curso'}
              </h3>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Título do Curso</label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full p-3 border rounded-lg text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Categoria</label>
                  <select
                    value={courseForm.category}
                    onChange={e => setCourseForm({ ...courseForm, category: e.target.value as CourseCategory })}
                    className="w-full p-3 border rounded-lg text-sm"
                  >
                    <option value="OAB">OAB</option>
                    <option value="Concursos Públicos">Concursos Públicos</option>
                    <option value="Carreiras Jurídicas">Carreiras Jurídicas</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Instituição</label>
                  <input
                    type="text"
                    value={courseForm.institution}
                    onChange={e => setCourseForm({ ...courseForm, institution: e.target.value })}
                    className="w-full p-3 border rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Exame / Concurso</label>
                  <input
                    type="text"
                    value={courseForm.exam}
                    onChange={e => setCourseForm({ ...courseForm, exam: e.target.value })}
                    className="w-full p-3 border rounded-lg text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Fase</label>
                  <select
                    value={courseForm.phase}
                    onChange={e => setCourseForm({ ...courseForm, phase: e.target.value as CoursePhase })}
                    className="w-full p-3 border rounded-lg text-sm"
                  >
                    <option value="1ª fase">1ª fase</option>
                    <option value="2ª fase">2ª fase</option>
                    <option value="Geral">Geral</option>
                    <option value="Intensivo">Intensivo</option>
                    <option value="Extensivo">Extensivo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Modalidade</label>
                  <select
                    value={courseForm.modalidade}
                    onChange={e => setCourseForm({ ...courseForm, modalidade: e.target.value as CourseModalidade })}
                    className="w-full p-3 border rounded-lg text-sm"
                  >
                    <option value="extensivo">Extensivo</option>
                    <option value="intensivo">Intensivo</option>
                    <option value="ao vivo">Ao Vivo</option>
                    <option value="online">Online</option>
                    <option value="prática">Prática</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={courseForm.status}
                    onChange={e => setCourseForm({ ...courseForm, status: e.target.value as CourseStatus })}
                    className="w-full p-3 border rounded-lg text-sm"
                  >
                    <option value="published">Publicado</option>
                    <option value="draft">Rascunho</option>
                    <option value="archived">Arquivado</option>
                    <option value="unavailable">Indisponível</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Preço Pix (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={courseForm.pricePix}
                    onChange={e => setCourseForm({ ...courseForm, pricePix: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 border rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Preço Cartão (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={courseForm.priceCard}
                    onChange={e => setCourseForm({ ...courseForm, priceCard: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 border rounded-lg text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">URL da Imagem de Capa</label>
                <input
                  type="url"
                  value={courseForm.image}
                  onChange={e => setCourseForm({ ...courseForm, image: e.target.value })}
                  className="w-full p-3 border rounded-lg text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Link do Google Drive (Acesso do Aluno)</label>
                <input
                  type="url"
                  value={courseForm.driveLink}
                  onChange={e => setCourseForm({ ...courseForm, driveLink: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full p-3 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Conteúdos Inclusos (separados por vírgula)</label>
                <input
                  type="text"
                  value={courseForm.contents}
                  onChange={e => setCourseForm({ ...courseForm, contents: e.target.value })}
                  placeholder="Videoaulas, PDFs, Simulados"
                  className="w-full p-3 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Descrição Detalhada</label>
                <textarea
                  value={courseForm.description}
                  onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border rounded-lg text-sm"
                  required
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseForm.isFeatured}
                    onChange={e => setCourseForm({ ...courseForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-[#071A33] rounded"
                  />
                  <span className="text-sm font-medium">Destacar na Página Inicial</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border text-gray-700 font-medium text-sm hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#071A33] hover:bg-[#D4AF37] hover:text-[#071A33] text-white font-bold text-sm transition-colors"
                >
                  Salvar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
