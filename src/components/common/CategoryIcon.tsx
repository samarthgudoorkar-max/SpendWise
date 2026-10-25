import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Car,
  Film,
  Receipt,
  GraduationCap,
  HeartPulse,
  Package,
  Briefcase,
  Laptop,
  Gift,
  LucideProps,
} from 'lucide-react';
import { Category } from '../../types';
import { CATEGORY_CONFIG } from '../../data/categories';

interface CategoryIconProps extends Omit<LucideProps, 'ref'> {
  category: Category | string;
  size?: number;
  withBackground?: boolean;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 18,
  withBackground = false,
  className = '',
  ...props
}) => {
  const meta = CATEGORY_CONFIG[category as Category];
  const color = meta ? meta.color : '#94A3B8';

  const renderIcon = () => {
    switch (category) {
      case 'Food':
        return <Utensils size={size} color={color} {...props} />;
      case 'Shopping':
        return <ShoppingBag size={size} color={color} {...props} />;
      case 'Transport':
        return <Car size={size} color={color} {...props} />;
      case 'Entertainment':
        return <Film size={size} color={color} {...props} />;
      case 'Bills':
        return <Receipt size={size} color={color} {...props} />;
      case 'Education':
        return <GraduationCap size={size} color={color} {...props} />;
      case 'Health':
        return <HeartPulse size={size} color={color} {...props} />;
      case 'Salary':
        return <Briefcase size={size} color={color} {...props} />;
      case 'Freelancing':
        return <Laptop size={size} color={color} {...props} />;
      case 'Gifts':
        return <Gift size={size} color={color} {...props} />;
      case 'Other':
      default:
        return <Package size={size} color={color} {...props} />;
    }
  };

  if (withBackground && meta) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg p-2 shrink-0 ${className}`}
        style={{
          backgroundColor: meta.bgColor,
          borderColor: meta.borderColor,
          borderWidth: 1,
        }}
      >
        {renderIcon()}
      </div>
    );
  }

  return <span className={`inline-flex items-center justify-center shrink-0 ${className}`}>{renderIcon()}</span>;
};
