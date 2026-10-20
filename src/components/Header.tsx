import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User as UserIcon, Menu, X, Shield, BookOpen, Sparkles, HelpCircle, LogOut, ChevronDown } from 'lucide-react';
import { authService } from '../services/auth';
import { db } from '../db/schema';
import { User } from '../types';
import logoImg from '../assets/uploads/1792457875396-0-Emblema-Dourado-da-Oliveira-Concursos.png';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recover'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    window.addEventListener('storage', checkUser);
    
    // Atualizar contador do carrinho
    const cart = db.getCart();
    setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));

    return () => {
      window.removeEventListener('storage', checkUser);
    };
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (authMode === 'login') {
      const res = authService.login(email, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthModalOpen(false);
        setEmail('');
        setPassword('');
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/area-aluno');
        }
      } else {
        setAuthError(res.message);
      }
    } else if (authMode === 'register') {
      if (!name || !email || !password) {
        setAuthError('Preencha todos os campos obrigatórios.');
        return;
      }
      const res = authService.register(name, email, phone, password, 'student');
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthModalOpen(false);
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        navigate('/area-aluno');
      } else {
        setAuthError(res.message);
      }
    } else if (authMode === 'recover') {
      const res = authService.recoverPassword(email);
      if (res.success) {
        setAuthSuccess(res.message);
      } else {
        setAuthError(res.message);
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#071A33] text-white shadow-lg border-b border-[#D4AF37]/30">
      {/* Top Bar / Aviso institucional */}
      <div className="bg-[#051326] px-4 py-1.5 text-xs text-center md:text-left border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <span className="text-gray-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <strong>OLIVEIRA CONCURSOS</strong> — Sua Aprovação Começa Aqui!
          </span>
          <div className="flex items-center gap-4 text-gray-300">
            <a 
              href="https://whatsapp.com/channel/0029VbDUiPKG8l5Fs1V8rh0w" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition flex items-center gap-1 text-emerald-400 font-medium"
            >
              <span>Canal Oficial WhatsApp</span>
            </a>
            <span>|</span>
            <Link to="/suporte" className="hover:text-[#D4AF37] transition">
              Central de Suporte
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-[#051326] border border-[#D4AF37] flex items-center justify-center p-1 shadow-md shadow-[#D4AF37]/20 group-hover:scale-105 transition">
              <img src={logoImg} alt="Oliveira Concursos" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wide text-white group-hover:text-[#D4AF37] transition">
                OLIVEIRA
              </span>
              <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-semibold">
                CONCURSOS
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar curso, OAB, concurso, disciplina..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#051326] text-white pl-4 pr-10 py-2.5 rounded-lg border border-white/20 focus:border-[#D4AF37] focus:outline-none text-sm placeholder-gray-400"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37]">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Cart Icon */}
            <Link 
              to="/carrinho" 
              className="relative p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition"
              title="Carrinho de Compras"
            >
              <ShoppingCart className="w-5 h-5 text-[#D4AF37]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#071A33] font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-2 rounded-lg border border-white/20 text-sm transition"
                >
                  <UserIcon className="w-4 h-4 text-[#D4AF37]" />
                  <span className="hidden sm:inline font-medium max-w-[120px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-[#071A33] rounded-lg shadow-xl py-2 border border-gray-200 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Logado como</p>
                      <p className="font-semibold text-sm truncate">{currentUser.email}</p>
                    </div>
                    
                    {currentUser.role === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-100 font-medium text-[#071A33]"
                      >
                        <Shield className="w-4 h-4 text-[#D4AF37]" />
                        Painel Administrativo
                      </Link>
                    ) : (
                      <Link
                        to="/area-aluno"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-100 font-medium"
                      >
                        <BookOpen className="w-4 h-4 text-[#071A33]" />
                        Área do Aluno
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da Conta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                    setAuthSuccess('');
                    setIsAuthModalOpen(true);
                  }}
                  className="hidden sm:inline-flex text-sm font-semibold px-3.5 py-2 rounded-lg text-white hover:bg-white/10 transition"
                >
                  Entrar
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                    setAuthSuccess('');
                    setIsAuthModalOpen(true);
                  }}
                  className="text-sm font-bold px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#c3a131] text-[#071A33] shadow-md transition"
                >
                  Criar Conta
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center justify-between py-3 border-t border-white/10 text-sm font-medium">
          <div className="flex items-center gap-6">
            <Link to="/" className={`hover:text-[#D4AF37] transition ${location.pathname === '/' ? 'text-[#D4AF37] font-bold' : 'text-white'}`}>
              Início
            </Link>
            <Link to="/catalogo?category=OAB" className="hover:text-[#D4AF37] transition text-white">
              Cursos OAB
            </Link>
            <Link to="/catalogo?category=Concursos+Públicos" className="hover:text-[#D4AF37] transition text-white">
              Concursos Públicos
            </Link>
            <Link to="/catalogo?category=Carreiras+Jurídicas" className="hover:text-[#D4AF37] transition text-white">
              Carreiras Jurídicas
            </Link>
            <Link to="/ofertas" className="hover:text-[#D4AF37] transition text-[#D4AF37] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Ofertas
            </Link>
            <Link to="/suporte" className="hover:text-[#D4AF37] transition text-white">
              Suporte
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-300">
            <span>⚖️ 48º Exame de Ordem</span>
            <span>•</span>
            <span>📚 Material em PDF e Videoaulas</span>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#071A33] border-t border-white/10 px-4 pt-3 pb-6 space-y-4 shadow-2xl">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Buscar curso ou concurso..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#051326] text-white pl-4 pr-10 py-2.5 rounded-lg border border-white/20 text-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col space-y-2 font-medium">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/15 text-white"
            >
              Início
            </Link>
            <Link
              to="/catalogo?category=OAB"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/15 text-white"
            >
              Cursos OAB (48º Exame)
            </Link>
            <Link
              to="/catalogo?category=Concursos+Públicos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/15 text-white"
            >
              Concursos Públicos
            </Link>
            <Link
              to="/catalogo?category=Carreiras+Jurídicas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/15 text-white"
            >
              Carreiras Jurídicas
            </Link>
            <Link
              to="/ofertas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/15 text-[#D4AF37] font-bold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Ofertas Especiais
            </Link>
            <Link
              to="/suporte"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/15 text-white flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" /> Central de Suporte
            </Link>
          </div>

          {!currentUser && (
            <div className="pt-3 border-t border-white/10 flex gap-2">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsMobileMenuOpen(false);
                  setAuthError('');
                  setIsAuthModalOpen(true);
                }}
                className="flex-1 py-2.5 rounded-lg border border-white/20 text-center font-semibold text-white"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setIsMobileMenuOpen(false);
                  setAuthError('');
                  setIsAuthModalOpen(true);
                }}
                className="flex-1 py-2.5 rounded-lg bg-[#D4AF37] text-[#071A33] text-center font-bold"
              >
                Criar Conta
              </button>
            </div>
          )}
        </div>
      )}

      {/* Auth Modal (Login / Register / Recover) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white text-[#071A33] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-gray-200">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#071A33] border-2 border-[#D4AF37] flex items-center justify-center mb-3 shadow-md">
                <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#071A33]">
                {authMode === 'login' && 'Entrar na Plataforma'}
                {authMode === 'register' && 'Criar Nova Conta'}
                {authMode === 'recover' && 'Recuperar Senha'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                OLIVEIRA CONCURSOS — Sua aprovação começa aqui!
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria da Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#071A33] focus:outline-none text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#071A33] focus:outline-none text-sm"
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(71) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#071A33] focus:outline-none text-sm"
                  />
                </div>
              )}

              {authMode !== 'recover' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-gray-700">Senha</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('recover');
                          setAuthError('');
                          setAuthSuccess('');
                        }}
                        className="text-xs text-[#071A33] hover:underline font-medium"
                      >
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#071A33] focus:outline-none text-sm"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#071A33] hover:bg-[#051326] text-[#D4AF37] font-bold text-sm tracking-wide shadow-lg transition"
              >
                {authMode === 'login' && 'Entrar na Plataforma'}
                {authMode === 'register' && 'Cadastrar Gratuitamente'}
                {authMode === 'recover' && 'Enviar Instruções'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-600">
              {authMode === 'login' && (
                <p>
                  Não tem uma conta?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setAuthError('');
                      setAuthSuccess('');
                    }}
                    className="text-[#071A33] font-bold hover:underline"
                  >
                    Cadastre-se agora
                  </button>
                </p>
              )}
              {(authMode === 'register' || authMode === 'recover') && (
                <p>
                  Já possui uma conta?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError('');
                      setAuthSuccess('');
                    }}
                    className="text-[#071A33] font-bold hover:underline"
                  >
                    Fazer login
                  </button>
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-gray-400 text-center">
              Área protegida por criptografia. Ao continuar, você concorda com os termos de uso e política de privacidade.
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
