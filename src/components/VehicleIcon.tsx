import { Truck, Bus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VehicleIconProps {
  vehicle: string;
  className?: string;
  animated?: boolean;
}

export const VehicleIcon = ({ vehicle, className, animated = true }: VehicleIconProps) => {
  const isHino = vehicle.toLowerCase().includes('hino');
  
  return (
    <div className={cn("relative", className)}>
      {isHino ? (
        <Truck 
          className={cn(
            "w-12 h-12 text-warning",
            animated && "animate-float"
          )} 
        />
      ) : (
        <Bus 
          className={cn(
            "w-12 h-12 text-primary",
            animated && "animate-float"
          )} 
        />
      )}
      <div 
        className={cn(
          "absolute inset-0 blur-lg",
          isHino ? "bg-warning/30" : "bg-primary/30"
        )} 
      />
    </div>
  );
};
