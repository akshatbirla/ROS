import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, ChevronRight, ChevronLeft, Star, ExternalLink, X, BookOpen, Download } from 'lucide-react';
import { useApp } from '../../app/AppContext';

export const PhotoGalleryPage: React.FC = () => {
  const { appSettings } = useApp();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string>('a1');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlbumModal, setSelectedAlbumModal] = useState<any | null>(null);
  const ITEMS_PER_PAGE = 12;

  const gallery = appSettings.photoGallery || [];
  
  const shuffledPhotos = useMemo(() => {
    return [...gallery].sort(() => Math.random() - 0.5);
  }, [gallery]);

  const totalPages = Math.max(1, Math.ceil(shuffledPhotos.length / ITEMS_PER_PAGE));
  const paginatedPhotos = shuffledPhotos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const featuredAlbums = appSettings.featuredAlbums || [];

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-[#F7A81B]/30 text-[#F7A81B] text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#F7A81B]/10">
          <Camera className="w-4 h-4" />
          Visual Memories
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Our <span className="text-[#F7A81B]">Gallery</span></h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Moments frozen in time. Explore the impact, the fellowship, and the joy of serving the community together.
        </p>

        {appSettings.galleryDriveLink && (
          <div className="pt-2">
            <a 
              href={appSettings.galleryDriveLink} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 hover:border-[#F7A81B] transition-all shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#F7A81B]" />
              Open Master Google Drive Archive
            </a>
          </div>
        )}
      </div>

      {/* Drift Wall (Masonry Style) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#D41B2C]" />
            Recent Captures ({gallery.length})
          </h2>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {paginatedPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredId(photo.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="relative overflow-hidden rounded-2xl break-inside-avoid group cursor-pointer border border-white/10 shadow-lg"
            >
              <img 
                src={photo.img} 
                alt={photo.eventName} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center ${
                  hoveredId === photo.id ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="text-center p-4 transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-white font-bold text-lg drop-shadow-md">{photo.eventName}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-6">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <span className="text-slate-400 text-sm font-medium">Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </section>

      {/* Accordion Gallery */}
      <section className="space-y-6 pt-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-[#F7A81B]" />
              Featured Albums
            </h2>
            <p className="text-xs text-slate-400 mt-1">Click any album to expand; tap "Browse Album" to see full highlights and photos.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-[500px] gap-2 md:gap-4 w-full">
          {featuredAlbums.map((album) => {
            const isActive = activeAccordion === album.id;
            return (
              <motion.div
                key={album.id}
                layout
                onClick={() => setActiveAccordion(album.id)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out border border-white/10 ${
                  isActive ? 'flex-[4] md:flex-[5] shadow-2xl shadow-[#F7A81B]/20' : 'flex-[1] opacity-70 hover:opacity-100'
                }`}
              >
                <img 
                  src={album.image} 
                  alt={album.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-[#080B11] via-[#080B11]/25 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-90' : 'opacity-50'}`} />
                
                <div className={`absolute inset-0 p-6 flex flex-col justify-end transition-all duration-500 ${isActive ? 'translate-y-0' : 'translate-y-8'}`}>
                  {isActive ? (
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7A81B] text-slate-950 text-[10px] font-black uppercase tracking-widest">
                        Featured Album
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-white">{album.title}</h3>
                      {album.description && (
                        <p className="text-xs text-slate-300 max-w-xl line-clamp-2">
                          {album.description}
                        </p>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAlbumModal(album);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#F7A81B] hover:text-slate-950 text-white text-xs font-bold transition-all mt-2 cursor-pointer border border-white/15"
                      >
                        Browse Album <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-lg font-bold text-white rotate-[-90deg] origin-bottom-left absolute bottom-12 left-6 whitespace-nowrap hidden md:block">
                      {album.title}
                    </h3>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURED ALBUM BROWSE MODAL (Portaled to document.body)                    */}
      {/* ========================================================================= */}
      {selectedAlbumModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedAlbumModal(null)}
          />

          <div className="relative max-w-4xl w-full bg-[#0E131F] border border-white/15 rounded-3xl overflow-hidden z-10 shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">{selectedAlbumModal.title}</h2>
                  <p className="text-xs text-slate-400">Featured Album Highlights & Photo Gallery</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAlbumModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Cover Banner */}
              <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <img src={selectedAlbumModal.image} alt={selectedAlbumModal.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <p className="text-white text-xs sm:text-sm max-w-2xl font-medium leading-relaxed drop-shadow">
                    {selectedAlbumModal.description || 'Special collection of moments and milestones captured during this landmark event.'}
                  </p>
                </div>
              </div>

              {/* Sub-Photos Gallery */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#F7A81B]" /> Album Photos ({ (selectedAlbumModal.photos || []).length })
                </h3>

                {(selectedAlbumModal.photos || []).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedAlbumModal.photos.map((imgUrl: string, idx: number) => (
                      <div key={idx} className="relative h-44 rounded-2xl overflow-hidden border border-white/10 group shadow-md bg-black/40">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-black/30 border border-white/5 text-center text-xs text-slate-400">
                    No sub-photos attached to this album yet. You can add them in the Settings page!
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">
                Rotaract Club of Acropolis Royals • Visual Archives
              </span>
              <button
                onClick={() => setSelectedAlbumModal(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
