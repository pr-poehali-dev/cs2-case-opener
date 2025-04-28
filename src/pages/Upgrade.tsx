import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/LoginModal";
import { useToast } from "@/components/ui/use-toast";
import { InventoryItem } from "@/context/AuthContext";
import cases from "@/data/cases";

// Объединяем все предметы из всех кейсов для выбора цели апгрейда
const allItems = cases.flatMap(caseItem => 
  caseItem.items.map(item => ({...item, fromCase: caseItem.name}))
);

// Сортируем по цене
const sortedItems = [...allItems].sort((a, b) => a.price - b.price);

const rarityClasses = {
  rare: "bg-case-rare/20 border-case-rare",
  epic: "bg-case-epic/20 border-case-epic",
  legendary: "bg-case-legendary/20 border-case-legendary",
  mythical: "bg-case-mythical/20 border-case-mythical",
};

const Upgrade = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [targetItem, setTargetItem] = useState<any | null>(null);
  const [upgradeChance, setUpgradeChance] = useState(50);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<"win" | "lose" | null>(null);
  const { isAuthenticated, user, updateBalance, removeFromInventory, addToInventory } = useAuth();
  const { toast } = useToast();
  const wheelRef = useRef<HTMLDivElement>(null);

  // Выбираем целевой предмет на основе цены выбранного предмета и шанса
  useEffect(() => {
    if (selectedItem) {
      const priceMultiplier = 100 / upgradeChance; // Чем ниже шанс, тем выше множитель
      const targetPrice = selectedItem.price * priceMultiplier;
      
      // Находим предмет с ближайшей ценой выше целевой
      const possibleTargets = sortedItems.filter(item => item.price > selectedItem.price);
      if (possibleTargets.length > 0) {
        let closestItem = possibleTargets[0];
        let minDiff = Math.abs(targetPrice - closestItem.price);
        
        for (const item of possibleTargets) {
          const diff = Math.abs(targetPrice - item.price);
          if (diff < minDiff) {
            minDiff = diff;
            closestItem = item;
          }
        }
        
        setTargetItem(closestItem);
      }
    }
  }, [selectedItem, upgradeChance]);

  // Если пользователь не авторизован, отображаем сообщение и кнопку входа
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6 bg-card border border-border rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Доступ ограничен</h1>
            <p className="text-muted-foreground mb-6">
              Для использования режима апгрейда необходимо войти в аккаунт.
            </p>
            <Button onClick={() => setIsLoginModalOpen(true)}>
              Войти
            </Button>
            <LoginModal 
              isOpen={isLoginModalOpen} 
              onClose={() => setIsLoginModalOpen(false)} 
            />
          </div>
        </div>
      </div>
    );
  }

  // Проверяем, есть ли предметы в инвентаре
  if (user?.inventory.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6 bg-card border border-border rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Инвентарь пуст</h1>
            <p className="text-muted-foreground mb-6">
              У вас нет предметов для режима апгрейда. Откройте кейсы, чтобы получить предметы.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Открыть кейсы
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleStartUpgrade = () => {
    if (!selectedItem || !targetItem) return;
    
    setIsSpinning(true);
    setSpinResult(null);
    
    // Определяем результат апгрейда на основе шанса
    const isSuccessful = Math.random() * 100 < upgradeChance;
    
    // Анимация колеса
    if (wheelRef.current) {
      const fullRotation = 360;
      const additionalRotation = isSuccessful 
        ? 20 + Math.random() * 40 // Попадание в зеленую зону
        : 180 + Math.random() * 160; // Попадание в красную зону
      
      const totalRotation = fullRotation * 5 + additionalRotation; // 5 полных оборотов + результат
      
      wheelRef.current.style.transition = "transform 5s cubic-bezier(0.32, 0.94, 0.6, 1)";
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
      
      setTimeout(() => {
        setSpinResult(isSuccessful ? "win" : "lose");
        
        if (isSuccessful) {
          // Удаляем старый предмет
          removeFromInventory(selectedItem.id);
          
          // Добавляем новый предмет
          addToInventory({
            ...targetItem,
            id: `${targetItem.id}_${Date.now()}`, // Уникальный ID для инвентаря
          });
          
          toast({
            title: "Успешный апгрейд!",
            description: `Вы успешно улучшили предмет до ${targetItem.name}`,
          });
        } else {
          // Удаляем предмет при проигрыше
          removeFromInventory(selectedItem.id);
          
          toast({
            title: "Неудачный апгрейд",
            description: "К сожалению, ваш предмет был потерян при апгрейде",
            variant: "destructive"
          });
        }
        
        // Сбрасываем выбранный предмет после завершения
        setTimeout(() => {
          setSelectedItem(null);
          setIsSpinning(false);
        }, 2000);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Режим Апгрейд</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая панель - выбор предмета */}
          <div className="lg:col-span-1 bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Выберите предмет</h2>
            
            <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
              {user?.inventory.map((item) => (
                <div 
                  key={item.id} 
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    selectedItem?.id === item.id 
                      ? `${rarityClasses[item.rarity]} ring-2 ring-primary` 
                      : `${rarityClasses[item.rarity]} opacity-70 hover:opacity-100`
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="h-24 flex items-center justify-center mb-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div className="text-xs font-medium truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-case-legendary">
                    {item.price} ₽
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Центральная панель - апгрейд */}
          <div className="lg:col-span-1 flex flex-col">
            {selectedItem ? (
              <div className="flex-1 flex flex-col">
                {/* Настройка шанса */}
                <div className="bg-card border border-border rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-bold mb-4">Шанс апгрейда</h2>
                  
                  <div className="mb-4 flex items-center justify-between">
                    <Slider
                      value={[upgradeChance]}
                      onValueChange={(value) => setUpgradeChance(value[0])}
                      disabled={isSpinning}
                      min={10}
                      max={90}
                      step={1}
                      className="flex-1 mr-4"
                    />
                    <div className="text-lg font-bold w-14 text-right">
                      {upgradeChance}%
                    </div>
                  </div>
                </div>
                
                {/* Колесо апгрейда */}
                <div className="bg-card border border-border rounded-lg p-6 flex-1 flex flex-col">
                  <h2 className="text-lg font-bold mb-4">Апгрейд</h2>
                  
                  <div className="relative mb-8 flex-1 flex flex-col items-center justify-center">
                    {/* Колесо */}
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="48"
                          fill="transparent"
                          stroke="#333"
                          strokeWidth="4"
                        />
                        {/* Зеленая зона (шанс апгрейда) */}
                        <path
                          d={`M 50,50 L 50,2 A 48,48 0 0,1 ${50 + 48 * Math.sin(upgradeChance / 100 * 2 * Math.PI)},${50 - 48 * Math.cos(upgradeChance / 100 * 2 * Math.PI)} Z`}
                          fill="#16a34a"
                          opacity="0.6"
                        />
                        {/* Красная зона (шанс проигрыша) */}
                        <path
                          d={`M 50,50 L ${50 + 48 * Math.sin(upgradeChance / 100 * 2 * Math.PI)},${50 - 48 * Math.cos(upgradeChance / 100 * 2 * Math.PI)} A 48,48 0 1,1 50,2 Z`}
                          fill="#dc2626"
                          opacity="0.6"
                        />
                      </svg>
                      
                      {/* Стрелка */}
                      <div 
                        ref={wheelRef}
                        className="absolute inset-0 transition-transform"
                        style={{ transformOrigin: "center" }}
                      >
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-2">
                          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-white"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Результат апгрейда */}
                    {spinResult && (
                      <div className={`mt-4 text-xl font-bold ${
                        spinResult === "win" ? "text-green-500" : "text-red-500"
                      }`}>
                        {spinResult === "win" ? "УСПЕШНО!" : "НЕУДАЧА!"}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleStartUpgrade}
                    disabled={!selectedItem || !targetItem || isSpinning}
                  >
                    {isSpinning ? "Идет апгрейд..." : "Апгрейд"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-6 flex-1 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">👈</div>
                  <h3 className="text-xl font-bold mb-2">Выберите предмет</h3>
                  <p className="text-muted-foreground">
                    Выберите предмет из вашего инвентаря для апгрейда
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Правая панель - целевой предмет */}
          <div className="lg:col-span-1 bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Целевой предмет</h2>
            
            {selectedItem && targetItem ? (
              <div className="flex flex-col items-center">
                <div className={`border-2 rounded-lg p-6 ${rarityClasses[targetItem.rarity]}`}>
                  <div className="h-48 flex items-center justify-center mb-4">
                    <img
                      src={targetItem.image}
                      alt={targetItem.name}
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium mb-1">
                      {targetItem.name}
                    </div>
                    <div className="text-case-legendary font-bold mb-2">
                      {targetItem.price} ₽
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {targetItem.fromCase}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="text-sm mb-2">Коэффициент апгрейда:</div>
                  <div className="text-2xl font-bold text-case-legendary">
                    x{(targetItem.price / selectedItem.price).toFixed(2)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <p className="text-muted-foreground">
                  Выберите предмет для апгрейда, чтобы увидеть возможный результат
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upgrade;
