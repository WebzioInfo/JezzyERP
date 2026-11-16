"use client";

import React, { useState } from 'react';
import { Upload, X, File, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { useLoadingStore } from '@/lib/store/useLoadingStore';
import { Button } from './Button';

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
    } catch {
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
    <div className="space-y-2">
      {label && <label className="text-xs font-medium text-slate-700 block">{label}</label>}
      
      <div className={cn(
        "relative rounded-xl border-2 border-dashed transition-all p-6 sm:p-8 flex flex-col items-center justify-center text-center",
        status === 'uploading' ? "bg-slate-50 border-slate-300" : 
        status === 'success' ? "bg-emerald-50/50 border-emerald-300" :
        status === 'error' ? "bg-red-50/50 border-red-300" :
        "bg-slate-50/50 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Drop file here or click to browse</p>
                <p className="text-xs text-slate-500 mt-1">Maximum size {maxSize}MB • {accept || 'All supported formats'}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="selected"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-4"
            >
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-xs border border-slate-200 max-w-sm mx-auto">
                <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                  <File className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {status !== 'uploading' && (
                  <button onClick={reset} aria-label="Remove file" className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-md transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>

              {status === 'idle' && (
                <Button 
                  onClick={startUpload}
                  variant="primary"
                  size="md"
                >
                  Confirm Upload
                </Button>
              )}

              {status === 'uploading' && (
                <div className="space-y-2 max-w-sm mx-auto w-full">
                  <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-slate-900"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {status === 'success' && (
                <div className="flex flex-col items-center gap-2 animate-in fade-in">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-emerald-700">File uploaded successfully</p>
                  <Button variant="ghost" size="sm" onClick={reset}>
                    Upload Another
                  </Button>
                </div>
              )}

              {status === 'error' && (
                <div className="flex flex-col items-center gap-2 animate-in fade-in">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-sm font-medium text-red-600">{errorMsg}</p>
                  <Button variant="outline" size="sm" onClick={reset}>
                    Try Again
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
