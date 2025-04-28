import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface BetHistory {
  id: number;
  multiplier: number;
  amount: number;
  winAmount: number | null;
  timestamp: Date;
  status: "win" | "loss";
}

interface GameHistory {
  id: number;
  multiplier: number;
  timestamp: Date;
}

const Crash = () => {
  const { user, isAuthenticated, updateBalance } = useAuth();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState<string>("100");
  const [autoWithdrawAt, setAutoWithdrawAt] = useState<string>("2");
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [hasCrashed, setHasCrashed] = useState<boolean>(false);
  const [isBetting, setIsBetting] = useState<boolean>(false);
  const [hasWithdrawn, setHasWithdrawn] = useState<boolean>(false);
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const timerRef = useRef<number | null>(null);
  const crashPointRef = useRef<number>(0);
  
  useEffect(() => {
    // Загрузка истории игр при монтировании
    const initialGameHistory: GameHistory[] = [
      { id: 1, multiplier: 1.24, timestamp: new Date(Date.now() - 120000) },
      { id: 2, multiplier: 3.57, timestamp: new Date(Date.now() - 180000) },
      { id: 3, multiplier: 1.92, timestamp: new Date(Date.now() - 240000) },
      { id: 4, multiplier: 1.08, timestamp: new Date(Date.now() - 300000) },
      { id: 5, multiplier: 2.45, timestamp: new Date(Date.now() - 360000) }
    ];
    setGameHistory(initialGameHistory);
    
    // Очистка таймера при размонтировании
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startGame = () => {
    // Генерация случайной точки краша от 1 до 10 с экспоненциальным распределением
    crashPointRef.current = Math.max(1, Math.pow(Math.random() * 0.9 + 0.1, -1) * 0.9);
    
    setIsGameRunning(true);
    setHasCrashed(false);
    setCurrentMultiplier(1);
    setHasWithdrawn(false);
    
    timerRef.current = window.setInterval(() => {
      setCurrentMultiplier(prev => {
        const nextValue = prev + 0.01;
        
        // Проверка на автовывод
        if (isBetting && !hasWithdrawn && parseFloat(autoWithdrawAt) > 0 && nextValue >= parseFloat(autoWithdrawAt)) {
          withdrawBet();
        }
        
        // Проверка на достижение точки краша
        if (nextValue >= crashPointRef.current) {
          clearInterval(timerRef.current!);
          setHasCrashed(true);
          setIsGameRunning(false);
          
          // Если пользователь делал ставку и не вывел деньги
          if (isBetting && !hasWithdrawn) {
            const newBetHistory: BetHistory = {
              id: Date.now(),
              multiplier: nextValue,
              amount: parseFloat(betAmount),
              winAmount: null,
              timestamp: new Date(),
              status: "loss"
            };
            setBetHistory(prev => [newBetHistory, ...prev].slice(0, 10));
            setIsBetting(false);
            
            toast({
              title: "Краш!",
              description: `Множитель: ${nextValue.toFixed(2)}x. Вы потеряли ${betAmount} ₽`,
              variant: "destructive"
            });
          }
          
          // Добавление в историю игр
          const newGameHistory: GameHistory = {
            id: Date.now(),
            multiplier: nextValue,
            timestamp: new Date()
          };
          setGameHistory(prev => [newGameHistory, ...prev].slice(0, 10));
          
          // Автоматический запуск новой игры через 3 секунды
          setTimeout(() => {
            startGame();
          }, 3000);
          
          return nextValue;
        }
        
        return nextValue;
      });
    }, 100);
  };
  
  const placeBet = () => {
    if (!isAuthenticated) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в аккаунт, чтобы делать ставки",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseFloat(betAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму ставки",
        variant: "destructive"
      });
      return;
    }
    
    if (amount > (user?.balance || 0)) {
      toast({
        title: "Недостаточно средств",
        description: "На вашем балансе недостаточно средств для этой ставки",
        variant: "destructive"
      });
      return;
    }
    
    // Списание средств с баланса
    updateBalance(-amount);
    setIsBetting(true);
    
    toast({
      title: "Ставка сделана",
      description: `Вы поставили ${amount} ₽. Множитель автовывода: ${autoWithdrawAt}x`
    });
  };
  
  const withdrawBet = () => {
    if (!isBetting || hasWithdrawn) return;
    
    const amount = parseFloat(betAmount);
    const winAmount = amount * currentMultiplier;
    
    // Добавление средств на баланс
    updateBalance(winAmount);
    setHasWithdrawn(true);
    setIsBetting(false);
    
    // Добавление в историю ставок
    const newBetHistory: BetHistory = {
      id: Date.now(),
      multiplier: currentMultiplier,
      amount: amount,
      winAmount: winAmount,
      timestamp: new Date(),
      status: "win"
    };
    setBetHistory(prev => [newBetHistory, ...prev].slice(0, 10));
    
    toast({
      title: "Успешный вывод!",
      description: `Выиграно: ${winAmount.toFixed(2)} ₽ (${currentMultiplier.toFixed(2)}x)`
    });
  };
  
  useEffect(() => {
    if (!isGameRunning && !hasCrashed) {
      startGame();
    }
  }, [isGameRunning, hasCrashed]);
  
  const getMultiplierColorClass = (multiplier: number) => {
    if (multiplier < 1.5) return "text-yellow-500";
    if (multiplier < 2) return "text-green-500";
    if (multiplier < 3) return "text-blue-500";
    if (multiplier < 5) return "text-purple-500";
    return "text-case-legendary";
  };
  
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-10 text-center">
          <h2 className="text-2xl font-bold mb-4">Войдите в аккаунт</h2>
          <p className="mb-6">Для доступа к режиму Краш необходимо войти в аккаунт</p>
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
                <CardTitle>Crash</CardTitle>
                <CardDescription>
                  Сделайте ставку и вовремя выведите деньги до краха!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-80 bg-black/30 rounded-lg overflow-hidden mb-6">
                  {/* График (упрощенный) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`text-6xl font-bold ${getMultiplierColorClass(currentMultiplier)} ${hasCrashed ? "animate-bounce" : ""}`}>
                      {hasCrashed ? "CRASH!" : `${currentMultiplier.toFixed(2)}x`}
                    </div>
                  </div>
                  
                  {/* Прогресс-бар */}
                  <div className="absolute bottom-0 left-0 right-0">
                    <Progress 
                      value={Math.min((currentMultiplier / 10) * 100, 100)} 
                      className="h-1 bg-gray-800" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm mb-2">Сумма ставки</p>
                    <div className="flex mb-4">
                      <Input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        disabled={isBetting || !isAuthenticated}
                        className="mr-2"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBetAmount("100")}
                        disabled={isBetting}
                      >
                        100
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm mb-2">Автовывод при множителе</p>
                    <div className="flex mb-4">
                      <Input
                        type="number"
                        step="0.1"
                        value={autoWithdrawAt}
                        onChange={(e) => setAutoWithdrawAt(e.target.value)}
                        disabled={isBetting}
                        className="mr-2"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAutoWithdrawAt("2")}
                        disabled={isBetting}
                      >
                        2x
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  onClick={placeBet}
                  disabled={isBetting || !isGameRunning || hasCrashed || !isAuthenticated}
                  className="w-full md:w-auto mr-2"
                >
                  Поставить
                </Button>
                <Button
                  onClick={withdrawBet}
                  disabled={!isBetting || hasWithdrawn || hasCrashed}
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                >
                  Вывести ({(parseFloat(betAmount) * currentMultiplier).toFixed(2)} ₽)
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:w-1/3">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>История игр</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {gameHistory.map(game => (
                    <div key={game.id} className="flex justify-between items-center border-b border-border/50 pb-2">
                      <span className="text-sm">
                        {new Date(game.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`font-bold ${getMultiplierColorClass(game.multiplier)}`}>
                        {game.multiplier.toFixed(2)}x
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ваши ставки</CardTitle>
              </CardHeader>
              <CardContent>
                {betHistory.length > 0 ? (
                  <div className="space-y-3">
                    {betHistory.map(bet => (
                      <div key={bet.id} className="border-b border-border/50 pb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">
                            {new Date(bet.timestamp).toLocaleTimeString()}
                          </span>
                          <span className={`font-bold ${bet.status === "win" ? "text-green-500" : "text-red-500"}`}>
                            {bet.status === "win" ? "Выигрыш" : "Проигрыш"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Ставка: {bet.amount} ₽</span>
                          <span className={`font-bold ${getMultiplierColorClass(bet.multiplier)}`}>
                            {bet.multiplier.toFixed(2)}x
                          </span>
                        </div>
                        {bet.status === "win" && (
                          <div className="text-right text-sm text-green-500">
                            Выигрыш: {bet.winAmount?.toFixed(2)} ₽
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    История ставок пуста
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Crash;
