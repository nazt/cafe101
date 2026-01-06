'use client';

import { useState } from 'react';
import { Coffee, Leaf, GlassWater, Cookie } from 'lucide-react';

type DrinkType = 'matcha' | 'cappuccino' | 'thaitea' | 'cocoa';
type Size = 'S' | 'M' | 'L';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  isSweetness?: boolean;
}

interface DrinkRecipe {
  name: string;
  nameEn: string;
  icon: React.ReactNode;
  ingredients: Ingredient[];
}

const drinks: Record<DrinkType, DrinkRecipe> = {
  matcha: {
    name: 'มัทฉะลาเต้',
    nameEn: 'Matcha Latte',
    icon: <Leaf className="w-6 h-6" />,
    ingredients: [
      { name: 'ผงมัทฉะ', amount: 8, unit: 'g' },
      { name: 'น้ำร้อน', amount: 30, unit: 'ml' },
      { name: 'นมสด', amount: 180, unit: 'ml' },
      { name: 'น้ำเชื่อม', amount: 30, unit: 'ml', isSweetness: true },
      { name: 'น้ำแข็ง', amount: 120, unit: 'g' },
    ],
  },
  cappuccino: {
    name: 'คาปูชิโน่',
    nameEn: 'Cappuccino',
    icon: <Coffee className="w-6 h-6" />,
    ingredients: [
      { name: 'เอสเพรสโซ่', amount: 30, unit: 'ml' },
      { name: 'นมสด', amount: 150, unit: 'ml' },
      { name: 'น้ำเชื่อม', amount: 20, unit: 'ml', isSweetness: true },
      { name: 'น้ำแข็ง', amount: 100, unit: 'g' },
    ],
  },
  thaitea: {
    name: 'ชาไทย',
    nameEn: 'Thai Tea',
    icon: <GlassWater className="w-6 h-6" />,
    ingredients: [
      { name: 'ชาไทยเข้มข้น', amount: 80, unit: 'ml' },
      { name: 'นมข้นจืด', amount: 60, unit: 'ml' },
      { name: 'น้ำเชื่อม', amount: 35, unit: 'ml', isSweetness: true },
      { name: 'น้ำแข็ง', amount: 150, unit: 'g' },
    ],
  },
  cocoa: {
    name: 'โกโก้',
    nameEn: 'Cocoa',
    icon: <Cookie className="w-6 h-6" />,
    ingredients: [
      { name: 'ผงโกโก้', amount: 25, unit: 'g' },
      { name: 'น้ำร้อน', amount: 50, unit: 'ml' },
      { name: 'นมสด', amount: 180, unit: 'ml' },
      { name: 'น้ำเชื่อม', amount: 25, unit: 'ml', isSweetness: true },
      { name: 'น้ำแข็ง', amount: 120, unit: 'g' },
    ],
  },
};

const sizeMultipliers: Record<Size, number> = {
  S: 0.7,
  M: 1.0,
  L: 1.3,
};

const sizeInfo: Record<Size, { oz: string; label: string }> = {
  S: { oz: '12oz', label: '-30%' },
  M: { oz: '16oz', label: 'Standard' },
  L: { oz: '22oz', label: '+30%' },
};

const sweetnessPresets = [0, 25, 50, 75, 100];

