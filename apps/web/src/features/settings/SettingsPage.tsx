import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../app/AppContext';
import { 
  Settings, Image as ImageIcon, Type, Layout, ShieldCheck, Plus, Trash2, 
  Users, ChevronUp, ChevronDown, Info, X, Edit2, Camera, Star, UploadCloud, 
  Check, ExternalLink, Link2, Sparkles, FolderPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImageWithFallback } from '../../lib/storageHelper';

export const SettingsPage: React.FC = () => {
  const { appSettings, updateSettings } = useApp();
  
  // New Board of Directors form state
  const [newBod, setNewBod] = useState({
    name: '',
    role: '',
    image: '',
    avenue: ''
  });
  
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Photo Gallery Modal state
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);

  // Flagship projects modal state
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  // Featured Albums modal state
  const [isFeaturedAlbumsModalOpen, setIsFeaturedAlbumsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<any>(null);

  // Helper: File Upload with Supabase Bucket & Local Fallback
  const handleGenericFileUpload = async (
    file: File, 
    uploadKey: string,
    onSuccess: (url: string) => void
  ) => {
    try {
      setUploadingId(uploadKey);
      const url = await uploadImageWithFallback(file);
      onSuccess(url);
    } catch (err) {
      console.error('File upload error:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingId(null);
    }
  };

  // --- Photo Gallery Handlers ---
  const handleUpdateGalleryPhoto = (updatedPhoto: any) => {
    const updatedPhotos = (appSettings.photoGallery || []).map(p => 
      p.id === updatedPhoto.id ? updatedPhoto : p
    );
    updateSettings({ photoGallery: updatedPhotos });
    setEditingPhoto(updatedPhoto);
  };
  
  const handleAddGalleryPhoto = () => {
    const newPhoto = { id: `photo-${Date.now()}`, img: '', eventName: 'New Event' };
    updateSettings({ photoGallery: [newPhoto, ...(appSettings.photoGallery || [])] });
    setEditingPhoto(newPhoto);
  };

  // --- Flagship Project Handlers ---
  const handleUpdateFlagship = (updatedProject: any) => {
    const updatedProjects = (appSettings.flagshipProjects || []).map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    updateSettings({ flagshipProjects: updatedProjects });
    setEditingProject(updatedProject);
  };

  // --- Featured Albums Handlers ---
  const handleUpdateFeaturedAlbum = (updatedAlbum: any) => {
    const updatedAlbums = (appSettings.featuredAlbums || []).map(a => 
      a.id === updatedAlbum.id ? updatedAlbum : a
    );
    updateSettings({ featuredAlbums: updatedAlbums });
    setEditingAlbum(updatedAlbum);
  };

  // --- Board of Directors Handlers ---
  const handleAddBod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBod.name || !newBod.role) return;
    
    const newMember = {
      ...newBod,
      id: `bod-${Date.now()}`
    };
    
    updateSettings({
      boardOfDirectors: [...appSettings.boardOfDirectors, newMember]
    });
    
    setNewBod({ name: '', role: '', image: '', avenue: '' });
  };

  const handleRemoveBod = (id: string) => {
    updateSettings({
      boardOfDirectors: appSettings.boardOfDirectors.filter(m => m.id !== id)
    });
  };

  const handleUpdateBod = (id: string, field: string, value: string) => {
    const updated = appSettings.boardOfDirectors.map(m => {
      if (m.id === id) {
        return { ...m, [field]: value };
      }
      return m;
    });
    updateSettings({ boardOfDirectors: updated });
  };

  const moveBod = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === appSettings.boardOfDirectors.length - 1) return;

    const updated = [...appSettings.boardOfDirectors];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    updateSettings({ boardOfDirectors: updated });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      {/* Top Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7A81B]/10 border border-[#F7A81B]/20 text-[#F7A81B] text-xs font-bold uppercase tracking-wider">
            <Settings className="w-3.5 h-3.5" /> Club Content Management System
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            System Settings & Assets
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Configure homepage banners, upload leadership council photographs, curate flagship causes, and manage photo gallery assets with direct Supabase storage sync.
          </p>
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F7A81B]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* CARD 1: HOME PAGE HERO & BANNER CONFIGURATION                            */}
        {/* ========================================================================= */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6 shadow-lg">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layout className="w-5 h-5 text-sky-400" />
              Homepage Hero & Vision Configuration
            </h2>
            <p className="text-xs text-slate-400 mt-1">Controls the introductory headline, hero imagery, and presidential vision banner.</p>
          </div>

          <div className="space-y-5">
            {/* Welcome Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Welcome Tagline / Subtitle
              </label>
              <div className="relative">
                <Type className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={appSettings.welcomeText}
                  onChange={(e) => updateSettings({ welcomeText: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 text-sm text-white border border-white/10 focus:border-sky-400 focus:outline-none transition-all"
                  placeholder="Connecting passionate Rotaractors, streamlining projects..."
                />
              </div>
            </div>

            {/* Hero Banner with Supabase Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Hero Banner Background Image
                </label>
                <span className="text-[10px] text-sky-400">Direct Supabase Upload</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-20 h-14 rounded-xl overflow-hidden border border-white/10 bg-slate-800 shrink-0">
                  <img src={appSettings.heroBannerUrl} alt="Hero Banner" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={appSettings.heroBannerUrl}
                    onChange={(e) => updateSettings({ heroBannerUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 text-xs text-white border border-white/10 focus:border-sky-400 focus:outline-none"
                    placeholder="https://..."
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      id="hero-banner-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleGenericFileUpload(e.target.files[0], 'hero-banner', (url) => {
                            updateSettings({ heroBannerUrl: url });
                          });
                        }
                      }}
                    />
                    <label
                      htmlFor="hero-banner-upload"
                      className="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      {uploadingId === 'hero-banner' ? 'Uploading to Supabase...' : 'Upload Image'}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Presidential Vision Image */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Presidential Vision Portrait
                </label>
                <span className="text-[10px] text-sky-400">Direct Supabase Upload</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-[#F7A81B]/40 bg-slate-800 shrink-0">
                  <img src={appSettings.presidentImage || ''} alt="President" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={appSettings.presidentImage || ''}
                    onChange={(e) => updateSettings({ presidentImage: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 text-xs text-white border border-white/10 focus:border-sky-400 focus:outline-none"
                    placeholder="https://..."
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      id="president-image-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleGenericFileUpload(e.target.files[0], 'president-img', (url) => {
                            updateSettings({ presidentImage: url });
                          });
                        }
                      }}
                    />
                    <label
                      htmlFor="president-image-upload"
                      className="px-3 py-1.5 rounded-lg bg-[#F7A81B]/15 hover:bg-[#F7A81B]/25 border border-[#F7A81B]/30 text-[#F7A81B] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      {uploadingId === 'president-img' ? 'Uploading to Supabase...' : 'Upload Portrait'}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 2: WHO WE ARE SECTION & CAROUSEL IMAGES                            */}
        {/* ========================================================================= */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5 shadow-lg">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-400" />
              "Who We Are" Section & Carousel
            </h2>
            <p className="text-xs text-slate-400 mt-1">Manage the core club manifesto and the 3D depth carousel on the public homepage.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Club Manifesto Text</label>
              <textarea
                rows={4}
                value={appSettings.whoWeAreText || ''}
                onChange={(e) => updateSettings({ whoWeAreText: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-black/40 text-xs leading-relaxed text-white border border-white/10 focus:border-indigo-400 focus:outline-none transition-all"
                placeholder="We are a community of young leaders driven by the Rotary motto of Service Above Self..."
              />
            </div>
            
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Depth Carousel Photos (Max 5)
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {(appSettings.whoWeAreImages || []).length} / 5 Uploaded
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(appSettings.whoWeAreImages || []).map((imgUrl, idx) => (
                  <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-white/10 group shadow-md">
                    <img src={imgUrl} alt="Who We Are" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => {
                        const newImgs = [...(appSettings.whoWeAreImages || [])];
                        newImgs.splice(idx, 1);
                        updateSettings({ whoWeAreImages: newImgs });
                      }}
                      className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-rose-400"
                      title="Remove Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {(appSettings.whoWeAreImages || []).length < 5 && (
                  <div className="relative h-20">
                    <input
                      type="file"
                      accept="image/*"
                      id="carousel-img-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleGenericFileUpload(e.target.files[0], 'carousel-img', (url) => {
                            updateSettings({ 
                              whoWeAreImages: [...(appSettings.whoWeAreImages || []), url] 
                            });
                          });
                        }
                      }}
                    />
                    <label 
                      htmlFor="carousel-img-upload"
                      className="h-full rounded-xl border border-dashed border-white/20 hover:border-indigo-400 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-400 transition-all gap-1 cursor-pointer bg-black/20"
                    >
                      {uploadingId === 'carousel-img' ? (
                        <span className="text-[10px] text-indigo-400 animate-pulse">Uploading...</span>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span className="text-[10px] font-bold">Upload</span>
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 3: BOARD OF DIRECTORS MANAGEMENT (FULL BUCKET INTEGRATION)           */}
        {/* ========================================================================= */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6 shadow-lg xl:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Board of Directors Management
              </h2>
              <p className="text-xs text-slate-400 mt-1">Manage executive leadership and avenue directors displayed on the Home Page.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300 font-semibold">Display on Home:</span>
              <button
                onClick={() => updateSettings({ showBoardOfDirectors: !appSettings.showBoardOfDirectors })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  appSettings.showBoardOfDirectors ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  appSettings.showBoardOfDirectors ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
          
          {appSettings.showBoardOfDirectors && (
            <div className="space-y-6">
              {/* Add New BOD Form */}
              <form onSubmit={handleAddBod} className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#F7A81B]" /> Add New Board Member
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input 
                    required 
                    type="text" 
                    placeholder="Full Name (e.g. Rtr. Akshat Sharma)" 
                    value={newBod.name} 
                    onChange={e => setNewBod({...newBod, name: e.target.value})} 
                    className="px-3.5 py-2.5 rounded-xl bg-black/60 text-xs text-white border border-white/10 focus:border-[#F7A81B] focus:outline-none" 
                  />
                  <input 
                    required 
                    type="text" 
                    placeholder="Designation (e.g. Club Secretary)" 
                    value={newBod.role} 
                    onChange={e => setNewBod({...newBod, role: e.target.value})} 
                    className="px-3.5 py-2.5 rounded-xl bg-black/60 text-xs text-white border border-white/10 focus:border-[#F7A81B] focus:outline-none" 
                  />
                  <input 
                    type="text" 
                    placeholder="Avenue (e.g. Executive Board)" 
                    value={newBod.avenue} 
                    onChange={e => setNewBod({...newBod, avenue: e.target.value})} 
                    className="px-3.5 py-2.5 rounded-xl bg-black/60 text-xs text-white border border-white/10 focus:border-[#F7A81B] focus:outline-none" 
                  />
                  
                  {/* Upload photo */}
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      id="new-bod-photo-input"
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleGenericFileUpload(e.target.files[0], 'new-bod', (url) => {
                            setNewBod(prev => ({ ...prev, image: url }));
                          });
                        }
                      }}
                    />
                    <label 
                      htmlFor="new-bod-photo-input"
                      className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#F7A81B] cursor-pointer flex items-center justify-center gap-2 transition-all h-full text-xs font-semibold"
                    >
                      {uploadingId === 'new-bod' ? (
                        <span className="text-[#F7A81B] animate-pulse">Uploading...</span>
                      ) : newBod.image ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5"/> Photo Ready
                        </span>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <UploadCloud className="w-3.5 h-3.5" /> Upload Photo
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-[#F7A81B] text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-90 shadow-md cursor-pointer transition-opacity"
                  >
                    Add to Council
                  </button>
                </div>
              </form>

              {/* Current Board Council List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#F7A81B]" /> Enrolled Council Members ({appSettings.boardOfDirectors.length})
                </h3>
                <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-2">
                  {appSettings.boardOfDirectors.map((member, idx) => (
                    <div key={member.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-0.5 mr-1">
                          <button 
                            disabled={idx === 0} 
                            onClick={() => moveBod(idx, 'up')} 
                            className="p-1 rounded hover:bg-white/10 disabled:opacity-20 text-slate-400"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            disabled={idx === appSettings.boardOfDirectors.length - 1} 
                            onClick={() => moveBod(idx, 'down')} 
                            className="p-1 rounded hover:bg-white/10 disabled:opacity-20 text-slate-400"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-800 border border-white/10 shadow-sm">
                          {member.image ? (
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-6 h-6 m-3 text-slate-500" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input 
                          type="text" 
                          value={member.name}
                          onChange={(e) => handleUpdateBod(member.id, 'name', e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-black/50 text-xs text-white border border-white/5 focus:border-[#F7A81B] focus:outline-none" 
                          placeholder="Name"
                        />
                        <input 
                          type="text" 
                          value={member.role}
                          onChange={(e) => handleUpdateBod(member.id, 'role', e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-black/50 text-xs text-slate-300 border border-white/5 focus:border-[#F7A81B] focus:outline-none" 
                          placeholder="Role"
                        />
                        <div className="relative flex-1">
                          <input 
                            type="file" 
                            accept="image/*"
                            id={`image-upload-${member.id}`}
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleGenericFileUpload(e.target.files[0], member.id, (url) => {
                                  handleUpdateBod(member.id, 'image', url);
                                });
                              }
                            }}
                          />
                          <label 
                            htmlFor={`image-upload-${member.id}`}
                            className="w-full h-full px-3 py-1.5 rounded-lg bg-black/50 text-xs border border-white/5 hover:border-[#F7A81B] cursor-pointer flex items-center justify-center transition-all text-slate-400 hover:text-white"
                          >
                            {uploadingId === member.id ? (
                              <span className="text-[#F7A81B] animate-pulse">Uploading...</span>
                            ) : (
                              <span className="flex items-center gap-1.5">
                                <UploadCloud className="w-3.5 h-3.5 text-[#F7A81B]" /> Change Photo
                              </span>
                            )}
                          </label>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveBod(member.id)} 
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 self-end sm:self-center cursor-pointer" 
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CARD 4: FLAGSHIP PROJECTS MANAGEMENT                                      */}
        {/* ========================================================================= */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase mb-1">
              <Star className="w-3 h-3" /> Community Causes
            </div>
            <h2 className="text-lg font-bold text-white">Our Flagship Projects</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit the 4 flagship causes (Paws & Claws, Readers Round Table, Nayi Disha, Pathshala) displayed on the Home Page.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => {
              if ((appSettings.flagshipProjects || []).length > 0) {
                setEditingProject(appSettings.flagshipProjects![0]);
              }
              setIsProjectsModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
          >
            <Edit2 className="w-4 h-4" /> Edit Projects
          </button>
        </div>

        {/* ========================================================================= */}
        {/* CARD 5: PHOTO GALLERY CONFIGURATION & GOOGLE DRIVE MASTER LINK            */}
        {/* ========================================================================= */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-pink-500/10 text-pink-400 text-[10px] font-bold uppercase mb-1">
                <Camera className="w-3 h-3" /> Memory Vault
              </div>
              <h2 className="text-lg font-bold text-white">Photo Gallery Configuration</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload and tag photos with event names for the masonry gallery wall.
              </p>
            </div>
            <button 
              type="button"
              onClick={() => {
                if ((appSettings.photoGallery || []).length > 0) {
                  setEditingPhoto(appSettings.photoGallery![0]);
                }
                setIsGalleryModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
            >
              <Edit2 className="w-4 h-4" /> Edit Gallery ({ (appSettings.photoGallery || []).length })
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-pink-400" /> Google Drive Master Link
            </label>
            <input
              type="text"
              value={appSettings.galleryDriveLink || ''}
              onChange={(e) => updateSettings({ galleryDriveLink: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 text-xs text-white border border-white/10 focus:border-pink-500 focus:outline-none"
              placeholder="https://drive.google.com/drive/folders/..."
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 6: FEATURED ALBUMS (ACCORDION & POPUP BROWSING)                     */}
        {/* ========================================================================= */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-lg xl:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase mb-1">
              <Star className="w-3 h-3" /> Gallery Accordion
            </div>
            <h2 className="text-lg font-bold text-white">Featured Albums Configuration</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Curate the featured horizontal accordion albums (District Conference, Installation, RYLA, Outreach) and sub-images.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => {
              if ((appSettings.featuredAlbums || []).length > 0) {
                setEditingAlbum(appSettings.featuredAlbums![0]);
              }
              setIsFeaturedAlbumsModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
          >
            <Edit2 className="w-4 h-4" /> Edit Albums ({ (appSettings.featuredAlbums || []).length })
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: PHOTO GALLERY EDITOR (Portaled to document.body)                  */}
      {/* ========================================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isGalleryModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/85 backdrop-blur-md" 
                onClick={() => { setIsGalleryModalOpen(false); setEditingPhoto(null); }} 
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-5xl w-full bg-[#0E131F] border border-white/15 rounded-3xl overflow-hidden z-10 shadow-2xl flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-pink-500/15 text-pink-500 border border-pink-500/30">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-white">Photo Gallery Manager</h2>
                      <p className="text-xs text-slate-400">Tag photos with event names and upload directly to Supabase</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleAddGalleryPhoto} 
                      className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" /> Add New Photo
                    </button>
                    <button 
                      onClick={() => { setIsGalleryModalOpen(false); setEditingPhoto(null); }}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[500px]">
                  {/* Left Sidebar List */}
                  <div className="w-full md:w-1/3 border-r border-white/10 bg-black/20 overflow-y-auto p-4 space-y-2">
                    {(appSettings.photoGallery || []).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setEditingPhoto(p)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                          editingPhoto?.id === p.id 
                            ? 'border-pink-500/50 bg-pink-500/10' 
                            : 'border-white/5 hover:border-white/20 bg-white/5'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-lg bg-slate-800 shrink-0 overflow-hidden border border-white/10">
                          {p.img ? (
                            <img src={p.img} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 m-3 text-slate-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-xs truncate">{p.eventName || 'Unnamed Event'}</h4>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.img ? 'Photo Attached' : 'No Photo'}</p>
                        </div>
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = (appSettings.photoGallery || []).filter(item => item.id !== p.id);
                            updateSettings({ photoGallery: updated });
                            if (editingPhoto?.id === p.id) setEditingPhoto(null);
                          }}
                          className="p-2 text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Right Editor Panel */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-black/40">
                    {editingPhoto ? (
                      <div className="space-y-4 max-w-lg">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300 uppercase">Event Tag / Name</label>
                          <input 
                            type="text" 
                            value={editingPhoto.eventName}
                            onChange={(e) => handleUpdateGalleryPhoto({ ...editingPhoto, eventName: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black/60 text-sm text-white border border-white/10 focus:border-pink-500 focus:outline-none"
                            placeholder="e.g. Mega Blood Donation Camp"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300 uppercase">Photo Image</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={editingPhoto.img}
                              onChange={(e) => handleUpdateGalleryPhoto({ ...editingPhoto, img: e.target.value })}
                              className="flex-1 px-3 py-2 rounded-xl bg-black/60 text-xs text-white border border-white/10 focus:border-pink-500 focus:outline-none"
                              placeholder="Image URL or upload below..."
                            />
                            <input 
                              type="file"
                              accept="image/*"
                              id="gallery-editor-upload"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleGenericFileUpload(e.target.files[0], 'gallery-photo', (url) => {
                                    handleUpdateGalleryPhoto({ ...editingPhoto, img: url });
                                  });
                                }
                              }}
                            />
                            <label
                              htmlFor="gallery-editor-upload"
                              className="px-3.5 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90 shrink-0"
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                              {uploadingId === 'gallery-photo' ? 'Uploading...' : 'Upload'}
                            </label>
                          </div>
                        </div>
                        
                        {editingPhoto.img && (
                          <div className="mt-4 rounded-2xl overflow-hidden border border-white/15 max-h-72 w-full bg-black/50 p-2">
                            <img src={editingPhoto.img} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                        <Camera className="w-12 h-12 opacity-20" />
                        <p className="text-sm">Select a photo from the left to edit or add a new one.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FLAGSHIP PROJECTS EDITOR (Portaled to document.body)              */}
      {/* ========================================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isProjectsModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md" 
              onClick={() => { setIsProjectsModalOpen(false); setEditingProject(null); }} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl w-full bg-[#0E131F] border border-white/15 rounded-3xl overflow-hidden z-10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Flagship Projects Manager</h2>
                    <p className="text-xs text-slate-400">Update cause descriptions, banner images, and project galleries</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setIsProjectsModalOpen(false); setEditingProject(null); }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[500px]">
                {/* Left Sidebar List */}
                <div className="w-full md:w-1/3 border-r border-white/10 bg-black/20 overflow-y-auto p-4 space-y-2">
                  {(appSettings.flagshipProjects || []).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setEditingProject(p)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                        editingProject?.id === p.id 
                          ? 'border-amber-500/50 bg-amber-500/10' 
                          : 'border-white/5 hover:border-white/20 bg-white/5'
                      }`}
                    >
                      <h4 className="font-bold text-white text-sm truncate">{p.title}</h4>
                      <p className="text-xs text-slate-400 truncate mt-1">{p.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Right Editor Panel */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-black/40">
                  {editingProject ? (
                    <div className="space-y-4 max-w-xl">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase">Project Title</label>
                        <input 
                          type="text" 
                          value={editingProject.title}
                          onChange={(e) => handleUpdateFlagship({ ...editingProject, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/60 text-sm text-white border border-white/10 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase">Short Description (Card Summary)</label>
                        <textarea 
                          rows={2}
                          value={editingProject.desc}
                          onChange={(e) => handleUpdateFlagship({ ...editingProject, desc: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl bg-black/60 text-xs text-white border border-white/10 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase">Full About Story (Public Popup)</label>
                        <textarea 
                          rows={4}
                          value={editingProject.about}
                          onChange={(e) => handleUpdateFlagship({ ...editingProject, about: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl bg-black/60 text-xs text-white border border-white/10 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase">Banner Cover Image</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={editingProject.img}
                            onChange={(e) => handleUpdateFlagship({ ...editingProject, img: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-xl bg-black/60 text-xs text-white border border-white/10 focus:border-amber-500 focus:outline-none"
                          />
                          <input 
                            type="file"
                            accept="image/*"
                            id="flagship-banner-upload"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleGenericFileUpload(e.target.files[0], 'flagship-banner', (url) => {
                                  handleUpdateFlagship({ ...editingProject, img: url });
                                });
                              }
                            }}
                          />
                          <label
                            htmlFor="flagship-banner-upload"
                            className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer hover:opacity-90 shrink-0"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            {uploadingId === 'flagship-banner' ? 'Uploading...' : 'Upload'}
                          </label>
                        </div>
                      </div>
                      
                      {/* Project Gallery Sub-Images */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                          <Camera className="w-4 h-4 text-amber-400" /> Project Gallery Photos
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {(editingProject.gallery || []).map((img: string, idx: number) => (
                            <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-white/10 group">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button 
                                onClick={() => {
                                  const newGal = [...(editingProject.gallery || [])];
                                  newGal.splice(idx, 1);
                                  handleUpdateFlagship({ ...editingProject, gallery: newGal });
                                }}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-rose-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          
                          <div className="relative h-20">
                            <input 
                              type="file"
                              accept="image/*"
                              id="flagship-subgallery-upload"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleGenericFileUpload(e.target.files[0], 'flagship-sub', (url) => {
                                    handleUpdateFlagship({
                                      ...editingProject,
                                      gallery: [...(editingProject.gallery || []), url]
                                    });
                                  });
                                }
                              }}
                            />
                            <label
                              htmlFor="flagship-subgallery-upload"
                              className="h-full rounded-xl border border-dashed border-white/20 hover:border-amber-500 flex flex-col items-center justify-center text-slate-400 hover:text-amber-400 transition-all gap-1 cursor-pointer bg-black/20"
                            >
                              <Plus className="w-4 h-4" />
                              <span className="text-[10px] font-bold">Add Photo</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                      <Star className="w-12 h-12 opacity-20" />
                      <p className="text-sm">Select a project from the left to edit its details</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* ========================================================================= */}
      {/* MODAL 3: FEATURED ALBUMS EDITOR (Portaled to document.body)                */}
      {/* ========================================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isFeaturedAlbumsModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md" 
              onClick={() => { setIsFeaturedAlbumsModalOpen(false); setEditingAlbum(null); }} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl w-full bg-[#0E131F] border border-white/15 rounded-3xl overflow-hidden z-10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Featured Albums Manager</h2>
                    <p className="text-xs text-slate-400">Curate accordion albums, descriptions, and browse photo collections</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      const newAlbum = { 
                        id: `album-${Date.now()}`, 
                        title: 'New Featured Album', 
                        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
                        description: 'Album description and summary of events...',
                        photos: []
                      };
                      updateSettings({ featuredAlbums: [...(appSettings.featuredAlbums || []), newAlbum] });
                      setEditingAlbum(newAlbum);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Add Album
                  </button>
                  <button 
                    onClick={() => { setIsFeaturedAlbumsModalOpen(false); setEditingAlbum(null); }} 
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[480px]">
                {/* Left List */}
                <div className="w-full md:w-1/3 border-r border-white/10 bg-black/20 overflow-y-auto p-4 space-y-2">
                  {(appSettings.featuredAlbums || []).map((album: any) => (
                    <button
                      key={album.id}
                      onClick={() => setEditingAlbum(album)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                        editingAlbum?.id === album.id 
                          ? 'bg-indigo-500/20 border-indigo-500/50' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                        <img src={album.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{album.title}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{(album.photos || []).length} Sub-photos</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right Editor */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-black/40">
                  {editingAlbum ? (
                    <div className="space-y-4 max-w-xl">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase">Album Title</label>
                        <input 
                          type="text" 
                          value={editingAlbum.title}
                          onChange={(e) => handleUpdateFeaturedAlbum({ ...editingAlbum, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/60 text-sm text-white border border-white/10 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase">Album Summary / Description (Popup View)</label>
                        <textarea 
                          rows={3}
                          value={editingAlbum.description || ''}
                          onChange={(e) => handleUpdateFeaturedAlbum({ ...editingAlbum, description: e.target.value })}
                          placeholder="Describe the highlights and significance of this album..."
                          className="w-full px-4 py-2.5 rounded-xl bg-black/60 text-xs text-white border border-white/10 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 uppercase">Main Cover Image (Horizontal Accordion)</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value={editingAlbum.image}
                            onChange={(e) => handleUpdateFeaturedAlbum({ ...editingAlbum, image: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-xl bg-black/60 text-xs text-white border border-white/10 focus:border-indigo-500 focus:outline-none"
                          />
                          <input 
                            type="file"
                            accept="image/*"
                            id="album-cover-upload"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleGenericFileUpload(e.target.files[0], 'album-cover', (url) => {
                                  handleUpdateFeaturedAlbum({ ...editingAlbum, image: url });
                                });
                              }
                            }}
                          />
                          <label
                            htmlFor="album-cover-upload"
                            className="px-3.5 py-2 rounded-xl bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90 shrink-0"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            {uploadingId === 'album-cover' ? 'Uploading...' : 'Upload'}
                          </label>
                        </div>
                      </div>

                      {/* Sub-Photos */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                          <Camera className="w-4 h-4 text-indigo-400" /> Browse Album Photos (Seen inside Album view)
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {(editingAlbum.photos || []).map((img: string, idx: number) => (
                            <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-white/10 group">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button 
                                onClick={() => {
                                  const newPhotos = [...(editingAlbum.photos || [])];
                                  newPhotos.splice(idx, 1);
                                  handleUpdateFeaturedAlbum({ ...editingAlbum, photos: newPhotos });
                                }}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-rose-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          
                          <div className="relative h-20">
                            <input 
                              type="file"
                              accept="image/*"
                              id="album-subphoto-upload"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleGenericFileUpload(e.target.files[0], 'album-sub', (url) => {
                                    handleUpdateFeaturedAlbum({
                                      ...editingAlbum,
                                      photos: [...(editingAlbum.photos || []), url]
                                    });
                                  });
                                }
                              }}
                            />
                            <label
                              htmlFor="album-subphoto-upload"
                              className="h-full rounded-xl border border-dashed border-white/20 hover:border-indigo-400 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-400 transition-all gap-1 cursor-pointer bg-black/20"
                            >
                              <Plus className="w-4 h-4" />
                              <span className="text-[10px] font-bold">Add Photo</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <button 
                          onClick={() => {
                            const newAlbums = (appSettings.featuredAlbums || []).filter(a => a.id !== editingAlbum.id);
                            updateSettings({ featuredAlbums: newAlbums });
                            setEditingAlbum(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Album
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                      <Star className="w-12 h-12 opacity-20" />
                      <p className="text-sm">Select an album from the left to edit its details</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </div>
  );
};
