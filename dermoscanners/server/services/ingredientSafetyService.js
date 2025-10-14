/**
 * Ingredient Safety Analysis Service
 * US-202: Analyzes ingredients against safety database
 */

// Ingredient Safety Database
const INGREDIENT_DATABASE = {
  // Safe ingredients (Low Risk)
  safe: [
    'water', 'aqua', 'glycerin', 'hyaluronic acid', 'ceramides',
    'niacinamide', 'panthenol', 'aloe vera', 'oatmeal', 'allantoin',
    'dimethicone', 'cyclomethicone', 'squalane', 'squalene',
    'tocopherol', 'vitamin e', 'ascorbic acid', 'vitamin c',
    'zinc oxide', 'titanium dioxide', 'kaolin', 'bentonite',
    'rose water', 'witch hazel', 'green tea extract', 'chamomile',
    'jojoba oil', 'argan oil', 'shea butter', 'cocoa butter',
    'beeswax', 'carnauba wax', 'sodium hyaluronate', 'sodium pca',
    'sodium lactate', 'urea', 'lactic acid', 'glycolic acid',
    'salicylic acid', 'azelaic acid', 'mandelic acid', 'kojic acid',
    'arbutin', 'licorice extract', 'centella asiatica', 'peptides',
    'retinol', 'retinaldehyde', 'retinyl palmitate', 'bakuchiol',
    'copper peptides', 'growth factors', 'snail mucin', 'hyaluronic acid'
  ],

  // Moderate risk ingredients (Medium Risk)
  moderate: [
    'sodium lauryl sulfate', 'sls', 'sodium laureth sulfate', 'sles',
    'ammonium lauryl sulfate', 'ammonium laureth sulfate',
    'cocamidopropyl betaine', 'decyl glucoside', 'lauryl glucoside',
    'cetearyl alcohol', 'cetyl alcohol', 'stearyl alcohol',
    'isopropyl alcohol', 'ethanol', 'denatured alcohol',
    'phenoxyethanol', 'methylparaben', 'propylparaben', 'butylparaben',
    'ethylhexylglycerin', 'caprylyl glycol', 'hexylene glycol',
    'propylene glycol', 'butylene glycol', 'pentylene glycol',
    'fragrance', 'parfum', 'limonene', 'linalool', 'citronellol',
    'benzyl alcohol', 'phenethyl alcohol', 'benzaldehyde',
    'sodium hydroxide', 'potassium hydroxide', 'triethanolamine',
    'diethanolamine', 'monoethanolamine', 'tromethamine',
    'edta', 'disodium edta', 'tetrasodium edta',
    'dmdm hydantoin', 'imidazolidinyl urea', 'diazolidinyl urea',
    'formaldehyde', 'quaternium-15', 'bronopol',
    'coal tar', 'resorcinol', 'hydroquinone', 'mercury',
    'lead acetate', 'chromium', 'nickel', 'cobalt',
    'triclosan', 'triclocarban', 'chlorhexidine'
  ],

  // High risk ingredients (High Risk)
  high: [
    'formaldehyde', 'formaldehyde releasers', 'methylisothiazolinone',
    'methylchloroisothiazolinone', 'iodopropynyl butylcarbamate',
    'phenoxyethanol (in high concentrations)', 'benzalkonium chloride',
    'benzethonium chloride', 'cetylpyridinium chloride',
    'triclosan', 'triclocarban', 'chlorhexidine gluconate',
    'mercury compounds', 'lead compounds', 'chromium compounds',
    'nickel compounds', 'cobalt compounds', 'arsenic compounds',
    'coal tar', 'resorcinol', 'hydroquinone', 'monobenzone',
    'corticosteroids', 'hydrocortisone', 'betamethasone',
    'clobetasol', 'triamcinolone', 'dexamethasone',
    'retinoids (prescription strength)', 'tretinoin', 'isotretinoin',
    'adapalene', 'tazarotene', 'benzoyl peroxide (high concentrations)',
    'salicylic acid (high concentrations)', 'glycolic acid (high concentrations)',
    'lactic acid (high concentrations)', 'citric acid (high concentrations)',
    'alpha hydroxy acids (high concentrations)', 'beta hydroxy acids (high concentrations)',
    'phenol', 'cresol', 'chlorocresol', 'thymol', 'eugenol',
    'camphor', 'menthol', 'peppermint oil', 'wintergreen oil',
    'methyl salicylate', 'capsaicin', 'cantharidin',
    'podophyllin', 'fluorouracil', 'imiquimod'
  ],

  // Allergens (High Risk for sensitive skin)
  allergens: [
    'fragrance', 'parfum', 'limonene', 'linalool', 'citronellol',
    'geraniol', 'citral', 'eugenol', 'isoeugenol', 'cinnamal',
    'cinnamyl alcohol', 'hydroxycitronellal', 'amyl cinnamal',
    'benzyl alcohol', 'benzyl salicylate', 'coumarin',
    'hydroxyisohexyl 3-cyclohexene carboxaldehyde',
    'methyl 2-octynoate', 'alpha-isomethyl ionone',
    'evernia prunastri extract', 'evernia furfuracea extract',
    'lanolin', 'lanolin alcohol', 'lanolin derivatives',
    'wool wax', 'wool fat', 'propylene glycol',
    'cocamidopropyl betaine', 'formaldehyde releasers',
    'methylisothiazolinone', 'methylchloroisothiazolinone',
    'iodopropynyl butylcarbamate', 'quaternium-15',
    'dmdm hydantoin', 'imidazolidinyl urea', 'diazolidinyl urea',
    '2-bromo-2-nitropropane-1,3-diol', 'bronopol',
    'methylparaben', 'propylparaben', 'butylparaben',
    'ethylparaben', 'isobutylparaben', 'benzylparaben',
    'phenoxyethanol', 'benzyl alcohol', 'chlorphenesin',
    'sorbic acid', 'potassium sorbate', 'sodium benzoate',
    'benzoic acid', 'dehydroacetic acid', 'sodium dehydroacetate',
    'tocopherol', 'tocopheryl acetate', 'vitamin e',
    'retinol', 'retinyl palmitate', 'retinaldehyde',
    'ascorbic acid', 'vitamin c', 'magnesium ascorbyl phosphate',
    'sodium ascorbyl phosphate', 'ascorbyl palmitate',
    'kojic acid', 'arbutin', 'licorice extract',
    'hydroquinone', 'monobenzone', 'mequinol',
    'azelaic acid', 'niacinamide', 'tranexamic acid',
    'alpha hydroxy acids', 'beta hydroxy acids',
    'glycolic acid', 'lactic acid', 'citric acid',
    'malic acid', 'tartaric acid', 'mandelic acid',
    'salicylic acid', 'betaine salicylate', 'capryloyl salicylic acid',
    'retinoids', 'tretinoin', 'isotretinoin', 'adapalene',
    'tazarotene', 'trifarotene', 'bakuchiol',
    'benzoyl peroxide', 'sulfur', 'resorcinol', 'coal tar',
    'dapsone', 'clindamycin', 'erythromycin', 'tetracycline',
    'minocycline', 'doxycycline', 'metronidazole',
    'azelaic acid', 'sodium sulfacetamide', 'sulfur',
    'permethrin', 'ivermectin', 'malathion', 'lindane',
    'crotamiton', 'benzyl benzoate', 'tea tree oil',
    'neem oil', 'eucalyptus oil', 'lavender oil',
    'rosemary oil', 'peppermint oil', 'wintergreen oil',
    'camphor', 'menthol', 'methyl salicylate',
    'capsaicin', 'cantharidin', 'podophyllin',
    'fluorouracil', 'imiquimod', 'ingenol mebutate',
    'diclofenac', 'hyaluronic acid', 'sodium hyaluronate',
    'chondroitin sulfate', 'glucosamine', 'collagen',
    'elastin', 'keratin', 'silk protein', 'soy protein',
    'wheat protein', 'rice protein', 'oat protein',
    'almond protein', 'coconut oil', 'palm oil',
    'olive oil', 'sunflower oil', 'safflower oil',
    'grapeseed oil', 'sesame oil', 'avocado oil',
    'shea butter', 'cocoa butter', 'mango butter',
    'kokum butter', 'illipe butter', 'cupuacu butter',
    'babassu oil', 'argan oil', 'jojoba oil',
    'rosehip oil', 'evening primrose oil', 'borage oil',
    'black currant oil', 'cranberry oil', 'pomegranate oil',
    'acai oil', 'goji oil', 'marula oil', 'baobab oil',
    'kukui nut oil', 'macadamia oil', 'hazelnut oil',
    'walnut oil', 'peanut oil', 'soybean oil',
    'canola oil', 'corn oil', 'cottonseed oil'
  ]
};

