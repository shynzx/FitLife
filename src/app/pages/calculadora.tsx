import { useState } from 'react';
import { Header } from '../../components/Header';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Calculator, Plus, Trash2, Equal, Target, Zap, Apple, Beef, Wheat, Milk } from 'lucide-react';
import SplashCursor from '../../components/SplashCursor';
import SpotlightCard from '../../components/SpotlightCard';

interface Food {
  id: string;
  name: string;
  category: string;
  // Valores nutricionales por 100g
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface SelectedFood {
  food: Food;
  weight: number;
}

const foods: Food[] = [
  // Carnes
  { id: '1', name: 'Pollo (pechuga)', category: 'Carne', calories: 165, protein: 31, fat: 3.6, carbs: 0 },
  { id: '2', name: 'Res (magra)', category: 'Carne', calories: 250, protein: 26, fat: 15, carbs: 0 },
  { id: '3', name: 'Cerdo (lomo)', category: 'Carne', calories: 242, protein: 27, fat: 14, carbs: 0 },
  { id: '4', name: 'Pescado (salmón)', category: 'Carne', calories: 208, protein: 20, fat: 13, carbs: 0 },
  { id: '5', name: 'Atún', category: 'Carne', calories: 132, protein: 28, fat: 1, carbs: 0 },
  
  // Vegetales
  { id: '6', name: 'Brócoli', category: 'Vegetales', calories: 34, protein: 2.8, fat: 0.4, carbs: 7 },
  { id: '7', name: 'Espinaca', category: 'Vegetales', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6 },
  { id: '8', name: 'Zanahoria', category: 'Vegetales', calories: 41, protein: 0.9, fat: 0.2, carbs: 10 },
  { id: '9', name: 'Tomate', category: 'Vegetales', calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9 },
  { id: '10', name: 'Lechuga', category: 'Vegetales', calories: 15, protein: 1.4, fat: 0.2, carbs: 2.9 },
  
  // Leguminosas
  { id: '11', name: 'Frijoles negros', category: 'Leguminosas', calories: 132, protein: 8.9, fat: 0.5, carbs: 23 },
  { id: '12', name: 'Lentejas', category: 'Leguminosas', calories: 116, protein: 9, fat: 0.4, carbs: 20 },
  { id: '13', name: 'Garbanzos', category: 'Leguminosas', calories: 164, protein: 8.9, fat: 2.6, carbs: 27 },
  { id: '14', name: 'Habas', category: 'Leguminosas', calories: 88, protein: 7.6, fat: 0.4, carbs: 17 },
  
  // Cereales
  { id: '15', name: 'Arroz blanco', category: 'Cereales', calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
  { id: '16', name: 'Avena', category: 'Cereales', calories: 389, protein: 17, fat: 7, carbs: 66 },
  { id: '17', name: 'Quinoa', category: 'Cereales', calories: 120, protein: 4.4, fat: 1.9, carbs: 22 },
  { id: '18', name: 'Pan integral', category: 'Cereales', calories: 247, protein: 13, fat: 4.2, carbs: 41 },
  
  // Lácteos
  { id: '19', name: 'Leche descremada', category: 'Lácteos', calories: 34, protein: 3.4, fat: 0.1, carbs: 5 },
  { id: '20', name: 'Yogurt natural', category: 'Lácteos', calories: 59, protein: 10, fat: 0.4, carbs: 3.6 },
  { id: '21', name: 'Queso cottage', category: 'Lácteos', calories: 98, protein: 11, fat: 4.3, carbs: 3.4 },
  
  // Frutas
  { id: '22', name: 'Manzana', category: 'Frutas', calories: 52, protein: 0.3, fat: 0.2, carbs: 14 },
  { id: '23', name: 'Plátano', category: 'Frutas', calories: 89, protein: 1.1, fat: 0.3, carbs: 23 },
  { id: '24', name: 'Naranja', category: 'Frutas', calories: 47, protein: 0.9, fat: 0.1, carbs: 12 },
];

const categories = [
  { key: 'Carne', name: 'Carne', icon: Beef, color: 'from-red-500 to-pink-600' },
  { key: 'Vegetales', name: 'Vegetales', icon: Apple, color: 'from-green-500 to-emerald-600' },
  { key: 'Leguminosas', name: 'Leguminosas', icon: Target, color: 'from-amber-500 to-orange-600' },
  { key: 'Cereales', name: 'Cereales', icon: Wheat, color: 'from-yellow-500 to-amber-600' },
  { key: 'Lácteos', name: 'Lácteos', icon: Milk, color: 'from-blue-500 to-indigo-600' },
  { key: 'Frutas', name: 'Frutas', icon: Apple, color: 'from-purple-500 to-violet-600' },
];

export function Calculadora() {
  useDocumentTitle('Calculadora Nutricional - FitLife');
  
  const [selectedCategory, setSelectedCategory] = useState<string>('Carne');
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [pendingFood, setPendingFood] = useState<Food | null>(null);

  const filteredFoods = foods.filter(food => food.category === selectedCategory);

  const handleFoodSelect = (food: Food) => {
    setPendingFood(food);
    setCurrentWeight('');
  };

  const handleNumberClick = (num: string) => {
    if (currentWeight.length < 6) {
      setCurrentWeight(prev => prev + num);
    }
  };

  const handleClear = () => {
    setCurrentWeight('');
  };

  const handleDelete = () => {
    setCurrentWeight(prev => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    if (pendingFood && currentWeight && parseFloat(currentWeight) > 0) {
      const weight = parseFloat(currentWeight);
      const newSelectedFood: SelectedFood = {
        food: pendingFood,
        weight: weight
      };
      
      setSelectedFoods(prev => [...prev, newSelectedFood]);
      setPendingFood(null);
      setCurrentWeight('');
    }
  };

  const handleAddMore = () => {
    if (pendingFood && currentWeight && parseFloat(currentWeight) > 0) {
      const weight = parseFloat(currentWeight);
      const newSelectedFood: SelectedFood = {
        food: pendingFood,
        weight: weight
      };
      
      setSelectedFoods(prev => [...prev, newSelectedFood]);
      setPendingFood(null);
      setCurrentWeight('');
    }
  };

  const removeFood = (index: number) => {
    setSelectedFoods(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setSelectedFoods([]);
    setPendingFood(null);
    setCurrentWeight('');
  };

  // Calcular totales nutricionales
  const totals = selectedFoods.reduce(
    (acc, item) => {
      const multiplier = item.weight / 100; // Convertir a porción basada en 100g
      return {
        calories: acc.calories + (item.food.calories * multiplier),
        protein: acc.protein + (item.food.protein * multiplier),
        fat: acc.fat + (item.food.fat * multiplier),
        carbs: acc.carbs + (item.food.carbs * multiplier),
      };
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const getTotalFoodsCount = () => {
    return selectedFoods.length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 dark:from-gray-900 dark:via-green-900/10 dark:to-blue-900/10 relative">
      {/* SplashCursor */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <SplashCursor
          SPLAT_FORCE={4000}
          SPLAT_RADIUS={0.12}
          DENSITY_DISSIPATION={3}
          VELOCITY_DISSIPATION={1.5}
          TRANSPARENT={true}
          SHADING={true}
          COLOR_UPDATE_SPEED={6}
        />
      </div>
      
      {/* Contenido principal */}
      <div className="relative z-30">
        <Header />
        <Breadcrumb />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          {/* Header mejorado */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl shadow-lg">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Calculadora Nutricional
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
              Selecciona alimentos, ingresa el peso y obtén información nutricional detallada
            </p>
            
            {/* Estadísticas */}
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-300 font-medium">
                  {getTotalFoodsCount()} alimentos seleccionados
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  {Math.round(totals.calories)} calorías totales
                </span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Panel izquierdo - Categorías y Alimentos */}
            <div className="lg:col-span-3">
              <SpotlightCard className="p-6" spotlightColor="rgba(34, 197, 94, 0.15)">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Categorías de Alimentos
                </h2>
                
                {/* Categorías mejoradas */}
                <div className="space-y-3 mb-6">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    const isSelected = selectedCategory === category.key;
                    return (
                      <Button
                        key={category.key}
                        onClick={() => setSelectedCategory(category.key)}
                        variant={isSelected ? "default" : "outline"}
                        className={`w-full justify-start text-left h-12 transition-all duration-300 ${
                          isSelected
                            ? `bg-gradient-to-r ${category.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105`
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 mr-3" />
                        {category.name}
                      </Button>
                    );
                  })}
                </div>

                {/* Lista de alimentos mejorada */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></span>
                    {selectedCategory}
                  </h3>
                  {filteredFoods.map((food) => (
                    <Button
                      key={food.id}
                      onClick={() => handleFoodSelect(food)}
                      variant="ghost"
                      className={`w-full justify-start text-left p-4 h-auto rounded-xl transition-all duration-300 ${
                        pendingFood?.id === food.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600 shadow-md transform scale-105'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-102 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                    >
                      <div className="w-full">
                        <div className="font-medium text-gray-900 dark:text-white">{food.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                          <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
                            {food.calories} cal/100g
                          </span>
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                            {food.protein}g proteína
                          </span>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </SpotlightCard>
            </div>

            {/* Panel central - Calculadora */}
            <div className="lg:col-span-5">
              <SpotlightCard className="p-6" spotlightColor="rgba(59, 130, 246, 0.15)">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Calculadora de Peso
                </h2>

                {/* Alimento seleccionado mejorado */}
                {pendingFood && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {pendingFood.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-blue-800 dark:text-blue-200">
                          {pendingFood.name}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-300 flex items-center gap-2">
                          <span>{pendingFood.calories} cal</span>
                          <span>•</span>
                          <span>{pendingFood.protein}g proteína por 100g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Display mejorado */}
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700 rounded-2xl p-6 min-h-[100px] flex items-center justify-center shadow-inner">
                    <div className="text-center">
                      <span className="text-4xl font-bold text-green-800 dark:text-green-200">
                        {currentWeight || '0'}
                      </span>
                      <span className="text-2xl font-semibold text-green-600 dark:text-green-400 ml-2">
                        gramos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Teclado numérico mejorado */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                      key={num}
                      onClick={() => handleNumberClick(num.toString())}
                      variant="outline"
                      className="h-14 text-lg font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-105"
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    onClick={() => handleNumberClick('0')}
                    variant="outline"
                    className="h-14 text-lg font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-105"
                  >
                    0
                  </Button>
                  <Button
                    onClick={() => handleNumberClick('.')}
                    variant="outline"
                    className="h-14 text-lg font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-105"
                  >
                    .
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="outline"
                    className="h-14 text-lg font-semibold rounded-xl border-2 border-red-200 dark:border-red-700 hover:border-red-300 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 transform hover:scale-105"
                  >
                    ←
                  </Button>
                </div>

                {/* Botones de acción mejorados */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="h-12 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    Limpiar
                  </Button>
                  <Button
                    onClick={handleAddMore}
                    disabled={!pendingFood || !currentWeight}
                    className="h-12 font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>

                <Button
                  onClick={handleCalculate}
                  disabled={!pendingFood || !currentWeight}
                  className="w-full h-12 mt-3 font-semibold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  <Equal className="w-4 h-4 mr-2" />
                  Calcular
                </Button>
              </SpotlightCard>
            </div>

            {/* Panel derecho - Resultados */}
            <div className="lg:col-span-4">
              <SpotlightCard className="p-6" spotlightColor="rgba(139, 92, 246, 0.15)">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Información Nutricional
                  </h2>
                  {selectedFoods.length > 0 && (
                    <Button
                      onClick={clearAll}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Alimentos seleccionados mejorados */}
                {selectedFoods.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                      Alimentos seleccionados:
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedFoods.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900 dark:text-white">{item.food.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                {item.weight}g
                              </span>
                              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
                                {Math.round((item.food.calories * item.weight) / 100)} cal
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeFood(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resultados nutricionales mejorados */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-orange-800 dark:text-orange-200 text-lg flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        Calorías
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                        {Math.round(totals.calories)}
                      </div>
                      <div className="text-sm text-orange-600 dark:text-orange-300">kcal</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-blue-800 dark:text-blue-200 text-lg flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        Proteínas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                        {Math.round(totals.protein * 10) / 10}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-300">gramos</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-yellow-800 dark:text-yellow-200 text-lg flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        Grasas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                        {Math.round(totals.fat * 10) / 10}
                      </div>
                      <div className="text-sm text-yellow-600 dark:text-yellow-300">gramos</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-green-800 dark:text-green-200 text-lg flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Carbohidratos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                        {Math.round(totals.carbs * 10) / 10}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-300">gramos</div>
                    </CardContent>
                  </Card>
                </div>

                {selectedFoods.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calculator className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="text-lg font-medium mb-2">¡Comienza a calcular!</p>
                    <p className="text-sm">Selecciona alimentos y agrega su peso para ver la información nutricional</p>
                  </div>
                )}
              </SpotlightCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}