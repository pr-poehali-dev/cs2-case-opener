import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

interface Ticket {
  id: string;
  title: string;
  category: string;
  status: "open" | "closed";
  date: Date;
  messages: {
    id: string;
    text: string;
    sender: "user" | "support";
    date: Date;
  }[];
}

const Support = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");

  const handleSubmitTicket = () => {
    if (!subject.trim() || !category || !message.trim()) {
      toast({
        title: "Ошибка при отправке",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      title: subject,
      category,
      status: "open",
      date: new Date(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          text: message,
          sender: "user",
          date: new Date(),
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    setSubject("");
    setCategory("");
    setMessage("");

    toast({
      title: "Обращение отправлено",
      description: "Наши специалисты ответят вам в ближайшее время",
    });

    // Имитация ответа от поддержки через 3 секунды
    setTimeout(() => {
      const updatedTickets = [...tickets, newTicket];
      const ticketIndex = updatedTickets.findIndex((t) => t.id === newTicket.id);
      
      if (ticketIndex !== -1) {
        const supportMessage = {
          id: `msg-${Date.now()}`,
          text: "Здравствуйте! Благодарим за обращение. Ваш запрос принят в обработку. Мы ответим вам в ближайшее время.",
          sender: "support",
          date: new Date(),
        };
        
        updatedTickets[ticketIndex].messages.push(supportMessage);
        setTickets(updatedTickets);
      }
    }, 3000);
  };

  const handleSendReply = () => {
    if (!activeTicket || !reply.trim()) return;

    const updatedTickets = [...tickets];
    const ticketIndex = updatedTickets.findIndex((t) => t.id === activeTicket.id);
    
    if (ticketIndex !== -1) {
      const userMessage = {
        id: `msg-${Date.now()}`,
        text: reply,
        sender: "user",
        date: new Date(),
      };
      
      updatedTickets[ticketIndex].messages.push(userMessage);
      
      // Обновляем активный тикет
      setActiveTicket(updatedTickets[ticketIndex]);
      setTickets(updatedTickets);
      setReply("");
      
      toast({
        title: "Сообщение отправлено",
        description: "Ваш ответ добавлен в обращение",
      });
      
      // Имитация ответа от поддержки через 3 секунды
      setTimeout(() => {
        const updatedTicketsAfterReply = [...updatedTickets];
        const supportMessage = {
          id: `msg-${Date.now()}`,
          text: "Спасибо за дополнительную информацию! Мы обрабатываем ваш запрос.",
          sender: "support",
          date: new Date(),
        };
        
        updatedTicketsAfterReply[ticketIndex].messages.push(supportMessage);
        setTickets(updatedTicketsAfterReply);
        setActiveTicket(updatedTicketsAfterReply[ticketIndex]);
      }, 3000);
    }
  };

  const handleCloseTicket = (ticketId: string) => {
    const updatedTickets = tickets.map((ticket) => 
      ticket.id === ticketId ? { ...ticket, status: "closed" as const } : ticket
    );
    
    setTickets(updatedTickets);
    
    if (activeTicket && activeTicket.id === ticketId) {
      const updatedActiveTicket = updatedTickets.find((t) => t.id === ticketId);
      setActiveTicket(updatedActiveTicket as Ticket);
    }
    
    toast({
      title: "Обращение закрыто",
      description: "Вы всегда можете создать новое обращение при необходимости",
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Техническая поддержка</h1>
          <p className="text-muted-foreground">
            Если у вас возникли вопросы или проблемы, наша команда поддержки всегда готова помочь
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="new-ticket">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="new-ticket" className="flex-1">Новое обращение</TabsTrigger>
                <TabsTrigger value="my-tickets" className="flex-1">Мои обращения ({tickets.length})</TabsTrigger>
                <TabsTrigger value="faq" className="flex-1">FAQ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="new-ticket">
                <Card>
                  <CardHeader>
                    <CardTitle>Создать обращение</CardTitle>
                    <CardDescription>
                      Опишите вашу проблему или вопрос, и мы ответим как можно скорее
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">
                        Тема обращения
                      </label>
                      <Input
                        id="subject"
                        placeholder="Кратко опишите вашу проблему"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium mb-1">
                        Категория
                      </label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Технические проблемы</SelectItem>
                          <SelectItem value="payment">Оплата и вывод средств</SelectItem>
                          <SelectItem value="account">Аккаунт и безопасность</SelectItem>
                          <SelectItem value="cases">Кейсы и дропы</SelectItem>
                          <SelectItem value="other">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">
                        Сообщение
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Подробно опишите вашу проблему или вопрос"
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSubmitTicket} disabled={!isAuthenticated}>
                      Отправить
                    </Button>
                    {!isAuthenticated && (
                      <p className="ml-4 text-sm text-red-500">
                        Необходимо войти в аккаунт, чтобы отправить обращение
                      </p>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="my-tickets">
                {tickets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="font-medium">Мои обращения</h3>
                      {tickets.map((ticket) => (
                        <Card 
                          key={ticket.id} 
                          className={`cursor-pointer transition ${activeTicket?.id === ticket.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => setActiveTicket(ticket)}
                        >
                          <CardHeader className="py-3">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{ticket.title}</CardTitle>
                              <span className={`text-xs px-2 py-1 rounded-full ${ticket.status === 'open' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                                {ticket.status === 'open' ? 'Открыт' : 'Закрыт'}
                              </span>
                            </div>
                            <CardDescription className="text-xs">
                              {new Date(ticket.date).toLocaleString()} • {
                                ticket.category === 'technical' ? 'Технические проблемы' :
                                ticket.category === 'payment' ? 'Оплата и вывод средств' :
                                ticket.category === 'account' ? 'Аккаунт и безопасность' :
                                ticket.category === 'cases' ? 'Кейсы и дропы' : 'Другое'
                              }
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                    
                    {activeTicket && (
                      <div>
                        <Card>
                          <CardHeader className="py-3 border-b">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">{activeTicket.title}</CardTitle>
                              {activeTicket.status === 'open' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleCloseTicket(activeTicket.id)}
                                >
                                  Закрыть обращение
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 max-h-[400px] overflow-y-auto">
                            <div className="space-y-4">
                              {activeTicket.messages.map((msg) => (
                                <div 
                                  key={msg.id} 
                                  className={`p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary/10 ml-6' : 'bg-secondary/10 mr-6'}`}
                                >
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-sm">
                                      {msg.sender === 'user' ? 'Вы' : 'Поддержка'}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(msg.date).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                          {activeTicket.status === 'open' && (
                            <CardFooter className="border-t p-4">
                              <div className="w-full space-y-2">
                                <Textarea
                                  placeholder="Введите ваш ответ..."
                                  value={reply}
                                  onChange={(e) => setReply(e.target.value)}
                                />
                                <Button onClick={handleSendReply} disabled={!reply.trim()}>
                                  Отправить
                                </Button>
                              </div>
                            </CardFooter>
                          )}
                        </Card>
                      </div>
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground mb-4">У вас пока нет обращений в техническую поддержку</p>
                      <Button onClick={() => document.querySelector('[data-value="new-ticket"]')?.click()}>
                        Создать обращение
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle>Часто задаваемые вопросы</CardTitle>
                    <CardDescription>
                      Ответы на самые распространенные вопросы пользователей
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Как пополнить баланс?</AccordionTrigger>
                        <AccordionContent>
                          Для пополнения баланса авторизуйтесь на сайте, затем нажмите на кнопку "Пополнить" в верхней части экрана. 
                          Выберите удобный способ оплаты и следуйте инструкциям платежной системы.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Как вывести выигранные предметы?</AccordionTrigger>
                        <AccordionContent>
                          Все выигранные предметы находятся в вашем инвентаре. Перейдите в раздел "Инвентарь", 
                          выберите нужные предметы и нажмите "Продать", чтобы получить их стоимость на баланс сайта.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Что такое режим "Апгрейд"?</AccordionTrigger>
                        <AccordionContent>
                          Режим "Апгрейд" позволяет обменять предметы из вашего инвентаря на более ценные. 
                          Чем ниже шанс успешного апгрейда, тем дороже будет предмет в случае выигрыша.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-4">
                        <AccordionTrigger>Как работают контракты?</AccordionTrigger>
                        <AccordionContent>
                          Контракты позволяют обменять несколько предметов на один более ценный. 
                          Выберите предметы из своего инвентаря, добавьте их в контракт и получите новый предмет, 
                          стоимость которого зависит от стоимости вложенных предметов.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-5">
                        <AccordionTrigger>Почему я не могу открыть кейс?</AccordionTrigger>
                        <AccordionContent>
                          Для открытия кейса необходимо иметь достаточно средств на балансе и быть авторизованным на сайте. 
                          Если у вас возникают проблемы с открытием кейсов, убедитесь, что ваш баланс достаточен, 
                          а браузер поддерживает все необходимые технологии.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-6">
                        <AccordionTrigger>Какие шансы выпадения редких предметов?</AccordionTrigger>
                        <AccordionContent>
                          Шансы выпадения предметов различной редкости указаны на странице каждого кейса. 
                          Наиболее редкие предметы (legendary, mythical) имеют самые низкие шансы выпадения, 
                          но при этом являются самыми ценными.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Поддержка</h3>
                  <p className="text-sm text-muted-foreground">
                    Среднее время ответа: 15 минут
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-sm">
                    <a href="mailto:support@cs2cases.ru" className="text-primary hover:underline">
                      support@cs2cases.ru
                    </a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Социальные сети</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Telegram
                    </Button>
                    <Button variant="outline" size="sm">
                      Discord
                    </Button>
                    <Button variant="outline" size="sm">
                      VK
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Время работы</h3>
                  <p className="text-sm text-muted-foreground">
                    Ежедневно, 24/7
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;