/**
 * Analyze ingredient and return risk level
 * @param {string} ingredient - Ingredient name
 * @returns {Object} Risk analysis result
 */
export function analyzeIngredient(ingredient) {
  if (!ingredient || typeof ingredient !== 'string') {
    return {
      riskLevel: 'unknown',
      warnings: ['Invalid ingredient name'],
      isAllergen: false
    };
  }

  const normalizedIngredient = ingredient.toLowerCase().trim();
  let riskLevel = 'low';
  const warnings = [];
  let isAllergen = false;

  // Check if ingredient is in high risk database
  if (INGREDIENT_DATABASE.high.some(item => normalizedIngredient.includes(item))) {
    riskLevel = 'high';
    warnings.push('High risk ingredient - use with caution');
    
    if (normalizedIngredient.includes('retinoid') || normalizedIngredient.includes('retinol')) {
      warnings.push('May cause irritation - start with low concentration');
      warnings.push('Use sunscreen daily');
    }
    
    if (normalizedIngredient.includes('acid') && (normalizedIngredient.includes('high') || normalizedIngredient.includes('strong'))) {
      warnings.push('High concentration acid - may cause burning or peeling');
    }
  }
  // Check if ingredient is in moderate risk database
  else if (INGREDIENT_DATABASE.moderate.some(item => normalizedIngredient.includes(item))) {
    riskLevel = 'medium';
    warnings.push('Moderate risk ingredient - may cause irritation in sensitive skin');
    
    if (normalizedIngredient.includes('alcohol') && !normalizedIngredient.includes('fatty')) {
      warnings.push('May be drying');
    }
    
    if (normalizedIngredient.includes('fragrance') || normalizedIngredient.includes('parfum')) {
      warnings.push('May cause allergic reactions');
    }
  }
  // Check if ingredient is in safe database
  else if (INGREDIENT_DATABASE.safe.some(item => normalizedIngredient.includes(item))) {
    riskLevel = 'low';
    // No warnings for safe ingredients
  }

  // Check if ingredient is a known allergen
  if (INGREDIENT_DATABASE.allergens.some(item => normalizedIngredient.includes(item))) {
    isAllergen = true;
    if (!warnings.includes('May cause allergic reactions')) {
      warnings.push('Known allergen - patch test recommended');
    }
  }

  return {
    riskLevel,
    warnings,
    isAllergen
  };
}

