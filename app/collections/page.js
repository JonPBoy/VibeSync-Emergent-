'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Folder, Trash2, Edit3, X, Check } from 'lucide-react';
import Link from 'next/link';
import { getCollections, createCollection, deleteCollection, renameCollection, removeFromCollection } from '@/lib/styleHistory';
import StyleCard from '../components/StyleCard';
import StylePreview from '../components/StylePreview';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [activeCollection, setActiveCollection] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

  useEffect(() => {
    setCollections(getCollections());
  }, []);

  const refresh = () => setCollections(getCollections());

  const handleCreate = () => {
    if (newName.trim()) {
      createCollection(newName.trim());
      setNewName('');
      setShowCreate(false);
      refresh();
    }
  };

  const handleDelete = (id) => {
    if (confirm('Delete this collection?')) {
      deleteCollection(id);
      if (activeCollection?.id === id) setActiveCollection(null);
      refresh();
    }
  };

  const handleRename = (id) => {
    if (editName.trim()) {
      renameCollection(id, editName.trim());
      setEditingId(null);
      refresh();
    }
  };

  const handleRemoveStyle = (collectionId, styleId) => {
    removeFromCollection(collectionId, styleId);
    refresh();
    if (activeCollection) {
      setActiveCollection(getCollections().find(c => c.id === collectionId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full hover:bg-white/50 transition">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Collections</h1>
              <p className="text-slate-600">Organize your favorite styles into themed boards</p>
            </div>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition">
            <Plus size={18} /> New Collection
          </button>
        </div>

        {activeCollection ? (
          <div>
            <button onClick={() => setActiveCollection(null)} className="flex items-center gap-2 text-violet-600 mb-4 hover:underline">
              <ArrowLeft size={18} /> Back to Collections
            </button>
            <h2 className="text-2xl font-bold mb-4">{activeCollection.name}</h2>
            {activeCollection.styles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <Folder size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">This collection is empty</p>
                <Link href="/" className="text-violet-600 hover:underline">Browse styles to add</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeCollection.styles.map(style => (
                  <div key={style.id} className="relative group">
                    <StyleCard style={style} onPreview={() => setSelectedStyle(style)} />
                    <button onClick={() => handleRemoveStyle(activeCollection.id, style.id)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl">
                <Folder size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 mb-2">No collections yet</p>
                <button onClick={() => setShowCreate(true)} className="text-violet-600 hover:underline">Create your first collection</button>
              </div>
            ) : (
              collections.map(col => (
                <motion.div key={col.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer group" onClick={() => setActiveCollection(col)}>
                  <div className="flex items-start justify-between mb-4">
                    {editingId === col.id ? (
                      <div className="flex items-center gap-2 flex-1" onClick={e => e.stopPropagation()}>
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 px-2 py-1 border rounded" autoFocus />
                        <button onClick={() => handleRename(col.id)} className="p-1 text-green-600"><Check size={18} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-slate-400"><X size={18} /></button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-violet-100 rounded-xl"><Folder className="text-violet-600" /></div>
                          <div>
                            <h3 className="font-bold text-lg">{col.name}</h3>
                            <p className="text-sm text-slate-500">{col.styles.length} styles</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition" onClick={e => e.stopPropagation()}>
                          <button onClick={() => { setEditingId(col.id); setEditName(col.name); }} className="p-2 hover:bg-slate-100 rounded-lg"><Edit3 size={16} /></button>
                          <button onClick={() => handleDelete(col.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                      </>
                    )}
                  </div>
                  {col.styles.length > 0 && (
                    <div className="flex -space-x-2">
                      {col.styles.slice(0, 5).map((s, i) => (
                        <div key={i} className="w-10 h-10 rounded-lg border-2 border-white" style={{ background: s.gradientStyle || `linear-gradient(135deg, ${s.primaryColor}, ${s.secondaryColor})` }} />
                      ))}
                      {col.styles.length > 5 && <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-bold">+{col.styles.length - 5}</div>}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Create Collection</h2>
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Collection name..." className="w-full px-4 py-3 border rounded-xl mb-4" autoFocus onKeyDown={e => e.key === 'Enter' && handleCreate()} />
            <div className="flex gap-3">
              <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleCreate} className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg">Create</button>
            </div>
          </div>
        </div>
      )}

      {selectedStyle && <StylePreview style={selectedStyle} onClose={() => setSelectedStyle(null)} />}
    </div>
  );
}
