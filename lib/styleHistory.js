// Style history and collections management

const HISTORY_KEY = 'vibesync_history';
const COLLECTIONS_KEY = 'vibesync_collections';
const MAX_HISTORY = 50;

export const getHistory = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch { return []; }
};

export const addToHistory = (style) => {
  if (typeof window === 'undefined') return;
  const history = getHistory().filter(s => s.id !== style.id);
  history.unshift({ ...style, viewedAt: Date.now() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
};

export const clearHistory = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
};

export const getCollections = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(COLLECTIONS_KEY) || '[]');
  } catch { return []; }
};

export const createCollection = (name) => {
  const collections = getCollections();
  // Generate unique ID with timestamp + random suffix
  const uniqueId = `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newCollection = { id: uniqueId, name, styles: [], createdAt: Date.now() };
  collections.push(newCollection);
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  return newCollection;
};

export const addToCollection = (collectionId, style) => {
  const collections = getCollections();
  const col = collections.find(c => c.id === collectionId);
  if (col && !col.styles.find(s => s.id === style.id)) {
    col.styles.push(style);
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  }
};

export const removeFromCollection = (collectionId, styleId) => {
  const collections = getCollections();
  const col = collections.find(c => c.id === collectionId);
  if (col) {
    col.styles = col.styles.filter(s => s.id !== styleId);
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  }
};

export const deleteCollection = (collectionId) => {
  const collections = getCollections().filter(c => c.id !== collectionId);
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
};

export const renameCollection = (collectionId, newName) => {
  const collections = getCollections();
  const col = collections.find(c => c.id === collectionId);
  if (col) {
    col.name = newName;
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  }
};
