import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ShieldCheck, BookOpen, HelpCircle, FileText, Lock, ExternalLink } from 'lucide-react';
import logoImg from '../assets/uploads/1792457875396-0-Emblema-Dourado-da-Oliveira-Concursos.png';

export const Footer: React.FC = () => {
  const promoChannelUrl = 'https://whatsapp.com/channel/0029VbDUiPKG8l5Fs1V8rh0w';

  return (
    <footer className="bg-[#071A33] text-white pt-16 pb-8 border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner do Canal de Promoções do WhatsApp */}
        <div className="bg-gradient-to-r from-[#071A33] via-[#0d2a54] to-[#071A33] rounded-2xl p-8 mb-12 border border-[#D4AF37]/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-center lg:text-left">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center shrink-0 mx-auto lg:mx-0">
              <MessageCircle className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-2">
                Canal Oficial de Promoções — Oliveira Concursos
              </h3>
              <p className="text-gray-300 text-sm md:text-base max-w-xl">
                Quer economizar na sua preparação? Entre no nosso canal e acompanhe as ofertas exclusivas e materiais para OAB e Concursos!
              </p>
            </div>
          </div>
          <a
            href={promoChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 shrink-0"
          >
            <MessageCircle className="w-5 h-5" />
            <span>ENTRAR NO CANAL DE PROMOÇÕES</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Grade Principal do Rodapé */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Coluna 1: Identidade */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Oliveira Concursos" className="w-12 h-12 object-contain rounded-lg border border-[#D4AF37]/50" />
              <div>
                <span className="font-bold tracking-wider text-[#D4AF37] block text-lg">OLIVEIRA</span>
                <span className="text-xs tracking-widest text-gray-300 uppercase block">CONCURSOS</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Sua aprovação começa aqui! Conhecimento que prepara. Oportunidades que transformam.
            </p>
            <div className="pt-2 text-xs text-gray-400">
              <p>Contato Comercial / WhatsApp:</p>
              <a href="https://wa.me/5571992747496" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] font-semibold hover:underline">
                +55 (71) 99274-7496
              </a>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h4 className="text-[#D4AF37] font-semibold text-base mb-4 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Cursos Preparatórios
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/catalogo?category=OAB&phase=1ª fase" className="hover:text-[#D4AF37] transition-colors">
                  OAB — 1ª Fase (48º Exame)
                </Link>
              </li>
              <li>
                <Link to="/catalogo?category=OAB&phase=2ª fase" className="hover:text-[#D4AF37] transition-colors">
                  OAB — 2ª Fase (Específicas)
                </Link>
              </li>
              <li>
                <Link to="/catalogo?category=Concursos Públicos" className="hover:text-[#D4AF37] transition-colors">
                  Concursos Públicos
                </Link>
              </li>
              <li>
                <Link to="/ofertas" className="hover:text-[#D4AF37] transition-colors">
                  Ofertas Especiais
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Ajuda e Suporte */}
          <div>
            <h4 className="text-[#D4AF37] font-semibold text-base mb-4 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Atendimento
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/suporte" className="hover:text-[#D4AF37] transition-colors">
                  Central de Suporte
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#D4AF37] transition-colors">
                  Perguntas Frequentes (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/aluno" className="hover:text-[#D4AF37] transition-colors">
                  Área do Aluno
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#D4AF37] transition-colors">
                  Painel Administrativo
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Legal & Avisos */}
          <div>
            <h4 className="text-[#D4AF37] font-semibold text-base mb-4 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Legal & Privacidade
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/termos" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#D4AF37]" /> Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#D4AF37]" /> Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé Inferior */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Oliveira Concursos Educacional Ltda. Todos os direitos reservados.</p>
          <p className="text-center md:text-right">
            Sua aprovação começa aqui! Conhecimento que prepara. Oportunidades que transformam.
          </p>
        </div>
      </div>
    </footer>
  );
};
