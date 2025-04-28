import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export type CaseRarity = "rare" | "epic" | "legendary" | "mythical";

export interface CaseItem {
  id: string;
  name: string;
  image: string;
  rarity: CaseRarity;
  price: number;
}

export interface CaseProps {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: CaseRarity;
  items: CaseItem[];
}

const rarityClasses = {
  rare: "from-case-rare/50 to-case-rare/10 shadow-[0_0_15px_rgba(70,70,255,0.3)]",
  epic: "from-case-epic/50 to-case-epic/10 shadow-[0_0_15px_rgba(180,70,255,0.3)]",
  legendary: "from-case-legendary/50 to-case-legendary/10 shadow-[0_0_15px_rgba(255,180,70,0.3)]",
  mythical: "from-case-mythical/50 to-case-mythical/10 shadow-[0_0_15px_rgba(255,70,70,0.3)]",
};

const rarityBorderClasses = {
  rare: "border-case-rare/50",
  epic: "border-case-epic/50",
  legendary: "border-case-legendary/50",
  mythical: "border-case-mythical/50",
};

const CaseCard = ({ id, name, image, price, rarity, items }: CaseProps) => {
  return (
    <div 
      className={`group relative rounded-lg border border-border/50 overflow-hidden transition-all duration-300 
      ${rarityBorderClasses[rarity]} hover:scale-105 bg-gradient-to-b ${rarityClasses[rarity]}`}
    >
      <div className="p-4">
        <div className="text-lg font-semibold mb-1">{name}</div>
        <div className="text-sm text-foreground/70 mb-3">
          {items.length} предметов
        </div>
        
        <div className="relative h-48 flex items-center justify-center">
          <img
            src={image || "https://images.unsplash.com/photo-1608985929455-9e2f3eaed724?q=80&w=400&auto=format&fit=crop"}
            alt={name}
            className="max-h-full object-contain transform transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-case-legendary font-medium">
            {price} ₽
          </div>
          <Link to={`/case/${id}`}>
            <Button size="sm">
              Открыть
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaseCard;