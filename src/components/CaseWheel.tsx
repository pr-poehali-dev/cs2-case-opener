import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CaseItem } from "./CaseCard";

interface CaseWheelProps {
  items: CaseItem[];
  onOpenCase: () => Promise<CaseItem>;
  onClose: () => void;
}

const rarityClasses = {
  rare: "bg-case-rare/20 border-case-rare",
  epic: "bg-case-epic/20 border-case-epic",
  legendary: "bg-case-legendary/20 border-case-legendary",
  mythical: "bg-case-mythical/20 border-case-mythical",
};

const CaseWheel = ({ items, onOpenCase, onClose }: CaseWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<CaseItem | null>(null);
  const [wheelItems, setWheelItems] = useState<CaseItem[]>([]);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Функция для создания списка предметов для колеса, включая победный предмет
  const generateWheelItems = (winningItem: CaseItem) => {
    // Создаем копию списка предметов, чтобы не изменять оригинал
    const randomItems: CaseItem[] = [];
    
    // Добавляем случайные предметы (примерно 35-45 предметов)
    const itemCount = 35 + Math.floor(Math.random() * 10);
    for (let i = 0; i < itemCount; i++) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      randomItems.push({...randomItem, id: `${randomItem.id}_${i}_${Date.now()}`});
    }
    
    // Определяем позицию для выигрышного предмета (примерно во второй половине колеса)
    const winningPosition = Math.floor(itemCount * 0.6) + Math.floor(Math.random() * (itemCount * 0.3));
    
    // Вставляем точную копию выигрышного предмета в нужную позицию
    randomItems[winningPosition] = {...winningItem, id: `${winningItem.id}_winning_${Date.now()}`};
    
    return { items: randomItems, winningPosition };
  };

  const spinWheel = async () => {
    setIsSpinning(true);
    setResult(null);
    
    try {
      // Получаем выигрышный предмет от API
      const winningItem = await onOpenCase();
      
      // Генерируем новые предметы для колеса с выигрышным предметом в определенной позиции
      const { items: newWheelItems, winningPosition } = generateWheelItems(winningItem);
      setWheelItems(newWheelItems);
      
      // Сбрасываем позицию колеса
      if (wheelRef.current) {
        wheelRef.current.style.transition = "none";
        wheelRef.current.style.transform = "translateX(0)";
        
        // Форсируем перерисовку
        wheelRef.current.offsetHeight;
      }
      
      // Запускаем анимацию прокрутки к выигрышному предмету
      setTimeout(() => {
        if (wheelRef.current) {
          // Рассчитываем позицию выигрышного предмета
          const targetPosition = winningPosition * 160 + 80; // 160px width of each item + center offset
          
          // Создаем полностью случайную анимацию каждый раз
          const randomSpeed = 6 + Math.random() * 6; // от 6 до 12 секунд
          
          // Разные варианты кривых Безье для разнообразия анимации
          const bezierCurves = [
            `cubic-bezier(0.25, 0.1, 0.25, 1)`,
            `cubic-bezier(0.42, 0, 0.58, 1)`,
            `cubic-bezier(0.19, 1, 0.22, 1)`,
            `cubic-bezier(0.68, -0.55, 0.27, 1.55)`,
            `cubic-bezier(0.33, 1, 0.68, 1)`
          ];
          
          const randomEasing = bezierCurves[Math.floor(Math.random() * bezierCurves.length)];
          
          if (wheelRef.current) {
            wheelRef.current.style.transition = `transform ${randomSpeed}s ${randomEasing}`;
            wheelRef.current.style.transform = `translateX(${-targetPosition}px)`;
          }
          
          // Устанавливаем результат после завершения анимации
          setTimeout(() => {
            setResult(winningItem);
            setIsSpinning(false);
          }, randomSpeed * 1000); // Продолжительность анимации
        }
      }, 100);
    } catch (error) {
      console.error("Failed to open case:", error);
      setIsSpinning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-card border border-border p-6 rounded-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Открытие кейса</h2>
          <Button variant="ghost" onClick={onClose} disabled={isSpinning}>
            ✕
          </Button>
        </div>
        
        <div className="relative overflow-hidden mb-8">
          {/* Только линия без точки */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-primary z-10 transform -translate-x-1/2"></div>
          
          {/* Items reel */}
          <div className="relative h-36 overflow-hidden border border-border rounded-lg">
            <div 
              ref={wheelRef}
              className="flex absolute left-1/2 top-0 bottom-0 items-center transform -translate-x-1/2"
              style={{ 
                width: `${wheelItems.length * 160}px`,
              }}
            >
              {wheelItems.map((item, index) => (
                <div 
                  key={`${item.id}_${index}`} 
                  className={`w-40 h-28 mx-0.5 border-2 rounded flex flex-col items-center justify-center p-2 ${rarityClasses[item.rarity]}`}
                >
                  <img 
                    src={item.image || "https://images.unsplash.com/photo-1608985929455-9e2f3eaed724?q=80&w=200&auto=format&fit=crop"} 
                    alt={item.name} 
                    className="h-16 w-auto object-contain mb-1" 
                  />
                  <div className="text-xs font-medium truncate w-full text-center">{item.name}</div>
                  <div className="text-xs text-case-legendary">{item.price} ₽</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {result ? (
          <div className="text-center mb-6 animate-fade-in">
            <div className="text-xl font-bold mb-2">
              Поздравляем! Вы получили:
            </div>
            <div className={`inline-block p-4 border-2 rounded-lg ${rarityClasses[result.rarity]}`}>
              <img 
                src={result.image || "https://images.unsplash.com/photo-1608985929455-9e2f3eaed724?q=80&w=200&auto=format&fit=crop"} 
                alt={result.name} 
                className="h-32 w-auto object-contain mx-auto mb-2" 
              />
              <div className="text-lg font-medium">{result.name}</div>
              <div className="text-case-legendary font-medium">{result.price} ₽</div>
            </div>
          </div>
        ) : null}
        
        <div className="flex justify-center">
          <Button 
            onClick={spinWheel} 
            disabled={isSpinning}
            className="px-8 py-2"
          >
            {isSpinning ? "Открываем..." : "Крутить"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseWheel;