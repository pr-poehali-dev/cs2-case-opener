import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserCircle, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = ({ balance = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-case-mythical bg-clip-text text-transparent">
                CS2 CASES
              </span>
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary/20 transition">
                  Кейсы
                </Link>
                <Link to="/upgrade" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary/20 transition">
                  Апгрейд
                </Link>
                <Link to="/contracts" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary/20 transition">
                  Контракты
                </Link>
                <Link to="/crash" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary/20 transition">
                  Краш
                </Link>
                <Link to="/support" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary/20 transition">
                  Тех. поддержка
                </Link>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="rounded-md bg-secondary/50 px-3 py-1.5 text-sm font-medium">
              Баланс: <span className="text-case-legendary">{balance} ₽</span>
            </div>
            <Button variant="secondary">
              Пополнить
            </Button>
            <Button>
              <UserCircle className="mr-2 h-4 w-4" />
              Войти
            </Button>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-primary/20"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/50">
          <div className="space-y-1 px-4 py-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary/20">
              Кейсы
            </Link>
            <Link to="/upgrade" className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary/20">
              Апгрейд
            </Link>
            <Link to="/contracts" className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary/20">
              Контракты
            </Link>
            <Link to="/crash" className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary/20">
              Краш
            </Link>
            <Link to="/support" className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary/20">
              Тех. поддержка
            </Link>
            <div className="pt-4 pb-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="rounded-md bg-secondary/50 px-3 py-1.5 text-sm font-medium">
                  Баланс: <span className="text-case-legendary">{balance} ₽</span>
                </div>
                <Button variant="secondary" size="sm">
                  Пополнить
                </Button>
              </div>
              <div className="mt-3">
                <Button className="w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Войти
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;