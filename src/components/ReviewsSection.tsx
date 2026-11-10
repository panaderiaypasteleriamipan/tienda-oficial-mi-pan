import React, { useState } from 'react';
import { Star, MessageSquarePlus, Check, X, User } from 'lucide-react';
import { Review } from '../types';
import { getStoredReviews, saveStoredReview } from '../utils/storage';

interface ReviewsSectionProps {
  onAddReviewSuccess?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onAddReviewSuccess }) => {
  const [reviews, setReviews] = useState<Review[]>(() => getStoredReviews());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('Los Teques');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      city: city.trim() || 'Los Teques',
      comment: comment.trim(),
      rating,
      date: 'Reciente',
    };

    saveStoredReview(newRev);
    setReviews([newRev, ...reviews]);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
      setAuthor('');
      setComment('');
      setRating(5);
      onAddReviewSuccess?.();
    }, 1200);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-amber-200/50 dark:border-slate-800 bg-amber-50/40 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 text-xs font-bold mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Clientes Satisfechos</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Opiniones de Nuestra Comunidad
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Testimonios de familias en Los Teques, Carrizal y San Antonio de los Altos.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Dejar mi Opinión</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-amber-200/60 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {rev.author}
                  </h4>
                  <p className="text-[11px] text-slate-400">{rev.city}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-amber-200 dark:border-slate-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                Cuéntanos tu Experiencia
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Tu Nombre *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carmen Rodríguez"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Ciudad o Sector
                </label>
                <input
                  type="text"
                  placeholder="Ej. Los Teques / San Antonio"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Calificación
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-500 ml-2">
                    {rating} de 5 estrellas
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Comentario *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="¿Qué tal estuvo el pan, la torta o el servicio de entrega?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                {isSubmitted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Gracias por tu opinión!</span>
                  </>
                ) : (
                  <span>Publicar Opinión</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
