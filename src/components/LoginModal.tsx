import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        await login(username, password);
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать на CS2 Cases!",
        });
      } else {
        await register(username, password);
        toast({
          title: "Успешная регистрация",
          description: "Ваш аккаунт создан и вы успешно вошли в систему.",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Добро пожаловать</DialogTitle>
          <DialogDescription>
            Войдите или зарегистрируйтесь, чтобы начать открывать кейсы CS2
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="login" className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Выполняется вход..." : "Войти"}
              </Button>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="reg-username">Имя пользователя</Label>
                <Input 
                  id="reg-username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Пароль</Label>
                <Input 
                  id="reg-password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Создание аккаунта..." : "Зарегистрироваться"}
              </Button>
            </TabsContent>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
