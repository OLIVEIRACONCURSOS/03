import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, BookOpen, Award, CheckCircle2, ArrowRight, Search, Sparkles, MessageSquare, Scale, GraduationCap, Briefcase, FileText, Check } from 'lucide-react';
import { courseService } from '../services/courses';
import { db } from '../db/schema';
import logoImg from '../assets/uploads/1792457875396-0-Emblema-Dourado-da-Oliveira-Concursos.png';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const settings = db.getSettings();
  const featuredCourses = courseService.filterCourses({ isFeatured: true, status: 'published' }).slice(0, 4);
  const oabCourses = courseService.filterCourses({ category: 'OAB', status: 'published' });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/catalogo');
    }
  };

  const publicCategories = [
    { name: 'Segurança Pública', icon: Shield, count: 'Editais previstos' },
    { name: 'Tribunais', icon: Scale, count: 'Carreiras de destaque' },
    { name: 'Área Administrativa', icon: Briefcase, count: 'Órgãos federais e estaduais' },
    { name: 'Área Fiscal', icon: FileText, count: 'Concursos de alto rendimento' },
    { name: 'Carreiras Jurídicas', icon: GraduationCap, count: 'Magistratura, MP e Defensoria' },
    { name: 'INSS e Previdência', icon: Award, count: 'Alta demanda nacional' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F5F8] text-[#071A33]">
      {/* Hero Banner */}
      <section className="relative bg-[#071A33] text-white py-20 px-4 overflow-hidden border-b-4 border-[#D4AF37]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-4 py-2 rounded-full text-[#D4AF37] font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Plataforma Oficial Preparatória para OAB e Concursos</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              OLIVEIRA CONCURSOS
              <span className="block text-[#D4AF37] text-2xl sm:text-3xl mt-2 font-bold">Sua aprovação começa aqui!</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              “Encontre o curso ideal para sua preparação e estude com materiais selecionados para sua jornada rumo à aprovação.”
            </p>

            {/* Search Box on Hero */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto lg:mx-0 pt-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busque por curso, OAB 48º, concurso, disciplina..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#c29d2f] text-[#071A33] font-bold px-8 py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Buscar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/catalogo"
                className="bg-[#071A33] border-2 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#071A33] text-white font-bold px-8 py-3.5 rounded-lg transition-all shadow-md"
              >
                Explorar cursos
              </Link>
              <a
                href={settings.promoChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-lg transition-colors flex items-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Canal de Promoções WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-2xl bg-gradient-to-b from-[#D4AF37]/30 to-[#071A33] p-4 border-2 border-[#D4AF37]/50 shadow-2xl flex items-center justify-center">
              <img
                src={logoImg}
                alt="Oliveira Concursos"
                className="max-h-full max-w-full object-contain drop-shadow-[0_10px_20px_rgba(212,175,55,0.4)] transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Promo Channel Highlight Banner */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white py-6 px-4 border-y border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 text-white shadow">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#D4AF37]">Quer economizar na sua preparação?</h3>
              <p className="text-gray-200 text-sm">Entre no nosso canal e acompanhe as ofertas exclusivas da Oliveira Concursos no WhatsApp!</p>
            </div>
          </div>
          <a
            href={settings.promoChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#D4AF37] hover:bg-[#c29d2f] text-[#071A33] font-bold px-8 py-3 rounded-lg shadow-lg transition-transform hover:scale-105 whitespace-nowrap"
          >
            ENTRAR NO CANAL DE PROMOÇÕES
          </a>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 border-b border-gray-200 pb-4">
          <div>
            <span className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase">Excelência em Ensino</span>
            <h2 className="text-3xl font-extrabold text-[#071A33] mt-1">Cursos em Destaque</h2>
          </div>
          <Link to="/catalogo" className="text-[#071A33] hover:text-[#D4AF37] font-semibold flex items-center gap-1 mt-3 sm:mt-0 transition-colors">
            <span>Ver catálogo completo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 bg-gray-100">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#071A33] text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full border border-[#D4AF37]/50">
                  {course.category}
                </span>
                {course.phase && (
                  <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {course.phase}
                  </span>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-gray-500 font-medium mb-1">{course.institution} • {course.exam}</div>
                  <h3 className="font-bold text-[#071A33] text-lg mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-gray-600 text-xs line-clamp-2 mb-4">{course.shortDescription || course.description}</p>
                </div>
                <div>
                  <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500 block">Via Pix (à vista)</span>
                      <span className="text-xl font-extrabold text-emerald-700">R$ {course.pricePix.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">Cartão</span>
                      <span className="text-sm font-bold text-gray-700">R$ {course.priceCard.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link
                    to={`/curso/${course.slug}`}
                    className="w-full bg-[#071A33] hover:bg-[#D4AF37] hover:text-[#071A33] text-white font-bold py-2.5 rounded-lg text-center block transition-colors"
                  >
                    Ver detalhes e comprar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OAB Shortcuts Section */}
      <section className="bg-[#071A33] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase">Foco Total na OAB</span>
            <h2 className="text-3xl font-extrabold mt-1">Preparação para o Exame de Ordem</h2>
            <p className="text-gray-300 text-sm mt-2">Escolha sua fase e prepare-se com os melhores cursos para o 48º Exame.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 hover:border-[#D4AF37] p-6 rounded-xl transition-all group">
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:bg-[#D4AF37] group-hover:text-[#071A33] transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">1ª Fase — 48º Exame</h3>
              <p className="text-gray-300 text-sm mb-4">Cursos extensivos e intensivos com simulados, PDFs e videoaulas estratégicas.</p>
              <Link to="/catalogo?category=OAB&phase=1ª fase" className="text-[#D4AF37] font-semibold text-sm inline-flex items-center gap-1 hover:underline">
                <span>Ver cursos de 1ª fase</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white/5 border border-white/10 hover:border-[#D4AF37] p-6 rounded-xl transition-all group">
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:bg-[#D4AF37] group-hover:text-[#071A33] transition-colors">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">2ª Fase — Peças e Prática</h3>
              <p className="text-gray-300 text-sm mb-4">Disciplinas específicas (Administrativo, Civil, Constitucional, Penal, etc.) por apenas R$ 80 no Pix.</p>
              <Link to="/catalogo?category=OAB&phase=2ª fase" className="text-[#D4AF37] font-semibold text-sm inline-flex items-center gap-1 hover:underline">
                <span>Ver disciplinas de 2ª fase</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white/5 border border-white/10 hover:border-[#D4AF37] p-6 rounded-xl transition-all group">
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:bg-[#D4AF37] group-hover:text-[#071A33] transition-colors">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Simulados e Questões</h3>
              <p className="text-gray-300 text-sm mb-4">Banco de questões e simulados comentados para testar seus conhecimentos antes da prova.</p>
              <Link to="/catalogo?category=OAB" className="text-[#D4AF37] font-semibold text-sm inline-flex items-center gap-1 hover:underline">
                <span>Conhecer materiais</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Public Contests Categories Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase">Oportunidades em todo o país</span>
          <h2 className="text-3xl font-extrabold text-[#071A33] mt-1">Concursos Públicos</h2>
          <p className="text-gray-600 text-sm mt-2">Explore as principais áreas de atuação e encontre sua vaga no serviço público.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicCategories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/catalogo?category=Concursos Públicos`)}
                className="bg-white border border-gray-200 hover:border-[#D4AF37] p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#071A33] text-[#D4AF37] flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37] group-hover:text-[#071A33] transition-colors">
                  <IconComponent className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-[#071A33] text-lg group-hover:text-[#D4AF37] transition-colors">{cat.name}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{cat.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Oliveira Concursos */}
      <section className="bg-gray-100 py-16 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#071A33] font-bold text-sm tracking-wider uppercase">Diferenciais</span>
            <h2 className="text-3xl font-extrabold text-[#071A33] mt-1">Por que estudar com a Oliveira Concursos?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 rounded-full bg-[#071A33] text-[#D4AF37] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#071A33] mb-2">Organização dos Materiais</h3>
              <p className="text-gray-600 text-sm">Acesso estruturado por cronogramas claros, videoaulas e PDFs selecionados para otimizar seu tempo de estudo.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 rounded-full bg-[#071A33] text-[#D4AF37] flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#071A33] mb-2">Parcerias e Qualidade</h3>
              <p className="text-gray-600 text-sm">Conteúdos renomados de instituições de excelência como CEISC e professores conceituados para máxima eficácia.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 rounded-full bg-[#071A33] text-[#D4AF37] flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#071A33] mb-2">Suporte via WhatsApp</h3>
              <p className="text-gray-600 text-sm">Atendimento humanizado pós-compra e suporte dedicado para orientar você em todas as etapas da sua jornada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-[#071A33] text-white py-16 px-4 text-center border-t-2 border-[#D4AF37]">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Seu próximo passo começa com uma boa preparação.
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            “Conhecimento que prepara. Oportunidades que transformam.”
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/catalogo"
              className="bg-[#D4AF37] hover:bg-[#c29d2f] text-[#071A33] font-bold px-8 py-3.5 rounded-lg shadow-lg transition-transform hover:scale-105"
            >
              Encontrar meu curso
            </Link>
            <a
              href={settings.promoChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Entrar no Canal de Promoções</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
