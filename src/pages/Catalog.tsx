import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, BookOpen, Check, ArrowUpDown, Tag } from 'lucide-react';
import { courseService } from '../services/courses';
import { Course, CourseCategory, CoursePhase, CourseModalidade } from '../types';

export const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  
  const searchQueryParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const phaseParam = searchParams.get('phase') || '';

  const [search, setSearch] = useState(searchQueryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedPhase, setSelectedPhase] = useState<string>(phaseParam);
  const [selectedModalidade, setSelectedModalidade] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);

  useEffect(() => {
    const allCourses = courseService.getCourses();
    setCourses(allCourses);
  }, []);

  useEffect(() => {
    setSearch(searchQueryParam);
    setSelectedCategory(categoryParam);
    setSelectedPhase(phaseParam);
  }, [searchQueryParam, categoryParam, phaseParam]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      if (course.status !== 'published') return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchDesc = course.description.toLowerCase().includes(q);
        const matchInst = course.institution.toLowerCase().includes(q);
        const matchExam = course.exam.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchInst && !matchExam) return false;
      }

      if (selectedCategory && course.category !== selectedCategory) {
        return false;
      }

      if (selectedPhase && course.phase !== selectedPhase) {
        return false;
      }

      if (selectedModalidade && course.modalidade !== selectedModalidade) {
        return false;
      }

      if (onlyFeatured && !course.isFeatured) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePix - b.pricePix;
      if (sortBy === 'price-desc') return b.pricePix - a.pricePix;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // Default relevance
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [courses, search, selectedCategory, selectedPhase, selectedModalidade, onlyFeatured, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedPhase('');
    setSelectedModalidade('');
    setOnlyFeatured(false);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#F3F5F8] text-[#071A33] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Title */}
        <div className="mb-8">
          <span className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase">Catálogo Dinâmico</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071A33] mt-1">Cursos Preparatórios Oliveira Concursos</h1>
          <p className="text-gray-600 text-sm mt-2">
            Explore nossa seleção de cursos para OAB, Concursos Públicos e Carreiras Jurídicas. Filtre por fase, modalidade e encontre o material ideal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 font-bold text-[#071A33]">
                <Filter className="w-5 h-5 text-[#D4AF37]" />
                <span>Filtros</span>
              </div>
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-[#071A33] underline font-medium"
              >
                Limpar filtros
              </button>
            </div>

            {/* Search filter */}
            <div>
              <label className="block text-xs font-bold text-[#071A33] uppercase mb-2">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Nome, disciplina, edital..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Category filter */}
            <div>
              <label className="block text-xs font-bold text-[#071A33] uppercase mb-2">Categoria</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-[#D4AF37] bg-white"
              >
                <option value="">Todas as Categorias</option>
                <option value="OAB">OAB</option>
                <option value="Concursos Públicos">Concursos Públicos</option>
                <option value="Carreiras Jurídicas">Carreiras Jurídicas</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* Phase filter */}
            <div>
              <label className="block text-xs font-bold text-[#071A33] uppercase mb-2">Fase / Etapa</label>
              <select
                value={selectedPhase}
                onChange={e => setSelectedPhase(e.target.value)}
                className="w-full p-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-[#D4AF37] bg-white"
              >
                <option value="">Todas as Fases</option>
                <option value="1ª fase">1ª fase</option>
                <option value="2ª fase">2ª fase</option>
                <option value="Intensivo">Intensivo</option>
                <option value="Extensivo">Extensivo</option>
                <option value="Geral">Geral</option>
              </select>
            </div>

            {/* Modalidade filter */}
            <div>
              <label className="block text-xs font-bold text-[#071A33] uppercase mb-2">Modalidade</label>
              <select
                value={selectedModalidade}
                onChange={e => setSelectedModalidade(e.target.value)}
                className="w-full p-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-[#D4AF37] bg-white"
              >
                <option value="">Todas as Modalidades</option>
                <option value="extensivo">Extensivo</option>
                <option value="intensivo">Intensivo</option>
                <option value="ao vivo">Ao Vivo</option>
                <option value="online">Online</option>
                <option value="prática">Prática</option>
              </select>
            </div>

            {/* Featured Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-700 font-medium">
                <input
                  type="checkbox"
                  checked={onlyFeatured}
                  onChange={e => setOnlyFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#071A33] focus:ring-[#D4AF37]"
                />
                <span>Apenas Cursos em Destaque</span>
              </label>
            </div>
          </div>

          {/* Main Content & Course Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 font-medium">
                Exibindo <span className="font-bold text-[#071A33]">{filteredCourses.length}</span> curso(s) encontrado(s)
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 whitespace-nowrap">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="p-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-[#D4AF37] bg-white flex-1 sm:flex-initial"
                >
                  <option value="featured">Mais Relevantes / Destaque</option>
                  <option value="price-asc">Menor Preço (Pix)</option>
                  <option value="price-desc">Maior Preço (Pix)</option>
                  <option value="newest">Data de Cadastro</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#071A33] mb-1">Nenhum curso encontrado</h3>
                <p className="text-gray-500 text-sm mb-6">Tente ajustar os filtros ou remover termos de busca para ver mais opções.</p>
                <button
                  onClick={clearFilters}
                  className="bg-[#071A33] text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-[#D4AF37] hover:text-[#071A33] transition-colors"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative h-44 bg-gray-100">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-[#071A33] text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full border border-[#D4AF37]/40">
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
                        <h3 className="font-bold text-[#071A33] text-base mb-2 line-clamp-2">{course.title}</h3>
                        <p className="text-gray-600 text-xs line-clamp-2 mb-4">{course.shortDescription || course.description}</p>
                      </div>
                      <div>
                        <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-gray-100">
                          <div>
                            <span className="text-[10px] text-gray-500 block uppercase">Pix (à vista)</span>
                            <span className="text-lg font-extrabold text-emerald-700">R$ {course.pricePix.toFixed(2)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-gray-400 block uppercase">Cartão</span>
                            <span className="text-sm font-bold text-gray-700">R$ {course.priceCard.toFixed(2)}</span>
                          </div>
                        </div>
                        <Link
                          to={`/curso/${course.slug}`}
                          className="w-full bg-[#071A33] hover:bg-[#D4AF37] hover:text-[#071A33] text-white font-bold py-2.5 rounded-lg text-center text-sm block transition-colors"
                        >
                          Ver detalhes
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