/**
 * Analyze multiple ingredients and calculate overall safety rating
 * @param {Array<string>} ingredients - Array of ingredient names
 * @returns {Object} Overall safety analysis
 */
export function analyzeProductIngredients(ingredients) {
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return {
      safetyRating: 'unknown',
      riskLevel: 'unknown',
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      allergenCount: 0,
      warnings: ['No ingredients provided'],
      ingredientAnalysis: []
    };
  }

  const analysis = ingredients.map(ing => analyzeIngredient(ing));
  
  const highRiskCount = analysis.filter(a => a.riskLevel === 'high').length;
  const mediumRiskCount = analysis.filter(a => a.riskLevel === 'medium').length;
  const lowRiskCount = analysis.filter(a => a.riskLevel === 'low').length;
  const allergenCount = analysis.filter(a => a.isAllergen).length;

  // Determine overall safety rating
  let safetyRating = 'safe';
  let riskLevel = 'low';
  const warnings = [];

  if (highRiskCount > 0) {
    safetyRating = 'warning';
    riskLevel = 'high';
    warnings.push(`Contains ${highRiskCount} high-risk ingredient(s)`);
  } else if (mediumRiskCount > 2) {
    safetyRating = 'caution';
    riskLevel = 'medium';
    warnings.push(`Contains ${mediumRiskCount} moderate-risk ingredients`);
  } else if (allergenCount > 0) {
    warnings.push(`Contains ${allergenCount} known allergen(s) - patch test recommended`);
  }

  // Add specific warnings from ingredient analysis
  analysis.forEach((item, index) => {
    if (item.warnings && item.warnings.length > 0) {
      warnings.push(`${ingredients[index]}: ${item.warnings.join(', ')}`);
    }
  });

  return {
    safetyRating,
    riskLevel,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    allergenCount,
    warnings: [...new Set(warnings)], // Remove duplicates
    ingredientAnalysis: analysis.map((item, index) => ({
      ingredient: ingredients[index],
      ...item
    }))
  };
}

