import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Tractor, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", type: "route", to: "/" },
    { label: "Find Machinery", type: "anchor", href: "#find" },
    { label: "About", type: "route", to: "/about" },
    { label: "Contact", type: "route", to: "/contact" },
  ];

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow duration-300">
              <Tractor className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-tight">KrishiYantra</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.type === "anchor" ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">
                    <User className="w-4 h-4 mr-1" />
                    My Bookings
                  </Link>
                </Button>

                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">
                    <User className="w-4 h-4 mr-1" />
                    Login
                  </Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Left Drawer */}
          <div className="relative h-full w-72 max-w-[80%] bg-card border-r border-border shadow-elevated flex flex-col">
            <div className="flex items-center justify-between px-4 h-16 border-b border-border">
              <Link
                to="/"
                className="flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-9 h-9 rounded-xl hero-gradient flex items-center justify-center">
                  <Tractor className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-base font-semibold text-foreground">
                  KrishiYantra
                </span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-foreground"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) =>
                  link.type === "anchor" ? (
                    <a
                      key={link.label}
                      href={link.href}
                      className="py-2.5 px-4 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors text-left"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="py-2.5 px-4 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors text-left"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </nav>

            <div className="border-t border-border p-4 flex flex-col gap-2">
              {user ? (
                <>
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to="/dashboard">My Bookings</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to="/auth">Login</Link>
                  </Button>
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
