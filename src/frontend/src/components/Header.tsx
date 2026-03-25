import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCartStore } from "../store/cartStore";
import CartDrawer from "./CartDrawer";

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Header({ currentPath, onNavigate }: HeaderProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  const navLinks = [
    { label: "Collections", path: "/collections" },
    { label: "Perfumes", path: "/products" },
    { label: "Gifting", path: "/gifting" },
    { label: "Our Story", path: "/story" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <button
            type="button"
            data-ocid="header.link"
            onClick={() => onNavigate("/")}
            className="font-display text-2xl font-bold tracking-[0.25em] text-gold uppercase"
          >
            RAWAHA
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.path}
                data-ocid="nav.link"
                onClick={() => onNavigate(link.path)}
                className={`text-sm tracking-luxury uppercase transition-colors hover:text-gold ${
                  currentPath === link.path ? "text-gold" : "text-foreground/80"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="hidden text-foreground/80 transition-colors hover:text-gold md:block"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              type="button"
              data-ocid="header.link"
              onClick={() => onNavigate("/admin")}
              className="hidden text-foreground/80 transition-colors hover:text-gold md:block"
              aria-label="Account"
            >
              <User size={18} />
            </button>
            <button
              type="button"
              data-ocid="cart.open_modal_button"
              onClick={() => setCartOpen(true)}
              className="relative text-foreground/80 transition-colors hover:text-gold"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              type="button"
              className="text-foreground/80 transition-colors hover:text-gold md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border bg-background md:hidden"
            >
              <nav className="flex flex-col gap-0 px-6 py-4">
                {navLinks.map((link) => (
                  <button
                    type="button"
                    key={link.path}
                    onClick={() => {
                      onNavigate(link.path);
                      setMobileMenuOpen(false);
                    }}
                    className="border-b border-border py-3 text-left text-sm tracking-luxury uppercase text-foreground/80 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("/admin");
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 text-left text-sm tracking-luxury uppercase text-foreground/80 transition-colors hover:text-gold"
                >
                  Account
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
}
