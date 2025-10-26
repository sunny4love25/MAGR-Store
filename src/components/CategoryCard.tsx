import { memo } from 'react';

interface CategoryCardProps {
  name: string;
  image: string;
  targetSection?: string;
}

export const CategoryCard = memo(function CategoryCard({ name, image, targetSection }: CategoryCardProps) {
  const handleClick = () => {
    if (targetSection) {
      const element = document.getElementById(targetSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="relative h-[140px] md:h-[160px] rounded-lg overflow-hidden cursor-pointer group"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
        <h3 className="text-white text-sm md:text-base">{name}</h3>
      </div>
    </div>
  );
});
