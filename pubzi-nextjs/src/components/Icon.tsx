import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: 16 | 20 | 24 | 32 | 48;
  variant?: 'purple' | 'cyan' | 'white';
  strokeWidth?: 1.5 | 2 | 2.5;
  className?: string;
}

export default function Icon({
  icon: IconComponent,
  size = 24,
  variant = 'white',
  strokeWidth = 2,
  className = ''
}: IconProps) {
  const colorMap = {
    purple: '#6C5CE7',
    cyan: '#00D9FF',
    white: '#FFFFFF'
  };

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      color={colorMap[variant]}
      className={className}
    />
  );
}
