import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Shield, BookOpen, Clock, FileText, ArrowLeft, MessageSquare, ShoppingCart, Award, Sparkles, Check } from 'lucide-react';
import { courseService } from '../services/courses';
import { db } from '../db/schema';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [selectedOption, setSelectedOption] = useState<string>('CEISC');
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const course = courseService.getCourseBySlug(slug || '');

  if (!course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F3F5F8] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md border border-gray-200">
          <BookOpen className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#071A33] mb-2">Curso não encontrado</h2>
          <p className="text-gray-600 text-sm mb-6">O curso que você está procurando pode ter sido removido ou o link está incorreto.</p>
          <Link
            to="/catalogo"
            className="bg-[#071A33] hover:bg-[#D4AF37] hover:text-[#071A33] text-white font-bold px-6 py-3 rounded-lg transition-colors inline-block"
          >
            Ver Catálogo de Cursos
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const currentCart = db.getCart();
    const existingItem = currentCart.find(i => i.course.id === course.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ course, quantity: 1, paymentMethod: selectedPaymentMethod });
    }
    
    db.saveCart(currentCart);
    setAddedMessage('Curso adicionado ao carrinho com sucesso!');
    setTimeout(() => setAddedMessage(null), 3500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const isConstitucional = course.title.toLowerCase().includes('constitucional');

  return (
    <div className="min-h-screen bg-[#F3F5F8] text-[#071A33] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Link to="/catalogo" className="inline-flex items-center gap-2 text-[#071A33] hover:text-[#D4AF37] font-semibold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Catálogo</span>
          </Link>
        </div>

        {addedMessage && (
          <div className="mb-6 bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6" />
              <span className="font-semibold">{addedMessage}</span>
            </div>
            <Link to="/checkout" className="bg-white text-emerald-800 font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
              Finalizar Pedido
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Box */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
              <div className="relative h-72 sm:h-96 bg-[#071A33]">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A33] via-transparent to-black/30"></div>
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-[#071A33] text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-bold px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                  {course.phase && (
                    <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {course.phase}
                    </span>
                  )}
                  {course.exam && (
                    <span className="bg-white/90 text-[#071A33] text-xs font-bold px-3 py-1 rounded-full">
                      {course.exam}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-[#D4AF37] text-sm font-bold uppercase tracking-wider mb-1">
                    {course.institution}
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                    {course.title}
                  </h1>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#071A33] mb-2">Descrição Completa do Curso</h3>
                  <p className="text-gray-700 leading-relaxed text-base">{course.description}</p>
                </div>

                {isConstitucional && (
                  <div className="bg-[#F3F5F8] p-5 rounded-xl border border-[#D4AF37]/40">
                    <label className="block text-sm font-bold text-[#071A33] mb-2">
                      Selecione a Instituição / Professor(a) para Direito Constitucional:
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedOption('CEISC')}
                        className={`py-3 px-4 rounded-lg font-bold text-sm border transition-all ${
                          selectedOption === 'CEISC'
                            ? 'bg-[#071A33] text-[#D4AF37] border-[#D4AF37] shadow-md'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#071A33]'
                        }`}
                      >
                        CEISC
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedOption('Flávia Bahia')}
                        className={`py-3 px-4 rounded-lg font-bold text-sm border transition-all ${
                          selectedOption === 'Flávia Bahia'
                            ? 'bg-[#071A33] text-[#D4AF37] border-[#D4AF37] shadow-md'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#071A33]'
                        }`}
                      >
                        Flávia Bahia
                      </button>
                    </div>
                  </div>
                )}

                {/* Contents Included */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-[#071A33] mb-4">O que está incluído neste curso:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.contents && course.contents.length > 0 ? (
                      course.contents.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 bg-[#F3F5F8] p-3.5 rounded-xl border border-gray-200">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <span className="font-medium text-sm text-[#071A33]">{item}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">Consulte as condições de materiais incluídos na descrição.</div>
                    )}
                  </div>
                </div>

                {/* Additional Info Grid */}
                <div className="border-t border-gray-200 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#F3F5F8] p-4 rounded-xl border border-gray-200">
                    <span className="text-xs text-gray-500 block mb-1 font-medium">Modalidade de Acesso</span>
                    <span className="font-bold text-[#071A33] capitalize">{course.modalidade}</span>
                  </div>
                  <div className="bg-[#F3F5F8] p-4 rounded-xl border border-gray-200">
                    <span className="text-xs text-gray-500 block mb-1 font-medium">Prazo Estimado</span>
                    <span className="font-bold text-[#071A33]">{course.accessDurationDays ? `${course.accessDurationDays} dias` : 'Conforme cronograma'}</span>
                  </div>
                  <div className="bg-[#F3F5F8] p-4 rounded-xl border border-gray-200">
                    <span className="text-xs text-gray-500 block mb-1 font-medium">Plataforma de Entrega</span>
                    <span className="font-bold text-[#071A33]">Área do Aluno / Google Drive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Sidebar Column */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-[#D4AF37]/50 p-6 sticky top-24 space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Investimento</span>
                <div className="mt-2 space-y-3">
                  {/* Pix Option */}
                  <div
                    onClick={() => setSelectedPaymentMethod('pix')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPaymentMethod === 'pix'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
                        PIX (À Vista — Desconto)
                      </span>
                      <input
                        type="radio"
                        checked={selectedPaymentMethod === 'pix'}
                        onChange={() => setSelectedPaymentMethod('pix')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="text-3xl font-extrabold text-emerald-700">
                      R$ {course.pricePix.toFixed(2)}
                    </div>
                  </div>

                  {/* Card Option */}
                  <div
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPaymentMethod === 'card'
                        ? 'border-[#071A33] bg-blue-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-[#071A33] bg-blue-100 px-2.5 py-0.5 rounded">
                        Cartão de Crédito
                      </span>
                      <input
                        type="radio"
                        checked={selectedPaymentMethod === 'card'}
                        onChange={() => setSelectedPaymentMethod('card')}
                        className="text-[#071A33] focus:ring-[#071A33]"
                      />
                    </div>
                    <div className="text-2xl font-bold text-[#071A33]">
                      R$ {course.priceCard.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-[#D4AF37] hover:bg-[#c29d2f] text-[#071A33] font-extrabold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 text-base"
                >
                  <span>Comprar Agora</span>
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#071A33] hover:bg-[#112952] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Adicionar ao Carrinho</span>
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>Acesso seguro após confirmação do pedido</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Suporte humanizado via WhatsApp pós-compra</span>
                </div>
              </div>

              <div className="pt-2">
                <WhatsAppButton
                  courseTitle={course.title}
                  label="Tirar dúvidas no WhatsApp"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
