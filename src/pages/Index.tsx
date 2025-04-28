import Navbar from "@/components/Navbar";
import CaseCard from "@/components/CaseCard";
import { Button } from "@/components/ui/button";
import cases from "@/data/cases";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar balance={1000} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="text-center mb-12 py-12">
          <h1 className="text-4xl font-bold mb-4">
            Открывай кейсы CS2, получай скины
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Самые популярные кейсы, максимальные шансы на дроп редких скинов и честная система выпадения предметов
          </p>
          <Button size="lg" className="px-8">
            Начать открывать
          </Button>
        </div>
        
        {/* Cases grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cases.map((caseItem) => (
            <CaseCard
              key={caseItem.id}
              id={caseItem.id}
              name={caseItem.name}
              image={caseItem.image}
              price={caseItem.price}
              rarity={caseItem.rarity}
              items={caseItem.items}
            />
          ))}
        </div>
        
        {/* Features section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border/50 p-6 rounded-lg text-center">
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-xl font-medium mb-2">Режим Апгрейд</h3>
            <p className="text-muted-foreground">
              Улучшай свои скины до более ценных с шансом на редкие предметы
            </p>
          </div>
          
          <div className="bg-card border border-border/50 p-6 rounded-lg text-center">
            <div className="text-4xl mb-3">📑</div>
            <h3 className="text-xl font-medium mb-2">Контракты обмена</h3>
            <p className="text-muted-foreground">
              Обменивай несколько предметов на один более высокого качества
            </p>
          </div>
          
          <div className="bg-card border border-border/50 p-6 rounded-lg text-center">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-xl font-medium mb-2">Режим Краш</h3>
            <p className="text-muted-foreground">
              Рискни своими скинами и получи шанс умножить их стоимость
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-card/50 border-t border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="text-xl font-bold bg-gradient-to-r from-primary to-case-mythical bg-clip-text text-transparent">
                CS2 CASES
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                © 2025 CS2 Cases. Все права защищены.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm">Пользовательское соглашение</Button>
              <Button variant="ghost" size="sm">Политика конфиденциальности</Button>
              <Button variant="ghost" size="sm">Тех. поддержка</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;