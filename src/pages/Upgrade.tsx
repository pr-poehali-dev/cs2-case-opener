import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/LoginModal";
import { useToast } from "@/components/ui/use-toast";
import { InventoryItem } from "@/context/AuthContext";
import cases from "@/data/cases";
import { Slider } from "@/components/ui/slider";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info, CheckCircle2, XCircle } from "lucide-react";

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
  const [pendingItem, setPendingItem] = useState<InventoryItem | null>(null); // Предмет в ожидании апгрейда
  const [resultItem, setResultItem] = useState<InventoryItem | null>(null); // Результат апгрейда
  const [possibleTargets, setPossibleTargets] = useState<any[]>([]);
  const [targetItem, setTargetItem] = useState<any | null>(null);
  const [upgradeChance, setUpgradeChance] = useState<number>(50);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<"win" | "lose" | null>(null);
  const [userInvItems, setUserInvItems] = useState<InventoryItem[]>([]);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const { isAuthenticated, user, updateBalance, removeFromInventory, addToInventory, addToDropHistory } = useAuth();
  const { toast } = useToast();
  const wheelRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Обновляем копию инвентаря пользователя при изменениях
  useEffect(() => {
    if (user?.inventory) {
      setUserInvItems([...user.inventory]);
    }
  }, [user?.inventory]);

  // Выбираем возможные целевые предметы на основе цены выбранного предмета и шанса
  useEffect(() => {
    if (selectedItem) {
      const chanceValue = upgradeChance;
      const priceMultiplier = 100 / chanceValue; // Чем ниже шанс, тем выше множитель
      const maxTargetPrice = selectedItem.price * priceMultiplier * 1.2; // Максимальная цена с 20% запасом
      
      // Находим предметы с ценой выше текущего предмета, но не выше максимальной расчетной цены
      const filteredTargets = sortedItems.filter(
        item => item.price > selectedItem.price && item.price <= maxTargetPrice
      );
      
      if (filteredTargets.length > 0) {
        // Сортируем по близости к идеальной цене
        const idealTargetPrice = selectedItem.price * priceMultiplier;
        const sortedByTargetPrice = [...filteredTargets].sort((a, b) => 
          Math.abs(a.price - idealTargetPrice) - Math.abs(b.price - idealTargetPrice)
        );
        
        // Берем от 3 до 10 предметов
        const targets = sortedByTargetPrice.slice(0, Math.min(10, sortedByTargetPrice.length));
        
        setPossibleTargets(targets);
        setTargetItem(targets[0] || null);
      } else {
        setPossibleTargets([]);
        setTargetItem(null);
      }
    } else {
      setPossibleTargets([]);
      setTargetItem(null);
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
  if (userInvItems.length === 0 && !pendingItem && !resultItem) {
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

  const handleChangeChance = (value: number[]) => {
    if (!isSpinning) {
      setUpgradeChance(value[0]);
    }
  };

  const handleStartUpgrade = () => {
    if (!selectedItem || !targetItem) return;
    
    // Теперь мы помещаем предмет в состояние ожидания, а не удаляем сразу
    setPendingItem(selectedItem);
    
    // Удаляем предмет из локального состояния UI
    setUserInvItems(userInvItems.filter(item => item.id !== selectedItem.id));
    setSelectedItem(null);
    
    setIsSpinning(true);
    setSpinResult(null);
    
    // Определяем результат апгрейда на основе шанса
    const isSuccessful = Math.random() * 100 < upgradeChance;
    
    // Анимация вращения стрелки
    if (arrowRef.current) {
      // Определяем угол, куда повернется стрелка
      let finalAngle: number;
      
      if (isSuccessful) {
        // Успешный апгрейд - попадание в зеленую зону
        const greenAngle = 360 * (upgradeChance / 100); // Размер зеленой зоны в градусах
        finalAngle = Math.random() * greenAngle; // Случайный угол в пределах зеленой зоны
      } else {
        // Неудачный апгрейд - попадание в красную зону
        const greenAngle = 360 * (upgradeChance / 100); // Размер зеленой зоны в градусах
        const redStartAngle = greenAngle; // Начало красной зоны сразу после зеленой
        finalAngle = redStartAngle + Math.random() * (360 - greenAngle); // Случайный угол в пределах красной зоны
      }
      
      // Добавляем несколько полных оборотов только по часовой стрелке
      const fullRotations = 2 + Math.floor(Math.random() * 3); // От 2 до 4 полных оборотов
      const totalAngle = 360 * fullRotations + finalAngle;
      
      // Случайные параметры анимации
      const spinDuration = 4 + Math.random() * 2; // От 4 до 6 секунд
      
      // Выбираем кривую Безье для замедления вращения
      const easingFunctions = [
        'cubic-bezier(0.34, 1.56, 0.64, 1)', // Быстрое начало, медленное окончание с небольшим отскоком
        'cubic-bezier(0.22, 1, 0.36, 1)', // Плавное замедление
        'cubic-bezier(0.16, 1, 0.3, 1)', // Экспоненциальное замедление
        'cubic-bezier(0.25, 0.8, 0.25, 1)' // Стандартное замедление
      ];
      const randomEasing = easingFunctions[Math.floor(Math.random() * easingFunctions.length)];
      
      // Применяем анимацию только по часовой стрелке (положительный угол)
      arrowRef.current.style.transition = `transform ${spinDuration}s ${randomEasing}`;
      arrowRef.current.style.transform = `rotate(${Math.abs(totalAngle)}deg)`;
      
      setTimeout(() => {
        setSpinResult(isSuccessful ? "win" : "lose");
        
        if (isSuccessful) {
          // Сохраняем результат апгрейда для отображения в диалоге
          const newItem = {
            ...targetItem,
            id: `${targetItem.id}_${Date.now()}`, // Уникальный ID для инвентаря
          };
          setResultItem(newItem);
          
          // Добавляем в историю выпадений
          addToDropHistory(newItem);
        } else {
          // Сохраняем информацию о проигрыше
          setResultItem(null);
        }
        
        // Показываем диалог с результатом
        setIsResultDialogOpen(true);
        
        // Сбрасываем вращение
        setTimeout(() => {
          setIsSpinning(false);
          
          // Сбрасываем позицию стрелки (без анимации)
          if (arrowRef.current) {
            arrowRef.current.style.transition = 'none';
            arrowRef.current.style.transform = 'rotate(0deg)';
          }
        }, 1000);
      }, spinDuration * 1000);
    }
  };

  const handleClaimResult = () => {
    // Если апгрейд был успешным и есть предмет для получения
    if (spinResult === "win" && resultItem) {
      // Добавляем выигранный предмет в инвентарь
      addToInventory(resultItem);
      
      toast({
        title: "Предмет получен",
        description: `${resultItem.name} добавлен в ваш инвентарь`,
      });
    } else {
      // При проигрыше предмет полностью пропадает
      toast({
        title: "Предмет потерян",
        description: "К сожалению, ваш предмет был потерян при апгрейде",
        variant: "destructive"
      });
    }
    
    // В любом случае удаляем исходный предмет из инвентаря
    if (pendingItem) {
      removeFromInventory(pendingItem.id);
    }
    
    // Сбрасываем состояние
    setPendingItem(null);
    setResultItem(null);
    setIsResultDialogOpen(false);
  };

  const selectTargetItem = (item: any) => {
    if (!isSpinning) {
      setTargetItem(item);
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
              {userInvItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    selectedItem?.id === item.id 
                      ? `${rarityClasses[item.rarity]} ring-2 ring-primary` 
                      : `${rarityClasses[item.rarity]} opacity-70 hover:opacity-100`
                  }`}
                  onClick={() => !isSpinning && setSelectedItem(item)}
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
            {selectedItem || pendingItem ? (
              <div className="flex-1 flex flex-col">
                {/* Настройка шанса */}
                <div className="bg-card border border-border rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Шанс апгрейда</h2>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Info className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <h3 className="font-medium mb-2">Как работает апгрейд?</h3>
                        <p className="text-sm text-muted-foreground">
                          Чем ниже шанс, тем больше множитель цены и ценнее предметы. 
                          Например, при шансе 25% вы можете получить предмет в 4 раза дороже вашего.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-6">
                    <Slider 
                      value={[upgradeChance]} 
                      onValueChange={handleChangeChance} 
                      min={10} 
                      max={90} 
                      step={5}
                      disabled={isSpinning}
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold">{upgradeChance}%</div>
                      <div className="text-sm text-muted-foreground">
                        Множитель: x{(100 / upgradeChance).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Колесо апгрейда */}
                <div className="bg-card border border-border rounded-lg p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Апгрейд</h2>
                    <div className={`text-lg font-bold ${
                      spinResult === "win" ? "text-green-500" : 
                      spinResult === "lose" ? "text-red-500" : "opacity-0"
                    }`}>
                      {spinResult === "win" ? "УСПЕШНО!" : 
                       spinResult === "lose" ? "НЕУДАЧА!" : "."}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="flex items-center w-full mb-8">
                      {/* Исходный предмет */}
                      <div className={`w-1/3 p-2 border-2 rounded-lg ${rarityClasses[pendingItem?.rarity || selectedItem?.rarity]}`}>
                        <img
                          src={pendingItem?.image || selectedItem?.image}
                          alt={pendingItem?.name || selectedItem?.name}
                          className="h-20 w-auto object-contain mx-auto mb-1"
                        />
                        <div className="text-xs font-medium truncate text-center">
                          {pendingItem?.name || selectedItem?.name}
                        </div>
                        <div className="text-xs text-case-legendary text-center">
                          {pendingItem?.price || selectedItem?.price} ₽
                        </div>
                      </div>
                      
                      {/* Стрелка */}
                      <div className="w-1/3 flex justify-center">
                        <div className="text-3xl">→</div>
                      </div>
                      
                      {/* Целевой предмет */}
                      {targetItem ? (
                        <div className={`w-1/3 p-2 border-2 rounded-lg ${rarityClasses[targetItem.rarity]}`}>
                          <img
                            src={targetItem.image}
                            alt={targetItem.name}
                            className="h-20 w-auto object-contain mx-auto mb-1"
                          />
                          <div className="text-xs font-medium truncate text-center">
                            {targetItem.name}
                          </div>
                          <div className="text-xs text-case-legendary text-center">
                            {targetItem.price} ₽
                          </div>
                        </div>
                      ) : (
                        <div className="w-1/3 p-2 border-2 rounded-lg bg-card/50 border-border flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Нет подходящих предметов</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Новое круговое колесо апгрейда со стрелкой */}
                    <div className="relative w-64 h-64 mb-4">
                      {/* Круг с зеленой и красной секциями */}
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Красный сектор (неудача) */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="48" 
                          fill="#dc2626" 
                          opacity="0.6"
                        />
                        {/* Зеленый сектор (успех) - рисуется поверх красного */}
                        <path
                          d={`M 50,50 L 50,2 A 48,48 0 ${upgradeChance > 50 ? 1 : 0},1 ${
                            50 + 48 * Math.sin(upgradeChance / 100 * 2 * Math.PI)
                          },${
                            50 - 48 * Math.cos(upgradeChance / 100 * 2 * Math.PI)
                          } Z`}
                          fill="#16a34a"
                          opacity="0.6"
                        />
                        {/* Внешний круг */}
                        <circle
                          cx="50"
                          cy="50"
                          r="48"
                          fill="none"
                          stroke="#333"
                          strokeWidth="1"
                        />
                        {/* Центральная точка */}
                        <circle
                          cx="50"
                          cy="50"
                          r="3"
                          fill="#white"
                        />
                      </svg>
                      
                      {/* Стрелка-указатель (заменена на настоящую стрелку) */}
                      <div 
                        ref={arrowRef}
                        className="absolute top-0 left-0 w-full h-full"
                        style={{ transformOrigin: 'center' }}
                      >
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                          <svg width="20" height="52" viewBox="0 0 20 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 0L18.6603 15H1.33975L10 0Z" fill="white"/>
                            <rect x="9" y="12" width="2" height="40" fill="white"/>
                          </svg>
                        </div>
                      </div>
                      
                      {/* Текстовые индикаторы */}
                      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-sm">
                        {upgradeChance}%
                      </div>
                      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-white font-bold text-sm">
                        {100 - upgradeChance}%
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleStartUpgrade}
                    disabled={!selectedItem || !targetItem || isSpinning || !!pendingItem}
                  >
                    {isSpinning ? "Идет апгрейд..." : pendingItem ? "Ожидание..." : "Апгрейд"}
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
            
            {(selectedItem || pendingItem) && possibleTargets.length > 0 ? (
              <div className="flex flex-col">
                {/* Выбранный целевой предмет */}
                <div className={`border-2 rounded-lg p-6 mb-4 ${rarityClasses[targetItem.rarity]}`}>
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
                
                {/* Коэффициент апгрейда */}
                <div className="mb-4">
                  <div className="text-sm mb-2">Коэффициент апгрейда:</div>
                  <div className="text-2xl font-bold text-case-legendary">
                    x{(targetItem.price / (pendingItem?.price || selectedItem?.price)).toFixed(2)}
                  </div>
                </div>
                
                {/* Альтернативные варианты */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Другие варианты:</h3>
                  <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                    {possibleTargets.filter(item => item.id !== targetItem.id).map((item) => (
                      <div 
                        key={item.id} 
                        className={`border rounded-lg p-2 cursor-pointer ${rarityClasses[item.rarity]} hover:ring-2 hover:ring-primary`}
                        onClick={() => !isSpinning && selectTargetItem(item)}
                      >
                        <div className="h-16 flex items-center justify-center mb-1">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full object-contain"
                          />
                        </div>
                        <div className="text-xs text-center font-medium truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-center text-case-legendary">
                          {item.price} ₽
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (selectedItem || pendingItem) && possibleTargets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-muted-foreground">
                  Нет предметов, подходящих для апгрейда с текущим шансом ({upgradeChance}%). 
                  Попробуйте уменьшить шанс или выбрать другой предмет.
                </p>
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

      {/* Диалог результатов апгрейда */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {spinResult === "win" ? "Успешный апгрейд!" : "Неудачный апгрейд"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-6">
            {spinResult === "win" && resultItem ? (
              <>
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <div className={`border-2 rounded-lg p-4 ${rarityClasses[resultItem.rarity]}`}>
                  <img
                    src={resultItem.image}
                    alt={resultItem.name}
                    className="h-32 w-auto object-contain mx-auto mb-2"
                  />
                  <div className="text-center">
                    <div className="font-medium">{resultItem.name}</div>
                    <div className="text-case-legendary font-bold">{resultItem.price} ₽</div>
                  </div>
                </div>
                <p className="mt-4 text-center text-muted-foreground">
                  Поздравляем! Вы успешно улучшили предмет.
                </p>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
                <p className="text-center text-muted-foreground">
                  К сожалению, апгрейд не удался. Ваш предмет был потерян.
                </p>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              className="w-full" 
              onClick={handleClaimResult}
            >
              {spinResult === "win" ? "Забрать предмет" : "Закрыть"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Upgrade;