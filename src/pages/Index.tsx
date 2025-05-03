import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CaseCard from "@/components/CaseCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cases } from "@/data/cases";
import CaseWheel from "@/components/CaseWheel";
import DropHistoryFeed from "@/components/DropHistoryFeed";

const Index = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winItem, setWinItem] = useState(null);
  const { isAuthenticated, user, updateBalance, addToInventory, addToDropHistory } = useAuth();

  const openCase = (selectedCase) => {
    if (!isAuthenticated) {
      // Если пользователь не авторизован, не открываем кейс
      return;
    }
    
    // Проверяем, достаточно ли средств
    if (user.balance < selectedCase.price) {
      alert("Недостаточно средств для открытия кейса");
      return;
    }
    
    // Списываем стоимость кейса с баланса
    updateBalance(-selectedCase.price);
    
    // Устанавливаем состояние вращения
    setIsSpinning(true);
    
    // Через 5 секунд определяем выигрыш
    setTimeout(() => {
      // Выбираем случайный предмет из кейса
      const randomItem = selectedCase.items[Math.floor(Math.random() * selectedCase.items.length)];
      
      // Создаем уникальный ID для предмета
      const itemWithId = {
        ...randomItem,
        id: `${randomItem.id}_${Date.now()}`
      };
      
      // Устанавливаем выигранный предмет
      setWinItem(itemWithId);
      
      // Останавливаем вращение
      setIsSpinning(false);
      
      // Добавляем в историю выпадений
      addToDropHistory(itemWithId);
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Лента выпадений слева */}
          <div className="hidden lg:block lg:col-span-3">
            <DropHistoryFeed />
          </div>
          
          {/* Основной контент */}
          <div className="col-span-12 lg:col-span-9">
            {selectedCase ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedCase(null);
                      setWinItem(null);
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
                    <CaseWheel 
                      caseData={selectedCase} 
                      isSpinning={isSpinning}
                    />
                    
                    <div className="text-center mt-8">
                      <Button 
                        size="lg"
                        onClick={() => openCase(selectedCase)}
                        disabled={isSpinning || (isAuthenticated && user?.balance < selectedCase.price)}
                      >
                        {isSpinning ? "Открывается..." : `Открыть за ${selectedCase.price} ₽`}
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
                
                {/* Мобильная версия ленты выпадений */}
                <div className="block lg:hidden mt-8">
                  <DropHistoryFeed />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;