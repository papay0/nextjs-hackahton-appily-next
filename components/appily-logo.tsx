import Image from 'next/image';
import { FC } from 'react';

interface AppilyLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const AppilyLogo: FC<AppilyLogoProps> = ({ 
  width = 40, 
  height = 40,
  className = ''
}) => {
  return (
    <Image
      src="/appily-logo.svg"
      alt="Appily Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
};
