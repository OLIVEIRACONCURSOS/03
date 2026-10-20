import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, CheckCircle, Copy, MessageCircle, ArrowLeft, ShoppingBag, AlertCircle } from 'lucide-react';
import { db } from '../db/schema';
import { authService } from '../services/auth';
import { orderService } from '../services/orders';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const Checkout: React.FC = function CheckoutComponent() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const settings = db.getSettings();

  const [cart, setCart] = useState<any[]>(db.getCart());
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [step, setStep] = useState<'review' | 'success'>('review');
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = cart.reduce((acc, item) => {
    const unitPrice = paymentMethod === 'pix' ? item.pricePix : item.priceCard;
    return acc + unitPrice * (item.quantity || 1);
  }, 0);

  const discount = 0;
  const total = subtotal - discount;

  const handleQuantityChange = (courseId: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.id === courseId) {
        const newQ = (item.quantity || 1) + delta;
        return { ...item, quantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    });
    setCart(updated);
    db.saveCart(updated);
  };

  const handleRemove = (courseId: string) => {
    const updated = cart.filter(item => item.id !== courseId);
    setCart(updated);
    db.saveCart(updated);
  };

  const handleFinishOrder = () => {
    if (!currentUser) {
      setErrorMsg('Você precisa estar logado para finalizar o pedido. Faça login ou crie sua conta.');
      return;
    }
    if (cart.length === 0) {
      setErrorMsg('Seu carrinho está vazio.');
      return;
    }

    const orderItems = cart.map(item => ({
      courseId: item.id,
      courseTitle: item.title,
      priceUnit: paymentMethod === 'pix' ? item.pricePix : item.priceCard,
      paymentMethod,
      quantity: item.quantity || 1
    }));

    const res = orderService.createOrder({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      items: orderItems,
      paymentMethod
    });

    if (res.success && res.order) {
      setCreatedOrder(res.order);
      db.saveCart([]);
      setStep('success');
    } else {
      setErrorMsg(res.message || 'Erro ao gerar pedido.');
    }
  };

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(settings.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (step === 'success' && createdOrder) {
    return (
      <div className="min-h-screen bg-[#F3F5F8] py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center space-y-4 mb-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#071A33]">Pedido Realizado com Sucesso!</h1>
            <p className="text-gray-600">
              Seu pedido <strong className="text-[#071A33]">{createdOrder.orderNumber}</strong> foi registrado e aguarda confirmação de pagamento.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4 mb-8">
            <h2 className="font-bold text-lg text-[#071A33] border-b pb-2 flex items-center justify-between">
              <span>Instruções de Pagamento via Pix</span>
              <span className="text-emerald-700 text-sm font-semibold">R$ {createdOrder.total.toFixed(2)}</span>
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>Para concluir sua matrícula e liberar seu acesso, realize o pagamento via Pix utilizando os dados abaixo:</p>
              
              <div className="bg-white p-4 rounded-lg border border-gray-300 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">Chave Pix ({settings.pixKey.includes('@') ? 'E-mail' : 'CNPJ/CPF/Chave'}):</span>
                  <button
                    onClick={handleCopyPixKey}
                    className="text-[#071A33] hover:text-[#D4AF37] font-bold text-xs flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copiado!' : 'Copiar Chave'}</span>
                  </button>
                </div>
                <div className="font-mono font-bold text-[#071A33] text-base bg-gray-50 p-2.5 rounded border border-gray-200 select-all">
                  {settings.pixKey}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <span className="text-xs text-gray-500 block">Beneficiário</span>
                  <span className="font-bold text-[#071A33]">{settings.pixBeneficiary}</span>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <span className="text-xs text-gray-500 block">Valor Exato</span>
                  <span className="font-bold text-emerald-700">R$ {createdOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Após realizar o pagamento, envie o comprovante pelo WhatsApp para agilizar a conferência e liberação do acesso pelo administrador.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WhatsAppButton
              orderNumber={createdOrder.orderNumber}
              label="Enviar Comprovante pelo WhatsApp"
              className="w-full sm:w-auto py-3 px-6 text-base"
            />
            <Link
              to="/aluno"
              className="bg-[#071A33] hover:bg-[#D4AF37] hover:text-[#071A33] text-white font-bold px-6 py-3 rounded-lg transition-colors text-center shadow"
            >
              Ir para Minha Área do Aluno
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F5F8] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/catalogo" className="text-[#071A33] hover:text-[#D4AF37] font-semibold text-sm flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Continuar comprando</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#071A33]">Checkout e Pagamento</h1>
        </div>

        {!currentUser && (
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-900">
                Você precisa estar autenticado para concluir sua compra.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/login" className="bg-[#071A33] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#D4AF37] hover:text-[#071A33] transition-colors">
                Entrar
              </Link>
              <Link to="/login" className="bg-white border border-[#071A33] text-[#071A33] px-4 py-2 rounded-lg font-bold text-xs hover:bg-gray-100 transition-colors">
                Criar Conta
              </Link>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl mb-6 text-sm">
            {errorMsg}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center space-y-4">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
            <h2 className="text-xl font-bold text-[#071A33]">Seu carrinho está vazio</h2>
            <p className="text-gray-500 text-sm">Adicione cursos ao carrinho para prosseguir com o checkout.</p>
            <Link
              to="/catalogo"
              className="inline-block bg-[#071A33] hover:bg-[#D4AF37] hover:text-[#071A33] text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Explorar Cursos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="font-bold text-lg text-[#071A33] mb-4 pb-2 border-b">Itens do Pedido</h2>
                <div className="space-y-4">
                  {cart.map(item => {
                    const unitPrice = paymentMethod === 'pix' ? item.pricePix : item.priceCard;
                    return (
                      <div key={item.id} className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg border" />
                          <div>
                            <h3 className="font-bold text-[#071A33] text-sm line-clamp-1">{item.title}</h3>
                            <span className="text-xs text-gray-500">{item.institution} • {item.exam}</span>
                            <div className="text-emerald-700 font-bold text-sm mt-1">
                              R$ {unitPrice.toFixed(2)} ({paymentMethod === 'pix' ? 'Pix' : 'Cartão'})
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="font-bold text-lg text-[#071A33] mb-4 pb-2 border-b">Forma de Pagamento</h2>
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'pix' ? 'border-[#D4AF37] bg-amber-50/40' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'pix'}
                        onChange={() => setPaymentMethod('pix')}
                        className="w-4 h-4 text-[#071A33]"
                      />
                      <div>
                        <span className="font-bold text-[#071A33] block">Pix Manual (Aprovação rápida)</span>
                        <span className="text-xs text-gray-600">Desconto especial aplicado no valor à vista.</span>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-extrabold">Melhor preço</span>
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#D4AF37] bg-amber-50/40' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="w-4 h-4 text-[#071A33]"
                      />
                      <div>
                        <span className="font-bold text-[#071A33] block">Cartão de Crédito</span>
                        <span className="text-xs text-gray-600">Preço padrão conforme tabela comercial.</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-6 space-y-6">
                <h2 className="font-bold text-lg text-[#071A33] pb-2 border-b">Resumo do Pedido</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#071A33]">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Desconto</span>
                    <span className="font-medium text-emerald-600">R$ {discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold text-[#071A33] pt-3 border-t">
                    <span>Total</span>
                    <span className="text-emerald-700">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleFinishOrder}
                  className="w-full bg-[#D4AF37] hover:bg-[#c29d2f] text-[#071A33] font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  <span>Finalizar Pedido</span>
                </button>

                <p className="text-xs text-center text-gray-500">
                  Ao finalizar, você receberá o número do pedido e as instruções para efetuar o pagamento via Pix ou Cartão.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};