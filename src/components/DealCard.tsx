import { Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { memo } from 'react';

interface DealCardProps {
  title: string;
  discount: string;
  image: string;
  timeLeft?: string;
  badge?: string;
}

export const DealCard = memo(function DealCard({ title, discount, image, timeLeft, badge }: DealCardProps) {
  return (
    <div className="relative h-[160px] md:h-[200px] rounded-lg overflow-hidden cursor-pointer group">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      
      {badge && (
        <Badge className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white text-xs">
          {badge}
        </Badge>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
        <h3 className="text-white mb-1 text-sm md:text-base">{title}</h3>
        <p className="text-orange-400 mb-1 md:mb-2 text-xs md:text-sm">{discount}</p>
        {timeLeft && (
          <div className="flex items-center gap-1 text-white text-xs md:text-sm">
            <Clock className="w-3 h-3" />
            <span>{timeLeft}</span>
          </div>
        )}
      </div>
    </div>
  );
});
