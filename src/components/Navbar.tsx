import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, LogIn, Menu, X, Package2, LogOut, Wallet } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "./LoginModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                        <UserCircle className="h-6 w-6" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="flex items-center justify-start p-2">
                        <div className="ml-2">
                          <p className="text-sm font-medium">{user?.username}</p>
                          <p className="text-xs text-muted-foreground">
                            Баланс: <span className="text-case-legendary">{user?.balance} ₽</span>
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/inventory" className="w-full cursor-pointer">
                          <Package2 className="mr-2 h-4 w-4" /> Инвентарь
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/deposit" className="w-full cursor-pointer">
                          <Wallet className="mr-2 h-4 w-4" /> Пополнить баланс
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                        <LogOut className="mr-2 h-4 w-4" /> Выйти
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                    </div>
                    <div className="mt-3 space-y-2">
                      <Link to="/deposit" className="w-full block">
                        <Button className="w-full" variant="secondary">
                          <Wallet className="mr-2 h-4 w-4" />
                          Пополнить
                        </Button>
                      </Link>
                      <Link to="/inventory" className="w-full block">
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