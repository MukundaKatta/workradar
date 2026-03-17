import { Radio } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-secondary p-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
          <Radio className="h-5 w-5 text-white" />
        </div>
        <span className="text-2xl font-bold text-text-primary">WorkRadar</span>
      </div>
      {children}
    </div>
  );
}
