import { cn } from '@/lib/utils';

interface NvidiaLogoProps {
  className?: string;
}

export function NvidiaLogo({ className }: NvidiaLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-primary', className)}
    >
      <path
        d="M8.948 8.798v-1.63c.065-.003.2-.008.333-.008c2.23-.012 3.763 1.647 3.763 1.647s-1.73 2.19-3.655 2.19c-.16 0-.313-.015-.441-.04V8.798z"
        fill="currentColor"
      />
      <path
        d="M8.948 7.168V5.11c.067-.003.136-.003.202-.003c3.328-.03 5.542 2.875 5.542 2.875s-2.604 3.26-5.16 3.26c-.218 0-.407-.02-.584-.058V7.168z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path
        d="M8.948 5.11v-.96c.063-.003.126-.003.189-.003c4.86-.035 8.166 4.216 8.166 4.216s-3.835 4.825-7.54 4.825c-.294 0-.553-.025-.815-.072V5.11z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M3.804 10.038c1.636-2.13 4.12-3.428 4.12-3.428v1.618c-1.39.4-2.592 1.69-2.592 1.69l-1.528.12z"
        fill="currentColor"
      />
      <path
        d="M2.676 11.312c2.203-3.2 5.248-4.7 5.248-4.7v1.02c-1.738.555-3.392 2.195-3.392 2.195l-1.856.145V11.312z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path
        d="M1.5 12.873c2.89-4.442 6.424-5.956 6.424-5.956v.96c-2.185.66-4.354 2.888-4.354 2.888L1.5 12.873z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M8.948 11.184v2.86c-2.953-.533-4.584-4.072-4.584-4.072s1.87-2.047 4.143-2.372v2.159c-1.155-.21-2.084.998-2.084.998s.63 1.64 2.525 1.427z"
        fill="currentColor"
      />
      <path
        d="M17.39 8.363l.903-.682c2.72 3.396 1.3 7.77 1.3 7.77l-.88.09c1.11-3.648-.483-6.484-1.323-7.178z"
        fill="currentColor"
      />
      <path
        d="M15.72 6.845l.786-.593c3.74 4.03 2.158 9.503 2.158 9.503l-.84.086c1.472-4.844-.762-8.116-2.104-8.996z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path
        d="M13.93 5.492l.715-.539c4.98 4.963 3.02 11.565 3.02 11.565l-.801.082c1.875-6.116-1.07-10.21-2.934-11.108z"
        fill="currentColor"
        fillOpacity="0.3"
      />
    </svg>
  );
}
