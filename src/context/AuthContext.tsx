import React, { createContext, useContext, useState, useEffect } from "react";

export interface InventoryItem {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: string;
}

interface UserInfo {
  username: string;
  balance: number;
  inventory: InventoryItem[];
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateBalance: (amount: number) => void;
  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: string) => void;
  clearInventory: () => void; // Новый метод для очистки инвентаря
}

// Создаем контекст с начальными значениями
const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: () => false,
  logout: () => {},
  updateBalance: () => {},
  addToInventory: () => {},
  removeFromInventory: () => {},
  clearInventory: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Загружаем состояние из localStorage при инициализации
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem("isAuthenticated");
    return saved ? JSON.parse(saved) : false;
  });
  
  const [user, setUser] = useState<UserInfo | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Сохраняем состояние в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
    localStorage.setItem("user", JSON.stringify(user));
  }, [isAuthenticated, user]);

  // Функция для входа в систему
  const login = (username: string, password: string) => {
    // В реальном приложении здесь была бы проверка через API
    // Для демонстрации просто проверяем, что пароль не пустой
    if (password.length > 0) {
      setIsAuthenticated(true);
      setUser({
        username,
        balance: 1000, // Начальный баланс
        inventory: [], // Пустой инвентарь
      });
      return true;
    }
    return false;
  };

  // Функция для выхода из системы
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Функция для обновления баланса
  const updateBalance = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        balance: user.balance + amount,
      });
    }
  };

  // Функция для добавления предмета в инвентарь
  const addToInventory = (item: InventoryItem) => {
    if (user) {
      setUser({
        ...user,
        inventory: [...user.inventory, item],
      });
    }
  };

  // Функция для удаления предмета из инвентаря
  const removeFromInventory = (itemId: string) => {
    if (user) {
      setUser({
        ...user,
        inventory: user.inventory.filter(item => item.id !== itemId),
      });
    }
  };

  // Функция для очистки всего инвентаря
  const clearInventory = () => {
    if (user) {
      setUser({
        ...user,
        inventory: [],
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        login, 
        logout, 
        updateBalance, 
        addToInventory, 
        removeFromInventory,
        clearInventory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;