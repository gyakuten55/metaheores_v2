import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Use local worker provided by the package
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Important: GlobalWorkerOptions should be set once
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PdfThumbnailProps {
  url: string;
  title: string;
  className?: string;
}

export const PdfThumbnail: React.FC<PdfThumbnailProps> = ({ url, title, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let renderTask: any = null;
    let pdfDoc: any = null;

    const renderPage = async () => {
      try {
        setLoading(true);
        setError(false);

        // Fetch the PDF as a blob first to ensure access and avoid some browser issues
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.arrayBuffer();

        if (!isMounted) return;

        // Load the PDF from the ArrayBuffer
        const loadingTask = pdfjsLib.getDocument({ data });
        pdfDoc = await loadingTask.promise;
        
        if (!isMounted) return;

        const page = await pdfDoc.getPage(1);
        
        if (!isMounted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: false }); // Better performance
        if (!context) return;

        // Calculate scale to fit within the aspect-video container (16:9)
        const pixelRatio = window.devicePixelRatio || 1;
        const containerWidth = 600; 
        const containerHeight = (600 * 9) / 16;

        const unscaledViewport = page.getViewport({ scale: 1 });
        const scaleW = containerWidth / unscaledViewport.width;
        const scaleH = containerHeight / unscaledViewport.height;
        const scale = Math.min(scaleW, scaleH);

        const viewport = page.getViewport({ scale: scale * 1.5 }); // Higher quality for preview
        
        canvas.height = viewport.height * pixelRatio;
        canvas.width = viewport.width * pixelRatio;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        
        context.scale(pixelRatio, pixelRatio);

        // Render white background first (PDFs often have transparent backgrounds)
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        renderTask = page.render({
          canvasContext: context,
          viewport: viewport
        });

        await renderTask.promise;

        if (isMounted) setLoading(false);
      } catch (err: any) {
        if (isMounted && err.name !== 'RenderingCancelledException') {
          console.error('PDF preview error:', title, err);
          setError(true);
          setLoading(false);
        }
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      if (renderTask) {
        renderTask.cancel();
      }
      if (pdfDoc) {
        pdfDoc.destroy();
      }
    };
  }, [url, title]);

  return (
    <div className={`relative aspect-video bg-white flex items-center justify-center overflow-hidden border-b border-gray-100 ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white z-10">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest text-center animate-pulse">Generating<br/>Preview...</span>
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gray-50">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <span className="text-[9px] font-bold text-gray-400 uppercase leading-tight text-center">Preview<br/>Unavailable</span>
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          className={`w-full h-full object-contain transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
    </div>
  );
};