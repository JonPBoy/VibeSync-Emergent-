// Safe clipboard utility with fallback for when Clipboard API is blocked
import { useState } from 'react';

export const copyToClipboard = async (text) => {
  // First try the modern Clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback:', err.message);
    }
  }
  
  // Fallback: Create a temporary textarea element
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // Execute copy command
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      return true;
    }
  } catch (err) {
    console.warn('Fallback clipboard copy failed:', err.message);
  }
  
  // If all else fails
  console.error('Unable to copy to clipboard');
  return false;
};

// Hook for clipboard with state management
export const useClipboard = (timeout = 2000) => {
  const [copied, setCopied] = useState(false);
  
  const copy = async (text) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    }
    return success;
  };
  
  return { copied, copy };
};
