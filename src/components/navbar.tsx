import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import GradientButton from "@/components/gradient-button";

import { navlinks } from "@/data";
import { cn } from "@/lib/utils";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.a
      className="relative text-neutral-100 transition-colors duration-200"
      whileHover="hover"
      href={href}
    >
      {children}
      <motion.span
        className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-900"
        initial={{ scaleX: 0 }}
        variants={{
          hover: { scaleX: 1 },
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
  );
};

const MobileNavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <a
    href={href}
    className={cn(
      buttonVariants({
        variant: "ghost",
      }),
      "w-full justify-start"
    )}
    onClick={onClick}
  >
    {children}
  </a>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          isScrolled ? "py-0 top-2" : "pt-2 pb-4"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={cn(
            "mx-auto px-3 sm:px-10 md:px-16",
            isScrolled
              ? "max-w-5xl backdrop-blur-md shadow-md rounded-md py-1 max-sm:mx-3 !px-6 bg-neutral-900/35"
              : "container"
          )}
        >
          <nav className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Link to="/" className="flex items-center">
                <img
                  src="/images/logo.webp"
                  alt="Startify Logo"
                  className="size-14 w-auto"
                />
              </Link>
            </motion.div>

            <div className="hidden md:flex items-center space-x-6 text-white">
              {navlinks.map((item) => (
                <NavLink key={item.name} href={item.href}>
                  {item.name}
                </NavLink>
              ))}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GradientButton
                  className="max-sm:w-full"
                  label={"Register Now"}
                  href="#about"
                />
              </motion.div>
            </div>

            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  className="w-1/2 rounded-tl-md rounded-bl-md"
                  side="right"
                >
                  <nav className="flex flex-col space-y-4 mt-6">
                    {navlinks.map((item) => (
                      <MobileNavLink
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </MobileNavLink>
                    ))}
                    <GradientButton
                      className="max-sm:w-full"
                      label={"Register Now"}
                      href="#about"
                    />
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </motion.div>
      </motion.header>
    </AnimatePresence>
  );
}
