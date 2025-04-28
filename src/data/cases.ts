import { CaseProps } from "@/components/CaseCard";

export const cases: CaseProps[] = [
  {
    id: "case-1",
    name: "Кейс Прайм",
    image: "https://images.unsplash.com/photo-1608985929455-9e2f3eaed724?q=80&w=400&auto=format&fit=crop",
    price: 199,
    rarity: "rare",
    items: [
      {
        id: "item-1",
        name: "AK-47 | Легион Анубиса",
        image: "https://images.unsplash.com/photo-1619517918653-628f9ac21b6b?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 350
      },
      {
        id: "item-2",
        name: "M4A4 | Кибербезопасность",
        image: "https://images.unsplash.com/photo-1613824320065-1e4cd358a620?q=80&w=400&auto=format&fit=crop",
        rarity: "epic",
        price: 720
      },
      {
        id: "item-3",
        name: "Desert Eagle | Океанский драйв",
        image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 210
      },
    ]
  },
  {
    id: "case-2",
    name: "Хрома Кейс",
    image: "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?q=80&w=400&auto=format&fit=crop",
    price: 299,
    rarity: "epic",
    items: [
      {
        id: "item-4",
        name: "AWP | Неонуар",
        image: "https://images.unsplash.com/photo-1585675218474-b4f96ed5de79?q=80&w=400&auto=format&fit=crop",
        rarity: "legendary",
        price: 1450
      },
      {
        id: "item-5",
        name: "USP-S | Киллджой",
        image: "https://images.unsplash.com/photo-1621375165294-3835605beeda?q=80&w=400&auto=format&fit=crop",
        rarity: "epic",
        price: 540
      },
      {
        id: "item-6",
        name: "Glock-18 | Вода",
        image: "https://images.unsplash.com/photo-1611372186581-6ccfddd2d22b?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 180
      },
    ]
  },
  {
    id: "case-3",
    name: "Кейс Спектр",
    image: "https://images.unsplash.com/photo-1616709606458-02860d6b92b9?q=80&w=400&auto=format&fit=crop",
    price: 499,
    rarity: "legendary",
    items: [
      {
        id: "item-7",
        name: "Нож бабочка | Градиент",
        image: "https://images.unsplash.com/photo-1620229098568-46934b8992a1?q=80&w=400&auto=format&fit=crop",
        rarity: "mythical",
        price: 12500
      },
      {
        id: "item-8",
        name: "AK-47 | Неон",
        image: "https://images.unsplash.com/photo-1623008744246-7471cc1b7242?q=80&w=400&auto=format&fit=crop",
        rarity: "legendary",
        price: 2200
      },
      {
        id: "item-9",
        name: "M4A1-S | Спектр",
        image: "https://images.unsplash.com/photo-1628353146956-cb0a4af7c4b6?q=80&w=400&auto=format&fit=crop",
        rarity: "epic",
        price: 890
      },
    ]
  },
  {
    id: "case-4",
    name: "Кейс Опасная Зона",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=400&auto=format&fit=crop",
    price: 799,
    rarity: "mythical",
    items: [
      {
        id: "item-10",
        name: "Штык-нож | Гамма Допплер",
        image: "https://images.unsplash.com/photo-1617694977288-495292e2944b?q=80&w=400&auto=format&fit=crop",
        rarity: "mythical",
        price: 18700
      },
      {
        id: "item-11",
        name: "AWP | Драконье пламя",
        image: "https://images.unsplash.com/photo-1621370115429-f3e9ac011db9?q=80&w=400&auto=format&fit=crop",
        rarity: "legendary",
        price: 3850
      },
      {
        id: "item-12",
        name: "Desert Eagle | Бронзовая декорация",
        image: "https://images.unsplash.com/photo-1625146152448-3c5e273ee3e9?q=80&w=400&auto=format&fit=crop",
        rarity: "legendary",
        price: 1950
      },
    ]
  }
];

export default cases;