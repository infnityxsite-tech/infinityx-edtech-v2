import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition" onClick={closeMenu}>
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
            <span className="font-bold text-lg text-slate-900">{APP_TITLE}</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-700 hover:text-slate-900 transition">
              Home
            </Link>
            <Link href="/about" className="text-slate-700 hover:text-slate-900 transition">
              About
            </Link>
            <Link href="/courses" className="text-slate-700 hover:text-slate-900 transition">
              Courses
            </Link>
            <Link href="/programs" className="text-slate-700 hover:text-slate-900 transition">
              Programs
            </Link>
            <Link href="/blog" className="text-slate-700 hover:text-slate-900 transition">
              Blog
            </Link>
            <Link href="/careers" className="text-slate-700 hover:text-slate-900 transition">
              Careers
            </Link>
            <Link href="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-slate-700 hover:text-slate-900 transition py-2"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-slate-700 hover:text-slate-900 transition py-2"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link 
                href="/courses" 
                className="text-slate-700 hover:text-slate-900 transition py-2"
                onClick={closeMenu}
              >
                Courses
              </Link>
              <Link 
                href="/programs" 
                className="text-slate-700 hover:text-slate-900 transition py-2"
                onClick={closeMenu}
              >
                Programs
              </Link>
              <Link 
                href="/blog" 
                className="text-slate-700 hover:text-slate-900 transition py-2"
                onClick={closeMenu}
              >
                Blog
              </Link>
              <Link 
                href="/careers" 
                className="text-slate-700 hover:text-slate-900 transition py-2"
                onClick={closeMenu}
              >
                Careers
              </Link>
              <Link href="/contact" onClick={closeMenu}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
