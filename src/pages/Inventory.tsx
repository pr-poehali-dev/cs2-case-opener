import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import LoginModal from "@/components/LoginModal";
import { Trash2 } from "lucide-react";

const rarityClasses = {
  rare: "bg-case-rare/20 border-case-rare",
  epic: "bg-case-epic/20 border-case-epic",
  legendary: "bg-case-legendary/20 border-case-legendary",
  mythical: "bg-case-mythical/20 border-case-mythical",
};

const Inventory = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [isSellAllDialogOpen, setIsSellAllDialogOpen] = useState(false);
  const { isAuthenticated, user, updateBalance, removeFromInventory, clearInventory } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Если пользователь не авторизован, отображаем сообщение и кнопку входа
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6 bg-card border border-border rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Доступ ограничен</h1>
            <p className="text-muted-foreground mb-6">
              Для просмотра инвентаря необходимо войти в аккаунт.
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

  const handleSellItem = () => {
    if (selectedItem) {
      // Добавляем стоимость предмета к балансу пользователя
      updateBalance(selectedItem.price);
      
      // Удаляем предмет из инвентаря
      removeFromInventory(selectedItem.id);
      
      toast({
        title: "Предмет продан",
        description: `${selectedItem.name} был продан за ${selectedItem.price} ₽`,
      });
      
      setIsSellDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleSellAllItems = () => {
    if (user?.inventory && user.inventory.length > 0) {
      // Подсчитываем общую стоимость
      const totalValue = calculateTotalValue();
      
      // Добавляем общую стоимость к балансу пользователя
      updateBalance(totalValue);
      
      // Очищаем весь инвентарь
      clearInventory();
      
      toast({
        title: "Все предметы проданы",
        description: `Вы продали ${user.inventory.length} предметов за ${totalValue} ₽`,
      });
      
      setIsSellAllDialogOpen(false);
    }
  };

  const calculateTotalValue = () => {
    if (user?.inventory && user.inventory.length > 0) {
      return user.inventory.reduce((sum, item) => sum + item.price, 0);
    }
    return 0;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Ваш инвентарь</h1>
          
          {user?.inventory && user.inventory.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={() => setIsSellAllDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Продать всё ({calculateTotalValue()} ₽)
            </Button>
          )}
        </div>
        
        {user?.inventory.length === 0 ? (
          <div className="text-center p-12 bg-card border border-border rounded-lg">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-2xl font-medium mb-2">Ваш инвентарь пуст</h2>
            <p className="text-muted-foreground mb-6">
              Откройте кейсы, чтобы получить предметы
            </p>
            <Button onClick={() => navigate("/")}>
              Открыть кейсы
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {user?.inventory.map((item) => (
              <div 
                key={item.id} 
                className={`border-2 rounded-lg overflow-hidden ${rarityClasses[item.rarity]} hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => {
                  setSelectedItem(item);
                  setIsSellDialogOpen(true);
                }}
              >
                <div className="p-4">
                  <div className="h-48 flex items-center justify-center mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div className="text-base font-medium mb-1 line-clamp-1">
                    {item.name}
                  </div>
                  <div className="text-case-legendary font-medium mb-4">
                    {item.price} ₽
                  </div>
                  <Button variant="outline" className="w-full">
                    Продать
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Диалог подтверждения продажи одного предмета */}
      <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Продать предмет</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите продать этот предмет?
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="flex flex-col items-center py-4">
              <div className={`border-2 rounded-lg p-4 ${rarityClasses[selectedItem.rarity]}`}>
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="h-32 w-auto object-contain mx-auto mb-2"
                />
                <div className="text-center">
                  <div className="font-medium">{selectedItem.name}</div>
                  <div className="text-case-legendary font-bold">{selectedItem.price} ₽</div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSellDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSellItem}>
              Продать за {selectedItem?.price} ₽
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения продажи всех предметов */}
      <Dialog open={isSellAllDialogOpen} onOpenChange={setIsSellAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Продать все предметы</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите продать все предметы из инвентаря? 
              Вы получите {calculateTotalValue()} ₽ на баланс.
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSellAllDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleSellAllItems}>
              Продать все предметы ({user?.inventory.length} шт.)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;