export default function Home() {
  const [selectedDrink, setSelectedDrink] = useState<DrinkType>('matcha');
  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [sweetness, setSweetness] = useState(50);

  const calculateAmount = (ingredient: Ingredient): number => {
    const sizeMultiplier = sizeMultipliers[selectedSize];
    if (ingredient.isSweetness) {
      return Math.round(ingredient.amount * sizeMultiplier * (sweetness / 100));
    }
    return Math.round(ingredient.amount * sizeMultiplier);
  };

  const currentDrink = drinks[selectedDrink];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-5 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            🍹 เครื่องคำนวณสูตรเครื่องดื่ม
          </h1>
          <p className="text-slate-500 text-sm">
            Select drink, size, and sweetness level
          </p>
        </header>

        {/* Drink Selection */}
        <section className="mb-6">
          <div className="grid grid-cols-4 gap-3">
            {(Object.entries(drinks) as [DrinkType, DrinkRecipe][]).map(
              ([key, drink]) => (
                <button
                  key={key}
                  onClick={() => setSelectedDrink(key)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-2xl
                    transition-all duration-200 ease-out
                    ${
                      selectedDrink === key
                        ? 'bg-slate-100 border-2 border-slate-800 shadow-sm'
                        : 'bg-white border border-slate-200 hover:bg-slate-50'
                    }
                  `}
                >
                  <div
                    className={`mb-2 ${
                      selectedDrink === key ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {drink.icon}
                  </div>
                  <span
                    className={`text-xs font-medium text-center leading-tight ${
                      selectedDrink === key ? 'text-slate-800' : 'text-slate-600'
                    }`}
                  >
                    {drink.name}
                  </span>
                </button>
              )
            )}
          </div>
        </section>

        {/* Size Selection */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Cup Size</h2>
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(sizeInfo) as [Size, { oz: string; label: string }][]).map(
              ([size, info]) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    flex flex-col items-center justify-center py-4 px-3 rounded-2xl
                    transition-all duration-200 ease-out
                    ${
                      selectedSize === size
                        ? 'bg-slate-100 border-2 border-slate-800 shadow-sm'
                        : 'bg-white border border-slate-200 hover:bg-slate-50'
                    }
                  `}
                >
                  <span
                    className={`text-2xl font-bold mb-1 ${
                      selectedSize === size ? 'text-slate-800' : 'text-slate-600'
                    }`}
                  >
                    {size}
                  </span>
                  <span className="text-xs text-slate-500">{info.oz}</span>
                  <span
                    className={`text-xs mt-0.5 ${
                      selectedSize === size ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    {info.label}
                  </span>
                </button>
              )
            )}
          </div>
        </section>

        {/* Sweetness Level */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">Sweetness Level</h2>
            <span className="text-2xl font-bold text-slate-800">{sweetness}%</span>
          </div>

          {/* Slider */}
          <div className="relative mb-4">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={sweetness}
              onChange={(e) => setSweetness(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-5
                         [&::-webkit-slider-thumb]:h-5
                         [&::-webkit-slider-thumb]:bg-slate-800
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:shadow-md
                         [&::-webkit-slider-thumb]:transition-transform
                         [&::-webkit-slider-thumb]:hover:scale-110
                         [&::-moz-range-thumb]:w-5
                         [&::-moz-range-thumb]:h-5
                         [&::-moz-range-thumb]:bg-slate-800
                         [&::-moz-range-thumb]:border-0
                         [&::-moz-range-thumb]:rounded-full
                         [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex gap-2">
            {sweetnessPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => setSweetness(preset)}
                className={`
                  flex-1 py-2 rounded-xl text-sm font-medium
                  transition-all duration-200 ease-out
                  ${
                    sweetness === preset
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                {preset}%
              </button>
            ))}
          </div>
        </section>

        {/* Recipe Result Card */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="text-slate-700">{currentDrink.icon}</div>
              <div>
                <h3 className="font-semibold text-slate-800">{currentDrink.name}</h3>
                <p className="text-xs text-slate-400">{currentDrink.nameEn}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                Size {selectedSize}
              </span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                {sweetness}%
              </span>
            </div>
          </div>

          {/* Ingredients List */}
          <div className="px-5 py-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Ingredients
            </h4>
            <ul className="space-y-0">
              {currentDrink.ingredients.map((ingredient, index) => {
                const amount = calculateAmount(ingredient);
                return (
                  <li
                    key={ingredient.name}
                    className={`
                      flex items-center justify-between py-3
                      ${index !== currentDrink.ingredients.length - 1 ? 'border-b border-slate-100' : ''}
                    `}
                  >
                    <span className="text-slate-700">{ingredient.name}</span>
                    <span className="font-semibold text-slate-800">
                      {amount}{' '}
                      <span className="font-normal text-slate-400">{ingredient.unit}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Card Footer - Total */}
          <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-t border-slate-100">
            <span className="text-sm font-medium text-slate-500">Total Volume</span>
            <span className="text-lg font-bold text-slate-800">
              {currentDrink.ingredients.reduce(
                (sum, ing) => sum + calculateAmount(ing),
                0
              )}{' '}
              <span className="font-normal text-slate-400 text-sm">ml</span>
            </span>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-8 text-slate-400 text-xs">
          Made with ❤️ by Cafe 101
        </footer>
      </div>
    </main>
  );
}
