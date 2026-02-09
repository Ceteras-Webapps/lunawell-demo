import React from 'react';
import { useApp } from '../../context/AppContext';
import { PlayCircle, BookOpen, FileText } from 'lucide-react';

interface Props {
  showTitle?: boolean;
}

export const ContentLibrary: React.FC<Props> = ({ showTitle = true }) => {
  const { contentLibrary, t } = useApp();

  return (
    <div className="h-full flex flex-col">
       {showTitle && <h2 className="text-xl font-serif mb-6">{t('content')}</h2>}
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pb-4 scrollbar-hide">
         {contentLibrary.map(item => (
           <div key={item.id} className="group relative aspect-video rounded-xl overflow-hidden bg-black/5 hover:shadow-lg transition-all duration-300">
             {item.type === 'video' || item.type === 'class' ? (
               <iframe
                 src={item.url}
                 title={item.title}
                 className="w-full h-full object-cover"
                 frameBorder="0"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
               />
             ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-black/5">
                   <FileText size={48} className="mb-2 opacity-50" />
                   <p className="text-sm opacity-70">Document</p>
                </div>
             )}
             
             <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
               <div className="flex items-center gap-2 text-white mb-1">
                 {item.type === 'video' && <PlayCircle size={16} />}
                 {item.type === 'class' && <BookOpen size={16} />}
                 {item.type === 'document' && <FileText size={16} />}
                 <span className="text-xs font-bold uppercase tracking-wider">{item.type}</span>
               </div>
               <h3 className="text-white font-serif text-lg leading-tight">{item.title}</h3>
               <p className="text-white/80 text-xs mt-1 line-clamp-2">{item.description}</p>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};