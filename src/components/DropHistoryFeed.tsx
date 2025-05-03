import { useState, useEffect } from "react";
import { useAuth, DropHistory } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const rarityClasses = {
  rare: "bg-case-rare/20 border-case-rare",
  epic: "bg-case-epic/20 border-case-epic",
  legendary: "bg-case-legendary/20 border-case-legendary",
  mythical: "bg-case-mythical/20 border-case-mythical",
};

const rarityBadges = {
  rare: "bg-case-rare text-white hover:bg-case-rare/80",
  epic: "bg-case-epic text-white hover:bg-case-epic/80",
  legendary: "bg-case-legendary text-white hover:bg-case-legendary/80",
  mythical: "bg-case-mythical text-white hover:bg-case-mythical/80",
};

// Функция для форматирования времени
const formatTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  // Меньше минуты
  if (diff < 60 * 1000) {
    return "только что";
  }
  
  // Меньше часа
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes} мин. назад`;
  }
  
  // Меньше суток
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours} ч. назад`;
  }
  
  // Более суток
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  return `${days} д. назад`;
};

const DropHistoryFeed = () => {
  const { dropHistory } = useAuth();
  
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold">Последние выпадения</h2>
      </div>
      
      <ScrollArea className="h-[500px]">
        <div className="p-4">
          {dropHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              История выпадений пуста
            </div>
          ) : (
            <div className="space-y-4">
              {dropHistory.map((drop, index) => (
                <div key={`${drop.item.id}_${drop.timestamp}`}>
                  <div className="flex items-start gap-3">
                    {/* Изображение предмета */}
                    <div className={`flex-shrink-0 w-16 h-16 border rounded-md overflow-hidden ${rarityClasses[drop.item.rarity]} flex items-center justify-center p-1`}>
                      <img 
                        src={drop.item.image} 
                        alt={drop.item.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    
                    {/* Информация о выпадении */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium line-clamp-1">{drop.username}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{drop.item.name}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline" className={rarityBadges[drop.item.rarity]}>
                            {drop.item.price} ₽
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(drop.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < dropHistory.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DropHistoryFeed;