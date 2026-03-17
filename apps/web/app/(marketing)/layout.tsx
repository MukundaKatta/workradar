import Link from "next/link";
import { Radio } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Radio className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">
              WorkRadar
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/#features"
              className="text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              Blog
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className="border-t border-border bg-navy-900 text-navy-300">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                  <Radio className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">WorkRadar</span>
              </div>
              <p className="mt-3 text-sm">
                AI-powered job discovery that matches you with opportunities you
                didn&apos;t know existed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Product</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Company</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-navy-800 pt-8 text-center text-xs text-navy-500">
            &copy; {new Date().getFullYear()} WorkRadar. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
