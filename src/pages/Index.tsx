import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CaseCard from "@/components/CaseCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cases } from "@/data/cases";
import CaseWheel from "@/components/CaseWheel";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";

const Index = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winItem, setWinItem] = useState(null);
  const [openCount, setOpenCount] = useState(1); // Количество кейсов для открытия
  const { isAuthenticated, user, updateBalance, addToInventory, addToDropHistory } = useAuth();

  const openCase = (selectedCase) => {
    if (!isAuthenticated) {
      // Если пользователь не авторизован, не открываем кейс
      return;
    }
    
    // Проверяем, достаточно ли средств для открытия выбранного количества кейсов
    const totalCost = selectedCase.price * openCount;
    if (user.balance < totalCost) {
      alert(`Недостаточно средств для открытия ${openCount} кейсов. Необходимо: ${totalCost} ₽`);
      return;
    }
    
    // Списываем стоимость кейсов с баланса
    updateBalance(-totalCost);
    
    // Устанавливаем состояние вращения
    setIsSpinning(true);
    
    // Через 5 секунд определяем выигрыш (показываем только последний)
    setTimeout(() => {
      // Определяем выигрыш для каждого открытого кейса
      const wins = [];
      for (let i = 0; i < openCount; i++) {
        // Выбираем случайный предмет из кейса
        const randomItem = selectedCase.items[Math.floor(Math.random() * selectedCase.items.length)];
        
        // Создаем уникальный ID для предмета
        const itemWithId = {
          ...randomItem,
          id: `${randomItem.id}_${Date.now()}_${i}`
        };
        
        // Добавляем в историю выпадений
        addToDropHistory(itemWithId);
        wins.push(itemWithId);
      }
      
      // Устанавливаем последний выигранный предмет для отображения
      setWinItem(wins[wins.length - 1]);
      
      // Если открыто больше 1 кейса, добавляем остальные предметы в инвентарь автоматически
      if (openCount > 1) {
        for (let i = 0; i < wins.length - 1; i++) {
          addToInventory(wins[i]);
        }
      }
      
      // Останавливаем вращение
      setIsSpinning(false);
      
      // Сбрасываем количество на 1 после открытия
      setOpenCount(1);
    }, 5000);
  };
  
  const claimItem = () => {
    if (winItem) {
      // Добавляем предмет в инвентарь
      addToInventory(winItem);
      
      // Сбрасываем выигранный предмет
      setWinItem(null);
    }
  };
  
  // Определяем максимальное количество кейсов, которое можно открыть
  const getMaxOpenCount = () => {
    if (!isAuthenticated || !selectedCase) return 1;
    return Math.floor(user.balance / selectedCase.price);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {selectedCase ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCase(null);
                  setWinItem(null);
                  setOpenCount(1);
                }}
                disabled={isSpinning}
              >
                Вернуться к списку кейсов
              </Button>
              
              <div className="text-xl font-bold">
                {selectedCase.name} - {selectedCase.price} ₽
              </div>
            </div>
            
            {winItem ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-6">Вы выиграли!</h2>
                
                <div className={`inline-block border-2 rounded-lg p-6 mb-6 ${
                  winItem.rarity === "rare" ? "bg-case-rare/20 border-case-rare" :
                  winItem.rarity === "epic" ? "bg-case-epic/20 border-case-epic" :
                  winItem.rarity === "legendary" ? "bg-case-legendary/20 border-case-legendary" :
                  "bg-case-mythical/20 border-case-mythical"
                }`}>
                  <div className="h-56 flex items-center justify-center mb-4">
                    <img 
                      src={winItem.image}
                      alt={winItem.name}
                      className="max-h-full object-contain"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2">{winItem.name}</h3>
                    <div className="text-2xl font-bold text-case-legendary mb-4">
                      {winItem.price} ₽
                    </div>
                    
                    <Button onClick={claimItem} size="lg">
                      Забрать предмет
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    onClick={() => {
                      setWinItem(null);
                      openCase(selectedCase);
                    }}
                    disabled={user?.balance < selectedCase.price}
                  >
                    Открыть еще раз ({selectedCase.price} ₽)
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Кнопки выбора количества для открытия */}
                {getMaxOpenCount() > 1 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Количество открытий:</h3>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant={openCount === 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setOpenCount(1)}
                      >
                        x1
                      </Button>
                      
                      {getMaxOpenCount() >= 2 && (
                        <Button 
                          variant={openCount === 2 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setOpenCount(2)}
                        >
                          x2
                        </Button>
                      )}
                      
                      {getMaxOpenCount() >= 3 && (
                        <Button 
                          variant={openCount === 3 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setOpenCount(3)}
                        >
                          x3
                        </Button>
                      )}
                      
                      {getMaxOpenCount() >= 5 && (
                        <Button 
                          variant={openCount === 5 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setOpenCount(5)}
                        >
                          x5
                        </Button>
                      )}
                      
                      {getMaxOpenCount() >= 10 && (
                        <Button 
                          variant={openCount === 10 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setOpenCount(10)}
                        >
                          x10
                        </Button>
                      )}
                      
                      <div className="text-sm ml-2">
                        Стоимость: <span className="font-bold text-case-legendary">{selectedCase.price * openCount} ₽</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <CaseWheel 
                  caseData={selectedCase} 
                  isSpinning={isSpinning}
                />
                
                <div className="text-center mt-8">
                  <Button 
                    size="lg"
                    onClick={() => openCase(selectedCase)}
                    disabled={isSpinning || (isAuthenticated && user?.balance < selectedCase.price * openCount)}
                  >
                    {isSpinning ? "Открывается..." : `Открыть ${openCount > 1 ? openCount + ' кейсов' : 'кейс'} за ${selectedCase.price * openCount} ₽`}
                  </Button>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">Содержимое кейса</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {selectedCase.items.map((item) => (
                      <div 
                        key={item.id}
                        className={`border-2 rounded-lg p-4 ${
                          item.rarity === "rare" ? "bg-case-rare/20 border-case-rare" :
                          item.rarity === "epic" ? "bg-case-epic/20 border-case-epic" :
                          item.rarity === "legendary" ? "bg-case-legendary/20 border-case-legendary" :
                          "bg-case-mythical/20 border-case-mythical"
                        }`}
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
                        <div className="text-xs font-medium text-case-legendary">
                          {item.price} ₽
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8">Доступные кейсы</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((caseItem) => (
                <CaseCard
                  key={caseItem.id}
                  {...caseItem}
                  onClick={() => setSelectedCase(caseItem)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;