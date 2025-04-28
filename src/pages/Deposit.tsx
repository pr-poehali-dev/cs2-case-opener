import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Wallet, Gift, Banknote, User, Copy } from "lucide-react";

interface PromoCode {
  code: string;
  discount: number;
  isUsed: boolean;
}

const Deposit = () => {
  const { user, isAuthenticated, updateBalance } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("1000");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [promoCode, setPromoCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Пример промокодов (в реальном приложении должны храниться на сервере)
  const [promoCodes] = useState<PromoCode[]>([
    { code: "WELCOME", discount: 5, isUsed: false },
    { code: "CS2BONUS", discount: 10, isUsed: false },
    { code: "EXTRA20", discount: 20, isUsed: false },
  ]);

  const handleAmountPreset = (value: string) => {
    setAmount(value);
  };

  const handleProcessPayment = () => {
    if (!isAuthenticated) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в аккаунт для пополнения баланса",
        variant: "destructive",
      });
      return;
    }

    const amountValue = parseInt(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите корректную сумму пополнения",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Имитация процесса оплаты
    setTimeout(() => {
      // Применение промокода если он валиден
      const validPromo = promoCodes.find(
        (p) => p.code.toLowerCase() === promoCode.toLowerCase() && !p.isUsed
      );
      
      let finalAmount = amountValue;
      let bonusMessage = "";
      
      if (validPromo) {
        const bonusAmount = Math.floor((amountValue * validPromo.discount) / 100);
        finalAmount += bonusAmount;
        bonusMessage = ` + бонус ${bonusAmount} ₽ (${validPromo.discount}%)`;
        
        // Отметка промокода как использованного
        // В реальном приложении это должно быть на сервере
        validPromo.isUsed = true;
      }

      // Обновление баланса пользователя
      updateBalance(finalAmount);
      
      setIsProcessing(false);
      setPromoCode("");
      
      toast({
        title: "Баланс пополнен!",
        description: `На ваш счет зачислено ${amountValue} ₽${bonusMessage}`,
      });
    }, 2000);
  };

  const handleApplyPromoCode = () => {
    if (!promoCode) return;
    
    const validPromo = promoCodes.find(
      (p) => p.code.toLowerCase() === promoCode.toLowerCase() && !p.isUsed
    );
    
    if (validPromo) {
      toast({
        title: "Промокод применен",
        description: `Вы получите +${validPromo.discount}% к пополнению`,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Промокод недействителен или уже использован",
        variant: "destructive",
      });
    }
  };
  
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-10 text-center">
          <h2 className="text-2xl font-bold mb-4">Войдите в аккаунт</h2>
          <p className="mb-6">Для доступа к пополнению баланса необходимо войти в аккаунт</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Пополнение баланса</h1>
          <p className="text-muted-foreground">
            Пополните баланс, чтобы открывать кейсы и участвовать в других активностях
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>Способы пополнения</CardTitle>
                <CardDescription>
                  Выберите удобный способ оплаты и сумму пополнения
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">Все способы</TabsTrigger>
                    <TabsTrigger value="cards">Банковские карты</TabsTrigger>
                    <TabsTrigger value="crypto">Криптовалюты</TabsTrigger>
                    <TabsTrigger value="other">Другие способы</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Введите сумму</h3>
                      <div className="flex flex-col space-y-4">
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="text-lg py-6"
                          placeholder="Введите сумму"
                        />
                        
                        <div className="grid grid-cols-4 gap-2">
                          <Button variant="outline" onClick={() => handleAmountPreset("500")}>
                            500 ₽
                          </Button>
                          <Button variant="outline" onClick={() => handleAmountPreset("1000")}>
                            1 000 ₽
                          </Button>
                          <Button variant="outline" onClick={() => handleAmountPreset("2000")}>
                            2 000 ₽
                          </Button>
                          <Button variant="outline" onClick={() => handleAmountPreset("5000")}>
                            5 000 ₽
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Выберите способ оплаты</h3>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center cursor-pointer">
                            <CreditCard className="h-5 w-5 mr-2" />
                            Банковская карта
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition">
                          <RadioGroupItem value="crypto" id="crypto" />
                          <Label htmlFor="crypto" className="flex items-center cursor-pointer">
                            <Wallet className="h-5 w-5 mr-2" />
                            Криптовалюта
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition">
                          <RadioGroupItem value="qiwi" id="qiwi" />
                          <Label htmlFor="qiwi" className="flex items-center cursor-pointer">
                            <Banknote className="h-5 w-5 mr-2" />
                            QIWI
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition">
                          <RadioGroupItem value="yoomoney" id="yoomoney" />
                          <Label htmlFor="yoomoney" className="flex items-center cursor-pointer">
                            <User className="h-5 w-5 mr-2" />
                            ЮMoney
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Промокод</h3>
                      <div className="flex space-x-2">
                        <Input
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Введите промокод"
                        />
                        <Button variant="outline" onClick={handleApplyPromoCode}>
                          Применить
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="cards" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Банковская карта</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="card-number">Номер карты</Label>
                          <Input id="card-number" placeholder="0000 0000 0000 0000" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="card-expiry">Срок действия</Label>
                            <Input id="card-expiry" placeholder="MM/YY" />
                          </div>
                          <div>
                            <Label htmlFor="card-cvv">CVV</Label>
                            <Input id="card-cvv" placeholder="123" type="password" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="crypto" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Оплата криптовалютой</h3>
                      <div className="border rounded-md p-6 text-center">
                        <div className="mb-4 flex justify-center">
                          <div className="bg-white p-4 rounded-md inline-block">
                            {/* Здесь был бы QR-код */}
                            <div className="w-40 h-40 bg-gray-200 flex items-center justify-center">
                              QR Code
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Адрес BTC:</p>
                          <div className="flex items-center justify-center">
                            <code className="bg-muted p-2 rounded text-xs mr-2">
                              1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
                            </code>
                            <Button variant="ghost" size="icon">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          После оплаты средства поступят на ваш баланс автоматически
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="other" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">QIWI</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Быстрый способ пополнения через QIWI кошелек
                          </p>
                          <Button variant="outline" className="w-full">
                            Выбрать
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">ЮMoney</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Пополнение с помощью ЮMoney (бывший Яндекс.Деньги)
                          </p>
                          <Button variant="outline" className="w-full">
                            Выбрать
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">СБП</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Система быстрых платежей - мгновенное пополнение
                          </p>
                          <Button variant="outline" className="w-full">
                            Выбрать
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">WebMoney</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Пополнение с помощью кошелька WebMoney
                          </p>
                          <Button variant="outline" className="w-full">
                            Выбрать
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Обработка..." : `Пополнить на ${amount} ₽`}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:w-1/3">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Ваш текущий баланс</p>
                  <p className="text-2xl font-bold">{user?.balance} ₽</p>
                </div>
                
                <div>
                  <p className="font-medium">После пополнения</p>
                  <p className="text-2xl font-bold text-green-500">
                    {(user?.balance || 0) + (parseInt(amount) || 0)} ₽
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Бонусы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-start mb-2">
                    <Gift className="h-5 w-5 mr-2 text-primary" />
                    <p className="font-medium">+10% при первом пополнении</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Бонус автоматически применяется при первом пополнении баланса
                  </p>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <p className="font-medium mb-2">Ежедневные задания</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Выполняйте ежедневные задания и получайте бонусы к балансу
                  </p>
                  <Button variant="outline" className="w-full">
                    Перейти к заданиям
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Deposit;
