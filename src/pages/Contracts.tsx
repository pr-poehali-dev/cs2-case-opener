import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface ContractItem {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: string;
}

const Contracts = () => {
  const { user, isAuthenticated, updateBalance, addToInventory } = useAuth();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<ContractItem[]>([]);
  const [result, setResult] = useState<ContractItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  // Примеры скинов для контрактов
  const userItems = user?.inventory || [];

  const addToContract = (item: ContractItem) => {
    if (selectedItems.length < 10) {
      // Проверка, был ли предмет уже добавлен
      if (selectedItemIds.has(item.id)) {
        toast({
          title: "Предмет уже добавлен",
          description: "Этот предмет уже добавлен в контракт",
          variant: "destructive",
        });
        return;
      }
      
      // Добавляем предмет и обновляем множество выбранных ID
      setSelectedItems([...selectedItems, item]);
      setSelectedItemIds(new Set([...selectedItemIds, item.id]));
    } else {
      toast({
        title: "Достигнут лимит",
        description: "Вы можете добавить максимум 10 предметов в контракт",
        variant: "destructive",
      });
    }
  };

  const removeFromContract = (index: number) => {
    const itemToRemove = selectedItems[index];
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
    
    // Обновляем множество выбранных ID
    const newSelectedIds = new Set(selectedItemIds);
    newSelectedIds.delete(itemToRemove.id);
    setSelectedItemIds(newSelectedIds);
  };

  const executeContract = () => {
    if (selectedItems.length < 3) {
      toast({
        title: "Недостаточно предметов",
        description: "Добавьте минимум 3 предмета для выполнения контракта",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Расчет стоимости результата (средняя стоимость предметов + 10%)
    const totalValue = selectedItems.reduce((sum, item) => sum + item.price, 0);
    const resultValue = (totalValue / selectedItems.length) * 1.1;

    // Имитация получения предмета из контракта
    setTimeout(() => {
      const resultItem: ContractItem = {
        id: `result-${Date.now()}`,
        name: `${getRandomWeapon()} | ${getRandomSkin()}`,
        image: `https://source.unsplash.com/random/300x200?weapon&${Date.now()}`,
        price: Math.round(resultValue),
        rarity: getRarityFromPrice(resultValue),
      };

      setResult(resultItem);
      setIsProcessing(false);

      // Добавление предмета в инвентарь
      addToInventory(resultItem);

      // Очистка выбранных предметов
      setSelectedItems([]);
      setSelectedItemIds(new Set());

      toast({
        title: "Контракт выполнен!",
        description: `Вы получили: ${resultItem.name} (${resultItem.price} ₽)`,
      });
    }, 2000);
  };

  const getRandomWeapon = () => {
    const weapons = ["AK-47", "M4A4", "AWP", "Desert Eagle", "USP-S", "Glock-18"];
    return weapons[Math.floor(Math.random() * weapons.length)];
  };

  const getRandomSkin = () => {
    const skins = ["Азимов", "Вулкан", "Неонуар", "Гипербист", "Ржавый кейс", "Кибербезопасность"];
    return skins[Math.floor(Math.random() * skins.length)];
  };

  const getRarityFromPrice = (price: number) => {
    if (price > 5000) return "legendary";
    if (price > 2000) return "mythical";
    if (price > 1000) return "rare";
    if (price > 500) return "uncommon";
    return "common";
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-10 text-center">
          <h2 className="text-2xl font-bold mb-4">Войдите в аккаунт</h2>
          <p className="mb-6">Для доступа к контрактам необходимо войти в аккаунт</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Контракты</CardTitle>
                <CardDescription>
                  Обменяйте несколько предметов на один предмет более высокого качества
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="inventory">
                  <TabsList className="mb-4">
                    <TabsTrigger value="inventory">Ваш инвентарь</TabsTrigger>
                    <TabsTrigger value="contract">
                      Контракт 
                      <Badge variant="outline" className="ml-2">
                        {selectedItems.length}/10
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="inventory">
                    {userItems.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {userItems.map((item) => (
                          <div 
                            key={item.id} 
                            className={`relative cursor-pointer border rounded-md overflow-hidden ${
                              selectedItemIds.has(item.id) ? "opacity-50" : ""
                            }`}
                            onClick={() => addToContract(item)}
                          >
                            <img src={item.image} alt={item.name} className="w-full aspect-square object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                              <p className="text-xs truncate">{item.name}</p>
                              <p className={`text-xs font-bold text-case-${item.rarity}`}>{item.price} ₽</p>
                            </div>
                            {selectedItemIds.has(item.id) && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <span className="text-white bg-green-600 p-1 rounded-full text-xs">✓</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <p>У вас нет предметов в инвентаре</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="contract">
                    {selectedItems.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {selectedItems.map((item, index) => (
                          <div 
                            key={index} 
                            className="relative border rounded-md overflow-hidden"
                          >
                            <img src={item.image} alt={item.name} className="w-full aspect-square object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                              <p className="text-xs truncate">{item.name}</p>
                              <p className={`text-xs font-bold text-case-${item.rarity}`}>{item.price} ₽</p>
                            </div>
                            <button 
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                              onClick={() => removeFromContract(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <p>Добавьте предметы из инвентаря</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={executeContract} 
                  disabled={selectedItems.length < 3 || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Обработка..." : "Выполнить контракт"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Информация о контракте</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="mb-2 font-medium">Выбрано предметов: {selectedItems.length}/10</p>
                  {selectedItems.length > 0 && (
                    <p className="mb-2">
                      Общая стоимость: {selectedItems.reduce((sum, item) => sum + item.price, 0)} ₽
                    </p>
                  )}
                </div>
                
                {result && (
                  <div className="border rounded-md overflow-hidden">
                    <div className="text-center mb-2 font-bold">Результат контракта:</div>
                    <img src={result.image} alt={result.name} className="w-full aspect-square object-cover" />
                    <div className="bg-black/70 p-3">
                      <p className="text-sm mb-1">{result.name}</p>
                      <p className={`font-bold text-case-${result.rarity}`}>{result.price} ₽</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contracts;
