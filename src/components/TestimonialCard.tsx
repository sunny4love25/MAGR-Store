import { Star } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface TestimonialCardProps {
  name: string;
  rating: number;
  comment: string;
}

export function TestimonialCard({ name, rating, comment }: TestimonialCardProps) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border">
      <div className="flex items-start gap-3 md:gap-4">
        <Avatar className="w-10 h-10 md:w-12 md:h-12">
          <AvatarFallback className="text-sm md:text-base">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="mb-1 text-sm md:text-base">{name}</h4>
          <div className="flex gap-0.5 mb-2 md:mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{comment}</p>
        </div>
      </div>
    </div>
  );
}
