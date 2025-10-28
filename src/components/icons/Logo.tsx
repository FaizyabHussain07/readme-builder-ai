import { cn } from '@/lib/utils';
import { FileCode2, LucideProps } from 'lucide-react';

export default function Logo({ className, ...props }: LucideProps) {
  return <FileCode2 className={cn(className)} {...props} />;
}
