import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-screen-xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <button
              type="button"
              onClick={() => onNavigate("/")}
              className="font-display text-2xl font-bold tracking-[0.25em] text-gold uppercase"
            >
              RAWAHA
            </button>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Luxury Arabian fragrances crafted with the finest ingredients from
              around the world.
            </p>
            {/* Newsletter */}
            <div className="mt-6">
              <p className="mb-3 text-xs uppercase tracking-luxury text-foreground">
                Newsletter
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  className="rounded bg-gold px-4 py-2 text-xs font-medium uppercase tracking-wide text-primary-foreground hover:bg-gold/90"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-xs uppercase tracking-luxury text-foreground">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Home", path: "/" },
                { label: "Perfumes", path: "/products" },
                { label: "Cart", path: "/cart" },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.path)}
                    className="text-sm text-muted-foreground transition-colors hover:text-gold"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="mb-5 text-xs uppercase tracking-luxury text-foreground">
              Collections
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                "Oud Collection",
                "Floral Collection",
                "Gift Sets",
                "Men's Fragrances",
                "Women's Fragrances",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-5 text-xs uppercase tracking-luxury text-foreground">
              Follow Us
            </h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground transition-colors hover:text-gold"
              >
                <SiInstagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-muted-foreground transition-colors hover:text-gold"
              >
                <SiFacebook size={18} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="text-muted-foreground transition-colors hover:text-gold"
              >
                <SiX size={18} />
              </a>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                📞 +92 300 1234567
              </p>
              <p className="text-xs text-muted-foreground">
                ✉ hello@rawaha.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <p className="text-xs text-muted-foreground">
            &copy; {year} RAWAHA. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
