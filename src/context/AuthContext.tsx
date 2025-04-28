import { ReactNode, createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  balance: number;
  inventory: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: "rare" | "epic" | "legendary" | "mythical";
  wear?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  updateBalance: (amount: number) => void;
  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: string) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Заглушка для имитации хранилища пользователей
const USERS_STORAGE_KEY = "cs2-cases-users";
const CURRENT_USER_KEY = "cs2-cases-current-user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных пользователя при инициализации
  useEffect(() => {
    const loadUser = () => {
      const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
      if (currentUserId) {
        const usersString = localStorage.getItem(USERS_STORAGE_KEY);
        if (usersString) {
          const users = JSON.parse(usersString);
          const currentUser = users.find((u: User) => u.id === currentUserId);
          if (currentUser) {
            setUser(currentUser);
          }
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Сохранение данных пользователя при обновлении
  useEffect(() => {
    if (user) {
      const usersString = localStorage.getItem(USERS_STORAGE_KEY);
      let users = usersString ? JSON.parse(usersString) : [];
      
      // Обновляем пользователя в хранилище
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex >= 0) {
        users[userIndex] = user;
      } else {
        users.push(user);
      }
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      localStorage.setItem(CURRENT_USER_KEY, user.id);
    }
  }, [user]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Имитация API-запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const usersString = localStorage.getItem(USERS_STORAGE_KEY);
      const users = usersString ? JSON.parse(usersString) : [];
      
      const foundUser = users.find(
        (u: any) => u.username === username
      );
      
      if (!foundUser) {
        throw new Error("Пользователь не найден");
      }
      
      // В реальном приложении здесь была бы проверка пароля
      
      setUser(foundUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Имитация API-запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const usersString = localStorage.getItem(USERS_STORAGE_KEY);
      const users = usersString ? JSON.parse(usersString) : [];
      
      // Проверка на существующего пользователя
      if (users.some((u: any) => u.username === username)) {
        throw new Error("Пользователь с таким именем уже существует");
      }
      
      // Создание нового пользователя
      const newUser: User = {
        id: Date.now().toString(),
        username,
        balance: 1000, // Начальный баланс для новых пользователей
        inventory: []
      };
      
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      setUser(newUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  const updateBalance = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        balance: user.balance + amount
      });
    }
  };

  const addToInventory = (item: InventoryItem) => {
    if (user) {
      setUser({
        ...user,
        inventory: [...user.inventory, item]
      });
    }
  };

  const removeFromInventory = (itemId: string) => {
    if (user) {
      setUser({
        ...user,
        inventory: user.inventory.filter(item => item.id !== itemId)
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        register, 
        updateBalance, 
        addToInventory, 
        removeFromInventory,
        isAuthenticated: !!user,
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
