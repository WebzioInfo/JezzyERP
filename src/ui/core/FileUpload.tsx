"use client";

import React, { useState } from 'react';
import { Upload, X, File, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { useLoadingStore } from '@/lib/store/useLoadingStore';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  maxSize?: number; // in MB
  accept?: string;
  label?: string;
}

export function FileUpload({ onUpload, maxSize = 5, accept, label }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const incrementRequests = useLoadingStore(state => state.incrementRequests);
  const decrementRequests = useLoadingStore(state => state.decrementRequests);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSize * 1024 * 1024) {
      setErrorMsg(`File too large. Maximum size is ${maxSize}MB.`);
      setStatus('error');
      return;
    }

    setFile(selectedFile);
    setStatus('idle');
    setErrorMsg(null);
  };

  const startUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    incrementRequests();
    
    // Simulate progress since native fetch doesn't support progress tracking 
    // (Axios would be better here, but we'll simulate for the UI demonstration)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      await onUpload(file);
      clearInterval(interval);
      setProgress(100);
      setStatus('success');
    } catch (err) {
      clearInterval(interval);
      setStatus('error');
      setErrorMsg("Failed to upload file. Please try again.");
    } finally {
      decrementRequests();
    }
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
    setStatus('idle');
    setErrorMsg(null);
  };

  return (
    <div className="space-y-4">
      {label && <label className="text-xs font-black uppercase tracking-widest text-slate-400 italic mb-2 block">{label}</label>}
      
      <div className={cn(
        "relative rounded-[2rem] border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center text-center",
        status === 'uploading' ? "bg-primary-50/50 border-primary-200" : 
        status === 'success' ? "bg-emerald-50/50 border-emerald-200" :
        status === 'error' ? "bg-red-50/50 border-red-200" :
        "bg-slate-50 border-slate-200 hover:border-primary-400 hover:bg-white"
      )}>
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
          onChange={handleFileChange}
          accept={accept}
          disabled={status === 'uploading'}
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-primary-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Drop file here or click to browse</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1 italic uppercase tracking-wider">MAX {maxSize}MB // {accept || 'ALL FORMATS'}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="selected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-6"
            >
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <File className="w-6 h-6 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {status !== 'uploading' && (
                  <button onClick={reset} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>

              {status === 'idle' && (
                <button 
                  onClick={startUpload}
                  className="h-12 px-8 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all active:scale-95 shadow-xl"
                >
                  Confirm Upload
                </button>
              )}

              {status === 'uploading' && (
                <div className="space-y-3 max-w-sm mx-auto w-full">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 italic">Syncing to cloud...</span>
                    <span className="text-[10px] font-black text-slate-900">{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {status === 'success' && (
                <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-sm font-bold text-emerald-700 italic">Asset successfully registered!</p>
                  <button onClick={reset} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 mt-2">Upload Another</button>
                </div>
              )}

              {status === 'error' && (
                <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-sm font-bold text-red-700 italic">{errorMsg}</p>
                  <button onClick={reset} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 mt-2">Try Again</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
