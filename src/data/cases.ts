import { CaseProps } from "@/components/CaseCard";

export const cases: CaseProps[] = [
  // Дешевые кейсы (много плохого дропа)
  {
    id: "case-starter",
    name: "Стартовый кейс",
    image: "https://images.unsplash.com/photo-1608985929455-9e2f3eaed724?q=80&w=400&auto=format&fit=crop",
    price: 99,
    rarity: "rare",
    items: [
      {
        id: "starter-1",
        name: "P250 | Пиксельный камуфляж",
        image: "https://images.unsplash.com/photo-1612125893834-b7ecf499d08a?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 25
      },
      {
        id: "starter-2",
        name: "MP9 | Армейская окраска",
        image: "https://images.unsplash.com/photo-1619483733971-7c144148865d?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 35
      },
      {
        id: "starter-3",
        name: "Negev | Городская рубка",
        image: "https://images.unsplash.com/photo-1603921869096-42413c4c8ed7?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 30
      },
      {
        id: "starter-4",
        name: "MAC-10 | Серебряный",
        image: "https://images.unsplash.com/photo-1637334207906-306d53d0555f?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 45
      },
      {
        id: "starter-5",
        name: "P90 | Песчаный узор",
        image: "https://images.unsplash.com/photo-1646547520529-c189e61f7d1c?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 40
      },
      {
        id: "starter-6",
        name: "Glock-18 | Городская опасность",
        image: "https://images.unsplash.com/photo-1611372186581-6ccfddd2d22b?q=80&w=400&auto=format&fit=crop",
        rarity: "epic",
        price: 180
      },
      {
        id: "starter-7",
        name: "MP7 | Гравить",
        image: "https://images.unsplash.com/photo-1604696311591-9a2e9bf9db37?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 60
      },
    ]
  },
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
      {
        id: "prime-4",
        name: "Tec-9 | Красная кварта",
        image: "https://images.unsplash.com/photo-1619336415427-4792f450945d?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 85
      },
      {
        id: "prime-5",
        name: "P2000 | Полевой",
        image: "https://images.unsplash.com/photo-1618542540701-0861383d86da?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 95
      },
      {
        id: "prime-6",
        name: "AUG | Вихрь",
        image: "https://images.unsplash.com/photo-1626409276159-56709369028c?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 120
      },
    ]
  },
  // Средние кейсы
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
      {
        id: "chrome-4",
        name: "FAMAS | Дерево",
        image: "https://images.unsplash.com/photo-1623200216581-969d118608ee?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 130
      },
      {
        id: "chrome-5",
        name: "Galil AR | Эко",
        image: "https://images.unsplash.com/photo-1630254685447-8d1926c7021a?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 150
      },
    ]
  },
  // Кейс с агентами
  {
    id: "agents-case",
    name: "Кейс Агентов",
    image: "https://images.unsplash.com/photo-1609982917453-b316d1e76530?q=80&w=400&auto=format&fit=crop",
    price: 399,
    rarity: "epic",
    items: [
      {
        id: "agent-1",
        name: "Агент | Элитный оперативник",
        image: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?q=80&w=400&auto=format&fit=crop",
        rarity: "legendary",
        price: 1800
      },
      {
        id: "agent-2",
        name: "Агент | Спецназ",
        image: "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b1?q=80&w=400&auto=format&fit=crop",
        rarity: "epic",
        price: 650
      },
      {
        id: "agent-3",
        name: "Агент | Ветеран",
        image: "https://images.unsplash.com/photo-1604035933660-4e8e1a0be769?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 250
      },
      {
        id: "agent-4",
        name: "Агент | Городской боец",
        image: "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 220
      },
      {
        id: "agent-5",
        name: "Агент | Тактикул",
        image: "https://images.unsplash.com/photo-1603423979078-eb5a6d022e62?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 190
      },
    ]
  },
  // Кейс с перчатками
  {
    id: "gloves-case",
    name: "Кейс Перчаток",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=400&auto=format&fit=crop",
    price: 899,
    rarity: "legendary",
    items: [
      {
        id: "gloves-1",
        name: "Перчатки | Поверхностная закалка",
        image: "https://images.unsplash.com/photo-1603798165431-ffe40a11fb94?q=80&w=400&auto=format&fit=crop",
        rarity: "mythical",
        price: 15000
      },
      {
        id: "gloves-2",
        name: "Перчатки | Пандора",
        image: "https://images.unsplash.com/photo-1591195853016-1c43095bcbbd?q=80&w=400&auto=format&fit=crop",
        rarity: "mythical",
        price: 12000
      },
      {
        id: "gloves-3",
        name: "Перчатки | Изумруд",
        image: "https://images.unsplash.com/photo-1605923129626-d5008a559a49?q=80&w=400&auto=format&fit=crop",
        rarity: "legendary",
        price: 3500
      },
      {
        id: "gloves-4",
        name: "Перчатки | Лунный узор",
        image: "https://images.unsplash.com/photo-1596634580158-bde56f6244be?q=80&w=400&auto=format&fit=crop",
        rarity: "legendary",
        price: 2800
      },
      {
        id: "gloves-5",
        name: "Перчатки | Тактические",
        image: "https://images.unsplash.com/photo-1600054800747-be294a6a0d26?q=80&w=400&auto=format&fit=crop",
        rarity: "epic",
        price: 950
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
      {
        id: "spectr-4",
        name: "SSG 08 | Цифровой",
        image: "https://images.unsplash.com/photo-1619336504883-7c7a9b309fad?q=80&w=400&auto=format&fit=crop",
        rarity: "epic",
        price: 420
      },
      {
        id: "spectr-5",
        name: "CZ75-Auto | Полимер",
        image: "https://images.unsplash.com/photo-1631382190979-a8b9dbb05090?q=80&w=400&auto=format&fit=crop",
        rarity: "rare",
        price: 230
      },
    ]
  },
  // Кейс ножей
  {
    id: "knives-case",
    name: "Кейс Ножей",
    image: "https://images.unsplash.com/photo-1593548615306-b25f79be4bd6?q=80&w=400&auto=format&fit=crop",
    price: 1299,
    rarity: "mythical",
    items: [
      {
        id: "knife-1",
        name: "Керамбит | Автотроника",
        image: "https://images.unsplash.com/photo-1595430776242-ffa8c930b6d4?q=80&w=400&auto=format&fit=crop",
        rarity: "mythical",
        price: 25000
      },
      {
        id: "knife-2",
        name: "Нож Боуи | Мраморный градиент",
        image: "https://images.unsplash.com/photo-1593102969548-4e2d39fefbe9?q=80&w=400&auto=format&fit=crop",
        rarity: "mythical",
        price: 18000
      },
      {
        id: "knife-3",
        name: "Штык-нож М9 | Волны",
        image: "https://images.unsplash.com/photo-1617694977288-495292e2944b?q=80&w=400&auto=format&fit=crop",
        rarity: "mythical",
        price: 16500
      },
      {
        id: "knife-4",
        name: "Флип-нож | Кровавая паутина",
        image: "https://images.unsplash.com/photo-1590419690008-905895e8fe0d?q=80&w=400&auto=format&fit=crop",
        rarity: "mythical",
        price: 14200
      },
      {
        id: "knife-5",
        name: "Складной нож | Ночь",
        image: "https://images.unsplash.com/photo-1580144230371-9a4ab880215a?q=80&w=400&auto=format&fit=crop",
        rarity: "legendary",
        price: 4500
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
      {
        id: "danger-4",
        name: "AK-47 | Азимов",
        image: "https://images.unsplash.com/photo-1619290771983-7a743dd98d54?q=80&w=400&auto=format&fit=crop",
        rarity: "legendary",
        price: 1750
      },
      {
        id: "danger-5",
        name: "M4A4 | Преторианец",
        image: "https://images.unsplash.com/photo-1620762768841-f10f1a14f591?q=80&w=400&auto=format&fit=crop",
        rarity: "epic",
        price: 780
      },
    ]
  }
];

export default cases;