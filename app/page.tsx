'use client';

import { useState } from 'react';
import { Noto_Serif_JP, DM_Sans } from 'next/font/google';

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-noto-serif'
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans'
});

type Size = 'S' | 'M' | 'L';
type DrinkKey = 'matcha' | 'espresso' | 'thaitea' | 'cocoa';

interface Ingredient {
  name: string;
  baseAmount: number;
  unit: string;
  layer: string;
  sweetnessBased?: boolean;
}

interface Recipe {
  name: string;
  nameEn: string;
  icon: string;
  layers: string[];
  ingredients: Record<string, Ingredient>;
  sizes: Record<Size, number>;
}

const recipes: Record<DrinkKey, Recipe> = {
  matcha: {
    name: 'มัทฉะลาเต้',
    nameEn: 'Matcha Latte',
    icon: '🍵',
    layers: ['ice', 'milk', 'sugar', 'main', 'water'],
    ingredients: {
      main: { name: 'ผงมัทฉะ', baseAmount: 8, unit: 'g', layer: 'main' },
      water: { name: 'น้ำร้อน', baseAmount: 30, unit: 'ml', layer: 'water' },
      milk: { name: 'นมสด', baseAmount: 180, unit: 'ml', layer: 'milk' },
      sugar: { name: 'น้ำเชื่อม', baseAmount: 30, unit: 'ml', layer: 'sugar', sweetnessBased: true },
      ice: { name: 'น้ำแข็ง', baseAmount: 120, unit: 'g', layer: 'ice' }
    },
    sizes: { S: 0.7, M: 1, L: 1.3 }
  },
  espresso: {
    name: 'คาปูชิโน่',
    nameEn: 'Cappuccino',
    icon: '☕',
    layers: ['ice', 'milk', 'sugar', 'main'],
    ingredients: {
      main: { name: 'เอสเพรสโซ่', baseAmount: 30, unit: 'ml', layer: 'main' },
      milk: { name: 'นมสด', baseAmount: 150, unit: 'ml', layer: 'milk' },
      sugar: { name: 'น้ำเชื่อม', baseAmount: 20, unit: 'ml', layer: 'sugar', sweetnessBased: true },
      ice: { name: 'น้ำแข็ง', baseAmount: 100, unit: 'g', layer: 'ice' }
    },
    sizes: { S: 0.7, M: 1, L: 1.3 }
  },
  thaitea: {
    name: 'ชาไทย',
    nameEn: 'Thai Tea',
    icon: '🧋',
    layers: ['ice', 'milk', 'sugar', 'main'],
    ingredients: {
      main: { name: 'ชาไทยเข้มข้น', baseAmount: 80, unit: 'ml', layer: 'main' },
      milk: { name: 'นมข้นจืด', baseAmount: 60, unit: 'ml', layer: 'milk' },
      sugar: { name: 'น้ำเชื่อม', baseAmount: 35, unit: 'ml', layer: 'sugar', sweetnessBased: true },
      ice: { name: 'น้ำแข็ง', baseAmount: 150, unit: 'g', layer: 'ice' }
    },
    sizes: { S: 0.7, M: 1, L: 1.3 }
  },
  cocoa: {
    name: 'โกโก้',
    nameEn: 'Cocoa',
    icon: '🍫',
    layers: ['ice', 'milk', 'sugar', 'main', 'water'],
    ingredients: {
      main: { name: 'ผงโกโก้', baseAmount: 25, unit: 'g', layer: 'main' },
      water: { name: 'น้ำร้อน', baseAmount: 50, unit: 'ml', layer: 'water' },
      milk: { name: 'นมสด', baseAmount: 180, unit: 'ml', layer: 'milk' },
      sugar: { name: 'น้ำเชื่อม', baseAmount: 25, unit: 'ml', layer: 'sugar', sweetnessBased: true },
      ice: { name: 'น้ำแข็ง', baseAmount: 120, unit: 'g', layer: 'ice' }
    },
    sizes: { S: 0.7, M: 1, L: 1.3 }
  }
};

function calculateAmount(recipe: Recipe, ingredientKey: string, size: Size, sweetness: number): number {
  const ing = recipe.ingredients[ingredientKey];
  const sizeMultiplier = recipe.sizes[size];
  if (ing.sweetnessBased) {
    return Math.round(ing.baseAmount * sizeMultiplier * (sweetness / 100));
  }
  return Math.round(ing.baseAmount * sizeMultiplier);
}

function calculateTotal(recipe: Recipe, size: Size, sweetness: number): number {
  return Object.keys(recipe.ingredients).reduce((total, key) => {
    return total + calculateAmount(recipe, key, size, sweetness);
  }, 0);
}

