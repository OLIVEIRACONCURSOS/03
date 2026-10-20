import { db } from '../db/schema';
import { Course, CourseCategory, CoursePhase, CourseStatus } from '../types';

export interface CourseFilterParams {
  category?: CourseCategory | 'all';
  phase?: CoursePhase | 'all';
  institution?: string | 'all';
  search?: string;
  isFeatured?: boolean;
  status?: CourseStatus;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'relevance';
}

export const courseService = {
  getAllCourses(): Course[] {
    return db.getCourses();
  },

  getCourseById(id: string): Course | undefined {
    const courses = db.getCourses();
    return courses.find(c => c.id === id);
  },

  getCourseBySlug(slug: string): Course | undefined {
    const courses = db.getCourses();
    return courses.find(c => c.slug === slug);
  },

  createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Course {
    const courses = db.getCourses();
    const newId = `course_${Date.now()}`;
    const now = new Date().toISOString();
    
    // Gerar slug unico
    let slug = courseData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (courses.some(c => c.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newCourse: Course = {
      ...courseData,
      id: newId,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    courses.push(newCourse);
    db.saveCourses(courses);
    return newCourse;
  },

  updateCourse(id: string, updates: Partial<Course>): Course | null {
    const courses = db.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updatedCourse: Course = {
      ...courses[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };

    courses[index] = updatedCourse;
    db.saveCourses(courses);
    return updatedCourse;
  },

  deleteCourse(id: string): boolean {
    const courses = db.getCourses();
    const filtered = courses.filter(c => c.id !== id);
    if (filtered.length === courses.length) return false;
    db.saveCourses(filtered);
    return true;
  },

  filterCourses(params: CourseFilterParams): Course[] {
    let courses = db.getCourses();

    // Status padrao: published, exceto se especificado
    if (params.status) {
      courses = courses.filter(c => c.status === params.status);
    } else {
      courses = courses.filter(c => c.status === 'published');
    }

    if (params.category && params.category !== 'all') {
      courses = courses.filter(c => c.category === params.category);
    }

    if (params.phase && params.phase !== 'all') {
      courses = courses.filter(c => c.phase === params.phase);
    }

    if (params.institution && params.institution !== 'all') {
      courses = courses.filter(c => c.institution.toLowerCase() === params.institution.toLowerCase());
    }

    if (params.isFeatured !== undefined) {
      courses = courses.filter(c => c.isFeatured === params.isFeatured);
    }

    if (params.search && params.search.trim() !== '') {
      const query = params.search.toLowerCase().trim();
      courses = courses.filter(
        c =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.exam.toLowerCase().includes(query) ||
          c.institution.toLowerCase().includes(query) ||
          (c.discipline && c.discipline.toLowerCase().includes(query))
      );
    }

    // Ordenacao
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price-asc':
          courses.sort((a, b) => a.pricePix - b.pricePix);
          break;
        case 'price-desc':
          courses.sort((a, b) => b.pricePix - a.pricePix);
          break;
        case 'newest':
          courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'relevance':
        default:
          courses.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return courses;
  }
};