/**
 * Get ingredient safety information
 * @param {string} ingredient - Ingredient name
 * @returns {Object} Ingredient safety info
 */
export function getIngredientInfo(ingredient) {
  const analysis = analyzeIngredient(ingredient);
  
  return {
    name: ingredient,
    ...analysis,
    description: getIngredientDescription(ingredient)
  };
}

/**
 * Get ingredient description (educational info)
 * @param {string} ingredient - Ingredient name
 * @returns {string} Description
 */
function getIngredientDescription(ingredient) {
  const normalizedIngredient = ingredient.toLowerCase();
  
  const descriptions = {
    'hyaluronic acid': 'A powerful humectant that can hold up to 1000x its weight in water, providing intense hydration to the skin.',
    'niacinamide': 'Also known as Vitamin B3, helps reduce inflammation, minimize pores, and improve skin texture.',
    'ceramides': 'Lipids that help maintain the skin barrier and prevent moisture loss.',
    'retinol': 'A form of Vitamin A that increases cell turnover, reduces fine lines, and improves skin texture. Start with low concentrations.',
    'salicylic acid': 'A beta hydroxy acid that exfoliates the skin and helps clear pores. Can be drying at high concentrations.',
    'glycolic acid': 'An alpha hydroxy acid that exfoliates and brightens the skin. May cause irritation in sensitive skin.',
    'zinc oxide': 'A physical sunscreen ingredient that provides broad-spectrum UV protection. Safe for sensitive skin.',
    'titanium dioxide': 'A physical sunscreen ingredient that reflects UV rays. Safe for sensitive skin.',
    'glycerin': 'A humectant that draws moisture to the skin. Gentle and suitable for all skin types.',
    'dimethicone': 'A silicone that creates a protective barrier on the skin. Non-comedogenic and suitable for sensitive skin.'
  };

  for (const [key, description] of Object.entries(descriptions)) {
    if (normalizedIngredient.includes(key)) {
      return description;
    }
  }

  return 'No additional information available for this ingredient.';
}

/**
 * Check if ingredient is safe for specific skin type
 * @param {string} ingredient - Ingredient name
 * @param {string} skinType - Skin type (dry, oily, combination, sensitive, normal)
 * @returns {Object} Compatibility analysis
 */
export function checkSkinTypeCompatibility(ingredient, skinType) {
  const normalizedIngredient = ingredient.toLowerCase();
  const analysis = analyzeIngredient(ingredient);
  
  let compatible = true;
  const warnings = [];

  switch (skinType) {
    case 'dry':
      if (normalizedIngredient.includes('alcohol') && !normalizedIngredient.includes('fatty')) {
        compatible = false;
        warnings.push('May be too drying for dry skin');
      }
      if (normalizedIngredient.includes('acid') && (normalizedIngredient.includes('high') || normalizedIngredient.includes('strong'))) {
        compatible = false;
        warnings.push('High concentration acids may be too harsh for dry skin');
      }
      break;

    case 'oily':
      if (normalizedIngredient.includes('oil') && !normalizedIngredient.includes('non-comedogenic')) {
        warnings.push('May contribute to oiliness');
      }
      break;

    case 'sensitive':
      if (analysis.riskLevel === 'high' || analysis.riskLevel === 'medium') {
        compatible = false;
        warnings.push('May cause irritation in sensitive skin');
      }
      if (analysis.isAllergen) {
        compatible = false;
        warnings.push('Known allergen - avoid if you have sensitive skin');
      }
      break;

    case 'combination':
      // Generally compatible, but watch for extremes
      if (normalizedIngredient.includes('alcohol') && !normalizedIngredient.includes('fatty')) {
        warnings.push('May be drying in dry areas');
      }
      break;

    default:
      // Normal skin - generally compatible
      break;
  }

  return {
    compatible,
    warnings,
    ...analysis
  };
}

export default {
  analyzeIngredient,
  analyzeProductIngredients,
  getIngredientInfo,
  checkSkinTypeCompatibility
};

