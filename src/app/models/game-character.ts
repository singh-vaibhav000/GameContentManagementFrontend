export interface GameCharacter {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'Common' | 'Rare' | 'Epic';
  upgradeLevel: number;
  sortOrder: number;
} 