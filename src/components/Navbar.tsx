import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, LogIn, Menu, X, Package2, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
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
              {isAuthenticated ? (
                <>
                  <div className="rounded-md bg-secondary/50 px-3 py-1.5 text-sm font-medium">
                    Баланс: <span className="text-case-legendary">{user?.balance} ₽</span>
                  </div>
                  <Link to="/deposit">
                    <Button variant="secondary">
                      Пополнить
                    </Button>
                  </Link>
                  <Link to="/inventory">
                    <Button variant="outline">
                      <Package2 className="mr-2 h-4 w-4" />
                      Инвентарь
                    </Button>
                  </Link>
                  <Button onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </Button>
                </>
              ) : (
                <Button onClick={handleLogin}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Войти
                </Button>
              )}
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
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="rounded-md bg-secondary/50 px-3 py-1.5 text-sm font-medium">
                        Баланс: <span className="text-case-legendary">{user?.balance} ₽</span>
                      </div>
                      <Link to="/deposit">
                        <Button variant="secondary" size="sm">
                          Пополнить
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-3">
                      <Link to="/inventory" className="w-full block mb-2">
                        <Button className="w-full" variant="outline">
                          <Package2 className="mr-2 h-4 w-4" />
                          Инвентарь
                        </Button>
                      </Link>
                      <Button className="w-full" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Выйти
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="mt-3">
                    <Button className="w-full" onClick={handleLogin}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Войти
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
