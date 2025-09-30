import { useState } from 'react';
import { Header } from '../../components/Header';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import SpotlightCard from '../../components/SpotlightCard';
import { Calculator, Target, Activity, Heart, Utensils, Zap, Scale, CircleAlert as AlertCircle } from 'lucide-react';

interface NutritionalData {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
  healthConditions: string[];
}

interface NutritionalResults {
  bmr: number;
  totalCalories: number;
  protein: { grams: number; calories: number; percentage: number };
  carbs: { grams: number; calories: number; percentage: number };
  fats: { grams: number; calories: number; percentage: number };
}

export function PlanNutricional() {
  useDocumentTitle('Plan Nutricional - FitLife');
  
  const [formData, setFormData] = useState<NutritionalData>({
    age: 0,
    gender: 'male',
    weight: 0,
    height: 0,
    activityLevel: 'moderate',
    goal: 'maintain',
    healthConditions: []
  });
  
  const [results, setResults] = useState<NutritionalResults | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Opciones de condiciones de salud
  const healthConditionOptions = [
    { value: 'none', label: 'Ninguna condición especial' },
    { value: 'diabetes_type1', label: 'Diabetes Tipo 1' },
    { value: 'diabetes_type2', label: 'Diabetes Tipo 2' },
    { value: 'hypertension', label: 'Hipertensión arterial' },
    { value: 'heart_disease', label: 'Enfermedad cardiovascular' },
    { value: 'kidney_disease', label: 'Enfermedad renal' },
    { value: 'liver_disease', label: 'Enfermedad hepática' },
    { value: 'thyroid_hyper', label: 'Hipertiroidismo' },
    { value: 'thyroid_hypo', label: 'Hipotiroidismo' },
    { value: 'celiac', label: 'Enfermedad celíaca' },
    { value: 'lactose_intolerance', label: 'Intolerancia a la lactosa' },
    { value: 'food_allergies', label: 'Alergias alimentarias' },
    { value: 'eating_disorder', label: 'Trastorno alimentario (en recuperación)' },
    { value: 'pregnancy', label: 'Embarazo' },
    { value: 'breastfeeding', label: 'Lactancia materna' },
    { value: 'osteoporosis', label: 'Osteoporosis' },
    { value: 'anemia', label: 'Anemia' },
    { value: 'gout', label: 'Gota' },
    { value: 'ibs', label: 'Síndrome del intestino irritable' },
    { value: 'gastritis', label: 'Gastritis crónica' }
  ];

  // Factores de actividad física
  const activityFactors = {
    sedentary: 1.2,      // Poco o ningún ejercicio
    light: 1.375,        // Ejercicio ligero 1-3 días/semana
    moderate: 1.55,      // Ejercicio moderado 3-5 días/semana
    active: 1.725,       // Ejercicio intenso 6-7 días/semana
    very_active: 1.9     // Ejercicio muy intenso, trabajo físico
  };

  // Ajustes según objetivo
  const goalAdjustments = {
    lose: 0.8,      // Déficit calórico del 20%
    maintain: 1.0,  // Mantenimiento
    gain: 1.2       // Superávit calórico del 20%
  };

  const validateForm = (): string[] => {
    const newErrors: string[] = [];
    
    if (!formData.age || formData.age < 10 || formData.age > 100) {
      newErrors.push('La edad debe estar entre 10 y 100 años');
    }
    
    if (!formData.weight || formData.weight < 30 || formData.weight > 300) {
      newErrors.push('El peso debe estar entre 30 y 300 kg');
    }
    
    if (!formData.height || formData.height < 100 || formData.height > 250) {
      newErrors.push('La altura debe estar entre 100 y 250 cm');
    }
    
    if (!formData.healthConditions || formData.healthConditions.length === 0) {
      newErrors.push('Debes seleccionar al menos una condición de salud');
    }
    
    return newErrors;
  };

  const calculateBMR = (data: NutritionalData): number => {
    // Fórmula de Mifflin-St Jeor
    if (data.gender === 'male') {
      return (10 * data.weight) + (6.25 * data.height) - (5 * data.age) + 5;
    } else {
      return (10 * data.weight) + (6.25 * data.height) - (5 * data.age) - 161;
    }
  };

  const calculateNutrition = () => {
    setIsCalculating(true);
    
    // Simular tiempo de cálculo
    setTimeout(() => {
      const validationErrors = validateForm();
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setResults(null);
        setIsCalculating(false);
        return;
      }
      
      setErrors([]);
      
      // Calcular TMB (Tasa Metabólica Basal)
      const bmr = calculateBMR(formData);
      
      // Calcular calorías totales considerando actividad física
      const activityCalories = bmr * activityFactors[formData.activityLevel];
      
      // Ajustar según objetivo
      const totalCalories = Math.round(activityCalories * goalAdjustments[formData.goal]);
      
      // Calcular macronutrientes según objetivo
      let proteinPercentage, carbsPercentage, fatsPercentage;
      
      // Ajustar macronutrientes según condiciones de salud
      const hasdiabetes = formData.healthConditions.includes('diabetes_type1') || formData.healthConditions.includes('diabetes_type2');
      const hasKidneyDisease = formData.healthConditions.includes('kidney_disease');
      const hasHeartDisease = formData.healthConditions.includes('heart_disease') || formData.healthConditions.includes('hypertension');
      
      if (hasKidneyDisease) {
        // Reducir proteínas para enfermedad renal
        proteinPercentage = 15;
        carbsPercentage = 55;
        fatsPercentage = 30;
      } else if (hasdiabetes) {
        // Reducir carbohidratos para diabetes
        proteinPercentage = 25;
        carbsPercentage = 35;
        fatsPercentage = 40;
      } else if (hasHeartDisease) {
        // Reducir grasas para enfermedad cardiovascular
        proteinPercentage = 25;
        carbsPercentage = 55;
        fatsPercentage = 20;
      } else {
        // Distribución normal según objetivo
        switch (formData.goal) {
          case 'lose':
            proteinPercentage = 30; // Mayor proteína para preservar músculo
            carbsPercentage = 40;
            fatsPercentage = 30;
            break;
          case 'gain':
            proteinPercentage = 25;
            carbsPercentage = 50; // Más carbohidratos para energía
            fatsPercentage = 25;
            break;
          default: // maintain
            proteinPercentage = 25;
            carbsPercentage = 45;
            fatsPercentage = 30;
        }
      }
      
      // Convertir a gramos
      const proteinCalories = Math.round((totalCalories * proteinPercentage) / 100);
      const carbsCalories = Math.round((totalCalories * carbsPercentage) / 100);
      const fatsCalories = Math.round((totalCalories * fatsPercentage) / 100);
      
      const proteinGrams = Math.round(proteinCalories / 4); // 1g proteína = 4 kcal
      const carbsGrams = Math.round(carbsCalories / 4);     // 1g carbohidrato = 4 kcal
      const fatsGrams = Math.round(fatsCalories / 9);       // 1g grasa = 9 kcal
      
      const nutritionalResults: NutritionalResults = {
        bmr: Math.round(bmr),
        totalCalories,
        protein: {
          grams: proteinGrams,
          calories: proteinCalories,
          percentage: proteinPercentage
        },
        carbs: {
          grams: carbsGrams,
          calories: carbsCalories,
          percentage: carbsPercentage
        },
        fats: {
          grams: fatsGrams,
          calories: fatsCalories,
          percentage: fatsPercentage
        }
      };
      
      setResults(nutritionalResults);
      setIsCalculating(false);
    }, 1000);
  };

  const handleInputChange = (field: keyof NutritionalData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a corregir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleHealthConditionChange = (conditionValue: string, isChecked: boolean) => {
    setFormData(prev => {
      let newConditions = [...prev.healthConditions];
      
      if (conditionValue === 'none') {
        // Si selecciona "ninguna", limpiar todas las demás
        newConditions = isChecked ? ['none'] : [];
      } else {
        // Si selecciona otra condición, quitar "ninguna" si estaba seleccionada
        if (isChecked) {
          newConditions = newConditions.filter(c => c !== 'none');
          newConditions.push(conditionValue);
        } else {
          newConditions = newConditions.filter(c => c !== conditionValue);
        }
      }
      
      return {
        ...prev,
        healthConditions: newConditions
      };
    });
    
    // Limpiar errores cuando el usuario empiece a corregir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const getActivityLevelText = (level: string) => {
    const levels = {
      sedentary: 'Sedentario (poco o ningún ejercicio)',
      light: 'Ligero (ejercicio 1-3 días/semana)',
      moderate: 'Moderado (ejercicio 3-5 días/semana)',
      active: 'Activo (ejercicio 6-7 días/semana)',
      very_active: 'Muy activo (ejercicio intenso diario)'
    };
    return levels[level as keyof typeof levels];
  };

  const getGoalText = (goal: string) => {
    const goals = {
      lose: 'Perder peso',
      maintain: 'Mantener peso',
      gain: 'Ganar peso'
    };
    return goals[goal as keyof typeof goals];
  };

  const getHealthConditionLabel = (value: string) => {
    const condition = healthConditionOptions.find(option => option.value === value);
    return condition ? condition.label : value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
      <Header />
      <Breadcrumb />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl shadow-lg">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Plan Nutricional
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Calcula tus necesidades diarias de calorías y macronutrientes basándose en tus datos personales y objetivos
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-5">
            <SpotlightCard className="p-6" spotlightColor="rgba(34, 197, 94, 0.15)">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Datos Personales
              </h2>

              <div className="space-y-4">
                {/* Edad y Género */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age" className="text-gray-700 font-medium">
                      Edad (años)
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age || ''}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                      placeholder="25"
                      className="mt-1"
                      min="10"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gender" className="text-gray-700 font-medium">
                      Género
                    </Label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                    </select>
                  </div>
                </div>

                {/* Peso y Altura */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight" className="text-gray-700 font-medium">
                      Peso (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight || ''}
                      onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                      placeholder="70"
                      className="mt-1"
                      min="30"
                      max="300"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="height" className="text-gray-700 font-medium">
                      Altura (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height || ''}
                      onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
                      placeholder="175"
                      className="mt-1"
                      min="100"
                      max="250"
                    />
                  </div>
                </div>

                {/* Nivel de Actividad */}
                <div>
                  <Label htmlFor="activity" className="text-gray-700 font-medium">
                    Nivel de Actividad Física
                  </Label>
                  <select
                    id="activity"
                    value={formData.activityLevel}
                    onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                    className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="sedentary">Sedentario</option>
                    <option value="light">Ligero</option>
                    <option value="moderate">Moderado</option>
                    <option value="active">Activo</option>
                    <option value="very_active">Muy Activo</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {getActivityLevelText(formData.activityLevel)}
                  </p>
                </div>

                {/* Objetivo */}
                <div>
                  <Label htmlFor="goal" className="text-gray-700 font-medium">
                    Objetivo
                  </Label>
                  <select
                    id="goal"
                    value={formData.goal}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                    className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="lose">Perder peso</option>
                    <option value="maintain">Mantener peso</option>
                    <option value="gain">Ganar peso</option>
                  </select>
                </div>

                {/* Condiciones de Salud */}
                <div>
                  <Label className="text-gray-700 font-medium mb-3 block">
                    Condiciones de Salud *
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Selecciona todas las condiciones que apliquen. Esta información es crucial para calcular un plan nutricional seguro y adecuado.
                  </p>
                  
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50">
                    <div className="grid grid-cols-1 gap-2">
                      {healthConditionOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center space-x-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.healthConditions.includes(option.value)}
                            onChange={(e) => handleHealthConditionChange(option.value, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-700 flex-1">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {formData.healthConditions.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-800 mb-2">Condiciones seleccionadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.healthConditions.map((condition) => (
                          <span
                            key={condition}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {getHealthConditionLabel(condition)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Errores */}
                {errors.length > 0 && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <ul className="list-disc list-inside space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Botón Calcular */}
                <Button
                  onClick={calculateNutrition}
                  disabled={isCalculating}
                  className="w-full h-12 font-semibold rounded-xl bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg transition-all duration-200"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calcular Plan Nutricional
                    </>
                  )}
                </Button>
              </div>
            </SpotlightCard>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-7">
            <SpotlightCard className="p-6" spotlightColor="rgba(59, 130, 246, 0.15)">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Tus Necesidades Nutricionales Diarias
              </h2>

              {!results ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Utensils className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-lg font-medium mb-2">¡Completa el formulario!</p>
                  <p className="text-sm">Ingresa tus datos personales para calcular tu plan nutricional personalizado</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Resumen de datos */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Resumen de tu perfil
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Edad:</span>
                        <p className="font-medium">{formData.age} años</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Género:</span>
                        <p className="font-medium">{formData.gender === 'male' ? 'Masculino' : 'Femenino'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Peso:</span>
                        <p className="font-medium">{formData.weight} kg</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Altura:</span>
                        <p className="font-medium">{formData.height} cm</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Actividad:</span>
                          <p className="font-medium">{getActivityLevelText(formData.activityLevel)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Objetivo:</span>
                          <p className="font-medium">{getGoalText(formData.goal)}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div>
                          <span className="text-gray-500">Condiciones de salud:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {formData.healthConditions.map((condition) => (
                              <span
                                key={condition}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                              >
                                {getHealthConditionLabel(condition)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calorías totales */}
                  <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-orange-800 text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Calorías Diarias
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <div className="text-3xl font-bold text-orange-900">
                          {results.totalCalories.toLocaleString()}
                        </div>
                        <div className="text-sm text-orange-600">kcal/día</div>
                      </div>
                      <div className="text-xs text-orange-600 mt-1">
                        TMB: {results.bmr.toLocaleString()} kcal/día
                      </div>
                    </CardContent>
                  </Card>

                  {/* Macronutrientes */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Proteínas */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-blue-800 text-lg flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          Proteínas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-900 mb-1">
                          {results.protein.grams}g
                        </div>
                        <div className="text-sm text-blue-600">
                          {results.protein.calories} kcal ({results.protein.percentage}%)
                        </div>
                        <div className="text-xs text-blue-500 mt-2">
                          Esencial para músculos y recuperación
                        </div>
                      </CardContent>
                    </Card>

                    {/* Carbohidratos */}
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-green-800 text-lg flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          Carbohidratos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-900 mb-1">
                          {results.carbs.grams}g
                        </div>
                        <div className="text-sm text-green-600">
                          {results.carbs.calories} kcal ({results.carbs.percentage}%)
                        </div>
                        <div className="text-xs text-green-500 mt-2">
                          Principal fuente de energía
                        </div>
                      </CardContent>
                    </Card>

                    {/* Grasas */}
                    <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-yellow-800 text-lg flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          Grasas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-900 mb-1">
                          {results.fats.grams}g
                        </div>
                        <div className="text-sm text-yellow-600">
                          {results.fats.calories} kcal ({results.fats.percentage}%)
                        </div>
                        <div className="text-xs text-yellow-500 mt-2">
                          Importante para hormonas y vitaminas
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recomendaciones */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Recomendaciones Personalizadas según tus Condiciones
                    </h3>
                    <div className="space-y-2 text-sm text-blue-700">
                      {/* Recomendaciones específicas según condiciones de salud */}
                      {formData.healthConditions.includes('diabetes_type1') || formData.healthConditions.includes('diabetes_type2') ? (
                        <p>• <strong>Diabetes:</strong> Se han reducido los carbohidratos y aumentado las grasas saludables. Controla tu glucosa regularmente.</p>
                      ) : null}
                      
                      {formData.healthConditions.includes('kidney_disease') ? (
                        <p>• <strong>Enfermedad renal:</strong> Se ha reducido la proteína para proteger tus riñones. Limita el sodio y fósforo.</p>
                      ) : null}
                      
                      {formData.healthConditions.includes('heart_disease') || formData.healthConditions.includes('hypertension') ? (
                        <p>• <strong>Salud cardiovascular:</strong> Se han reducido las grasas saturadas. Prioriza grasas omega-3 y limita el sodio.</p>
                      ) : null}
                      
                      {formData.healthConditions.includes('celiac') ? (
                        <p>• <strong>Enfermedad celíaca:</strong> Asegúrate de que todos los carbohidratos sean libres de gluten.</p>
                      ) : null}
                      
                      {formData.healthConditions.includes('lactose_intolerance') ? (
                        <p>• <strong>Intolerancia a la lactosa:</strong> Usa alternativas vegetales para lácteos o productos sin lactosa.</p>
                      ) : null}
                      
                      {formData.healthConditions.includes('pregnancy') || formData.healthConditions.includes('breastfeeding') ? (
                        <p>• <strong>Embarazo/Lactancia:</strong> Aumenta el consumo de ácido fólico, hierro y calcio. Consulta con tu médico.</p>
                      ) : null}
                      
                      {formData.healthConditions.includes('anemia') ? (
                        <p>• <strong>Anemia:</strong> Prioriza alimentos ricos en hierro y vitamina C para mejorar la absorción.</p>
                      ) : null}
                      
                      {formData.healthConditions.includes('osteoporosis') ? (
                        <p>• <strong>Osteoporosis:</strong> Aumenta el consumo de calcio y vitamina D. Considera suplementos si es necesario.</p>
                      ) : null}
                      
                      {/* Recomendaciones generales según objetivo */}
                      {formData.goal === 'lose' && (
                        <p>• Mantén un déficit calórico moderado y prioriza las proteínas para preservar masa muscular.</p>
                      )}
                      {formData.goal === 'gain' && (
                        <p>• Consume suficientes carbohidratos para energía y combina con entrenamiento de fuerza.</p>
                      )}
                      {formData.goal === 'maintain' && (
                        <p>• Mantén un balance equilibrado de macronutrientes y ajusta según tu actividad diaria.</p>
                      )}
                      
                      <p>• Distribuye las comidas a lo largo del día en 4-6 porciones.</p>
                      <p>• Mantente hidratado bebiendo al menos 2-3 litros de agua al día.</p>
                      <p>• <strong>IMPORTANTE:</strong> Consulta con un nutricionista y tu médico antes de seguir este plan.</p>
                    </div>
                  </div>

                  {formData.healthConditions.length > 0 && !formData.healthConditions.includes('none') && (
                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                      <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        ⚠️ ADVERTENCIA MÉDICA IMPORTANTE
                      </h3>
                      <p className="text-sm text-red-700 font-medium">
                        <strong>CONSULTA MÉDICA OBLIGATORIA:</strong> Tienes condiciones de salud que requieren supervisión médica. 
                        Este plan es solo una estimación y NO reemplaza el consejo médico profesional. 
                        Consulta con tu médico y un nutricionista certificado antes de seguir cualquier plan nutricional.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </SpotlightCard>
          </div>
        </div>
      </main>
    </div>
  );
}