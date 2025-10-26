import { ReactNode } from 'react';

interface SectionHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export function SectionHeader({ icon, title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <div className="flex items-center gap-2 md:gap-3">
        {icon && (
          <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-base md:text-xl">{title}</h2>
          <p className="text-xs md:text-sm text-gray-600 hidden sm:block">{subtitle}</p>
        </div>
      </div>
      <div className="flex-shrink-0">
        {action}
      </div>
    </div>
  );
}