function getLayerAmounts(recipe: Recipe, size: Size, sweetness: number): Record<string, number> {
  const amounts: Record<string, number> = {};
  Object.entries(recipe.ingredients).forEach(([key, ing]) => {
    const layer = ing.layer;
    const amount = calculateAmount(recipe, key, size, sweetness);
    amounts[layer] = (amounts[layer] || 0) + amount;
  });
  return amounts;
}

function Glass({ recipe, drinkKey, size, sweetness }: { recipe: Recipe; drinkKey: DrinkKey; size: Size; sweetness: number }) {
  const layerAmounts = getLayerAmounts(recipe, size, sweetness);
  const total = calculateTotal(recipe, size, sweetness);
  const maxHeight = 160;

  return (
    <div className="glass-container">
      <div className="glass">
        <div className="glass-shine" />
        <div className="glass-rim" />
        <div className="glass-content">
          {recipe.layers.map((layer, idx) => {
            const amount = layerAmounts[layer] || 0;
            const heightPercent = (amount / total) * 100;
            const height = (heightPercent / 100) * maxHeight;
            const layerClass = layer === 'main' ? `layer-main-${drinkKey}` : `layer-${layer}`;

            return (
              <div
                key={layer}
                className={`layer ${layerClass}`}
                style={{
                  height: `${height}px`,
                  animationDelay: `${idx * 0.15}s`
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="straw" />
    </div>
  );
}

function RecipeCard({ drinkKey, recipe, sweetness }: { drinkKey: DrinkKey; recipe: Recipe; sweetness: number }) {
  const [size, setSize] = useState<Size>('M');
  const total = calculateTotal(recipe, size, sweetness);

  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <span className="recipe-emoji">{recipe.icon}</span>
        <div className="recipe-info">
          <h3 className={`recipe-name ${notoSerifJP.className}`}>{recipe.name}</h3>
          <p className="recipe-name-en">{recipe.nameEn}</p>
        </div>
        <div className="size-selector">
          {(['S', 'M', 'L'] as Size[]).map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`size-btn ${size === s ? 'active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="recipe-visual">
        <Glass recipe={recipe} drinkKey={drinkKey} size={size} sweetness={sweetness} />

        <div className="ingredients-compact">
          {Object.entries(recipe.ingredients).map(([ingKey, ing]) => {
            const amount = calculateAmount(recipe, ingKey, size, sweetness);
            const colorClass = ing.layer === 'main' ? `main-${drinkKey}` : ing.layer;

            return (
              <div key={ingKey} className="ing-row">
                <div className="ing-left">
                  <div className={`ing-color ${colorClass}`} />
                  <span className="ing-name">{ing.name}</span>
                </div>
                <div>
                  <span className="ing-amount">{amount}</span>
                  <span className="ing-unit">{ing.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="recipe-total">
        <span className="total-label">รวมทั้งหมด</span>
        <span className="total-value">
          {total}<span className="ing-unit"> ml</span>
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const [sweetness, setSweetness] = useState(25);
  const presets = [0, 25, 50, 75, 100];

  return (
    <div className={`${dmSans.variable} ${notoSerifJP.variable}`}>
      <div className="bg-decoration" />

      <div className="container">
        <header>
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M18.5 3H6C4.9 3 4 3.9 4 5v12c0 1.1.9 2 2 2h2v2h8v-2h2c1.1 0 2-.9 2-2v-3h.5c1.38 0 2.5-1.12 2.5-2.5S21.88 9 20.5 9H20V5c0-1.1-.9-2-2-2h-.5z"/>
              </svg>
            </div>
          </div>
          <h1 className={notoSerifJP.className}>คาเฟ่ 101</h1>
          <p className="tagline">เครื่องคำนวณสูตรเครื่องดื่ม</p>
        </header>

        <section className="sweetness-control">
          <div className="sweetness-header">
            <div className={`sweetness-title ${notoSerifJP.className}`}>
              <span>🍯</span> ระดับความหวาน
            </div>
            <div className="sweetness-value">
              {sweetness}<span>%</span>
            </div>
          </div>

          <div className="slider-container">
            <div className="slider-track" />
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={sweetness}
              onChange={(e) => setSweetness(parseInt(e.target.value))}
            />
          </div>

          <div className="preset-buttons">
            {presets.map((value) => (
              <button
                key={value}
                onClick={() => setSweetness(value)}
                className={`preset-btn ${sweetness === value ? 'active' : ''}`}
              >
                {value}%
              </button>
            ))}
          </div>
        </section>

        <section className="recipes-grid">
          {(Object.entries(recipes) as [DrinkKey, Recipe][]).map(([key, recipe]) => (
            <RecipeCard key={key} drinkKey={key} recipe={recipe} sweetness={sweetness} />
          ))}
        </section>

        <footer>
          <p>สร้างด้วย ❤️ โดย คาเฟ่ 101</p>
        </footer>
      </div>
    </div>
  );
}
