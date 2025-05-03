import React, { createContext, useContext, useState, useEffect } from "react";

export interface InventoryItem {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: string;
}

export interface DropHistory {
  username: string;
  item: InventoryItem;
  timestamp: number;
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
  clearInventory: () => void;
  dropHistory: DropHistory[];
  addToDropHistory: (item: InventoryItem) => void;
}

// Список реальных имен для истории выпадений
const realNames = [
  "Игорь_2007", "xXDragon_SlayerXx", "ProGamer99", "КиберБУЛЬБАШ", 
  "MrSniper", "Васян228", "DestroyerPRO", "Lady_Kill", "HunterOfShadows",
  "ПростоПавел", "Semen4ik", "Мажор1337", "CS_Мастер", "Анимешник", 
  "Геймер_с_опытом", "ФорсМажор", "Стас_АК47", "GoodRusPlayer", "AWP_Monster"
];

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
  dropHistory: [],
  addToDropHistory: () => {},
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

  // История выпадений предметов
  const [dropHistory, setDropHistory] = useState<DropHistory[]>(() => {
    const saved = localStorage.getItem("dropHistory");
    return saved ? JSON.parse(saved) : [];
  });

  // Сохраняем состояние в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("dropHistory", JSON.stringify(dropHistory));
  }, [isAuthenticated, user, dropHistory]);

  // Создаем начальную историю выпадений при первой загрузке
  useEffect(() => {
    if (dropHistory.length === 0) {
      // Генерируем историю из случайных предметов
      const initialHistory: DropHistory[] = [];
      
      // Импортируем все кейсы и создаем начальную историю
      import("@/data/cases").then((module) => {
        const allCases = module.default;
        const allItems = allCases.flatMap(caseItem => caseItem.items);
        
        // Генерируем 20 случайных выпадений
        for (let i = 0; i < 20; i++) {
          const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
          const randomName = realNames[Math.floor(Math.random() * realNames.length)];
          // Время в течение последних 24 часов
          const randomTime = Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000);
          
          initialHistory.push({
            username: randomName,
            item: { ...randomItem },
            timestamp: randomTime
          });
        }
        
        // Сортируем по времени (новые сверху)
        initialHistory.sort((a, b) => b.timestamp - a.timestamp);
        setDropHistory(initialHistory);
      });
    }
  }, []);

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

  // Функция для добавления предмета в историю выпадений
  const addToDropHistory = (item: InventoryItem) => {
    if (user) {
      const newDrop: DropHistory = {
        username: user.username,
        item,
        timestamp: Date.now()
      };
      
      // Добавляем в начало массива (новые сверху)
      setDropHistory(prevHistory => [newDrop, ...prevHistory]);
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
        dropHistory,
        addToDropHistory
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;