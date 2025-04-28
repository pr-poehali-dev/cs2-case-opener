import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import CaseWheel from "@/components/CaseWheel";
import cases from "@/data/cases";
import { CaseItem } from "@/components/CaseCard";

const rarityClasses = {
  rare: "bg-case-rare/20 border-case-rare",
  epic: "bg-case-epic/20 border-case-epic",
  legendary: "bg-case-legendary/20 border-case-legendary",
  mythical: "bg-case-mythical/20 border-case-mythical",
};

const CaseView = () => {
  const { id } = useParams<{ id: string }>();
  const [isOpening, setIsOpening] = useState(false);
  const caseData = cases.find((c) => c.id === id);

  if (!caseData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Кейс не найден</h1>
            <Link to="/">
              <Button>Вернуться на главную</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const openCase = async (): Promise<CaseItem> => {
    // Simulate API call with random outcome from case items
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * caseData.items.length);
        resolve(caseData.items[randomIndex]);
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar balance={1000} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Назад к кейсам
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Case info */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h1 className="text-2xl font-bold mb-2">{caseData.name}</h1>
              <div className="text-muted-foreground mb-6">
                {caseData.items.length} предметов
              </div>
              
              <div className="relative h-64 flex items-center justify-center mb-6">
                <img
                  src={caseData.image}
                  alt={caseData.name}
                  className="max-h-full object-contain"
                />
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm">Стоимость открытия:</div>
                <div className="text-case-legendary font-medium text-lg">
                  {caseData.price} ₽
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => setIsOpening(true)}
              >
                Открыть кейс
              </Button>
            </div>
          </div>
          
          {/* Items list */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Содержимое кейса</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseData.items.map((item) => (
                <div 
                  key={item.id} 
                  className={`border-2 rounded-lg overflow-hidden ${rarityClasses[item.rarity]}`}
                >
                  <div className="p-4">
                    <div className="h-40 flex items-center justify-center mb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full object-contain"
                      />
                    </div>
                    <div className="text-base font-medium mb-1 line-clamp-1">
                      {item.name}
                    </div>
                    <div className="text-case-legendary font-medium">
                      {item.price} ₽
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {isOpening && (
        <CaseWheel
          items={caseData.items}
          onOpenCase={openCase}
          onClose={() => setIsOpening(false)}
        />
      )}
    </div>
  );
};

export default CaseView;