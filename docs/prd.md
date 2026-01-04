# Food Label Info – AI Ingredient Interpreter Requirements Document

## 1. Application Overview
\n### 1.1 Application Name
Food Label Info – AI Ingredient Interpreter

### 1.2 Application Description
An AI-driven consumer web application that helps users understand food product labels effortlessly by interpreting ingredient lists and translating complex chemical, scientific, or regulatory language into clear, honest, human-friendly insights.
\n### 1.3 Core Value Proposition
Understand what's really in your food — in seconds.

## 2. Core Principles

- Interpret information on behalf of the user, not just display it
- Simplify without dumbing down
- Be transparent about uncertainty and evolving science
- Avoid fear-mongering
- Minimize friction and manual input
- Explain why this matters in plain language

## 3. Application Structure and Pages

### 3.1 Onboarding Flow

#### Welcome Screen
- Display value proposition: Understand what's really in your food — in seconds.
- CTA button: Get Started
- Use image 2 i.jpeg as the visual reference for this screen\n
#### User Goal Selection\n- Question: What best describes you right now?
- Options:
  - Normal consumer
  - Fitness-focused
  - Health-conscious
  - Medical condition / sensitive (self-reported)\n  - Curious / learning\n- Use image 1 i.jpeg as the visual reference for this screen

#### Preference Configuration
- Avoid ingredients with (toggles/checkboxes):
  - High sugar
  - Artificial additives
  - Preservatives
  - Allergens
- Tone preference (radio buttons):
  - Simple
  - Balanced
  - Detailed\n- Store these preferences for personalized explanations
- Use image 3 i.jpeg as the visual reference for this screen

### 3.2 Home Screen (Main Action Hub)

#### Primary Actions
- 📷 Scan Food Label (Camera) - Large, prominent button
- ✍️ Paste / Type Ingredients or Food Items - Secondary button
- 🧪 Try a Sample Label (Mock Data) - Tertiary button\n
#### Secondary Information
- How it works (expandable explainer)
- Disclaimer: This app summarizes public research and regulatory guidance. It does not provide medical advice.\n
### 3.3 Ingredient Input Handling

#### Image Scan Feature\n- Support both phone camera and laptop webcam
- Show live camera preview with real-time scanning capability
- Real-time detection and identification:\n  - Continuously analyze camera feed to detect food items
  - Display detected food item name in real-time overlay
  - Show confidence level of detection
- When food item is detected:
  - Display food item name prominently
  - Extract ingredient list using OCR
  - Fetch accurate nutritional data from Nutrition.gov and FDA.gov\n  - Cross-reference detected item with official databases to ensure data accuracy
- If no food item detected: Display No food item detected message
- Allow user to capture image to lock detection
- After capture:
  - Confirm detected food item name
  - Display extracted ingredient list
  - Allow user to edit OCR text if incorrect
- Require user confirmation before full analysis

#### Text Input Feature
- Provide text area for pasting or typing ingredient list or food item names
- Accept both comma-separated format (e.g., flour, sugar, salt) and paragraph format (e.g., full ingredient lists as they appear on packaging)\n- Allow user to edit text before submitting for analysis
- No character limit or validation required
- Support multiple languages for ingredient names, with primary focus on English
- Parse and process submitted text

#### Mock Data Feature
- Provide sample products:
  - Packaged bread
  - Instant noodles
  - Protein bar
  - Soft drink

### 3.4 Analysis Processing (Backend Logic)

When user submits ingredients, AI should:
- Parse ingredient list
- Identify:
  - Additives
  - Preservatives\n  - Artificial colors/flavors
  - Sweeteners
  - Emulsifiers
- Classify each ingredient:\n  - Natural / Processed / Synthetic
- Fetch accurate data from FDA.gov and Nutrition.gov:\n  - Query official databases for ingredient information
  - Retrieve nutritional content data
  - Obtain regulatory status and safety information
  - Cross-reference multiple sources for accuracy
- Generate human-level explanations
- Adjust tone and depth based on user profile
- Highlight conflicting or evolving research when applicable

### 3.5 Results Screen (Primary Output)

Display analysis results matching the visual style shown in uploaded images.

#### Header Section: Application Branding
- Position application name and logo in top left corner
- Design requirements:
  - Styled and eye-catching presentation
  - Beautiful visual treatment that blends seamlessly with overall interface
  - Logo should be distinctive and memorable
  - Maintain consistent branding across all pages
\n#### Section 1: Detected Food Item Name
- Display accurately identified food item name prominently
- Show product brand if detected
- Include confidence level indicator\n- Allow user to correct if misidentified
\n#### Section 2: Simplified Ingredient Summary
- Display total ingredient count
- Show ingredient composition breakdown:
  - Visual bar chart with color coding:
    - Green: Natural ingredients
    - Orange: Processed ingredients
    - Red/Orange: Synthetic ingredients\n  - Count for each category\n- Brief summary text describing overall composition
- Use image 4 i.jpeg as the visual reference for this section

#### Section 3: Nutritional Content Overview
- Display accurate nutritional contents fetched from Nutrition.gov and FDA.gov:\n  - Calories
  - Protein
  - Carbohydrates
  - Fats (saturated and unsaturated)
  - Sugar\n  - Sodium
  - Fiber
  - Vitamins and minerals (if available)\n- Present in clear, scannable format
- Highlight notable values (high sugar, high sodium, etc.)
- Include data source attribution

#### Section 4: Allergen Information
- Display allergens the product may contain based on official data
- Common allergens to check:
  - Milk
  - Eggs
  - Fish
  - Shellfish
  - Tree nuts
  - Peanuts
  - Wheat
  - Soybeans
  - Sesame
- Use clear warning icon or badge
- Highlight allergens prominently for user safety
- Include cross-contamination warnings if applicable

#### Section 5: Health Impact Analysis\n- Provide clear explanation of health benefits and concerns based on FDA.gov and Nutrition.gov data
- Structure as:
  - ✅ Health Benefits:
    - List positive aspects (e.g., high in fiber, contains essential vitamins, good protein source)
    - Explain why these matter for health\n  - ⚠️ Health Considerations:
    - List potential concerns (e.g., high sodium, added sugars, artificial additives)
    - Explain impact on health (e.g., may contribute to high blood pressure, not ideal for daily consumption)
- Use balanced, non-alarmist language
- Tailor explanations to user profile when relevant
\n#### Section 6: Overall Verdict
- Display verdict badge with appropriate color:
  - Better choice (green background)
  - Occasional choice (yellow/orange background)\n  - Not ideal for daily use (orange background)
- Provide context-appropriate explanation
- Use image 4 i.jpeg as the visual reference for this section

#### Section 7: Personalized Insight
- Section header: FOR A [USER GOAL]\n- Tailored recommendation based on user profile:
  - Normal consumer
  - Fitness-focused
  - Health-conscious\n  - Medical condition / sensitive\n- Explain suitability for occasional vs daily consumption
- Use image 4 i.jpeg as the visual reference for this section

#### Section 8: Ingredient-by-Ingredient Breakdown
- Display each ingredient as expandable card with accurate data from FDA.gov and Nutrition.gov:\n  - Ingredient name (plain English)
  - Classification badge with color indicator:
    - Green: Natural
    - Orange: Processed
    - Red/Orange: Synthetic
  - Brief one-line description
  - Expandable details including:
    - Chemical name
    - Why it's used
    - Benefits (checkmark icon)
    - Considerations (warning icon)
    - Who should care more (person icon)
    - Evolving Science section (if applicable) with light background highlighting uncertainty
- Use images 5 i.jpeg, 6 i.jpeg, 7 i.jpeg, and 8 i.jpeg as visual references for this section

#### Section 9: Conflicting / Evolving Science
- Clearly label uncertainty when research is mixed
- Explain:
  - What some studies say
  - What regulatory bodies allow
  - Why opinions differ
- Use distinct visual treatment (light yellow/beige background)\n- Use image 8 i.jpeg as the visual reference for this section

#### Section 10: Sources & Credibility\n- Expandable section: Where this information comes from
- List authoritative sources:
  - FDA (Food & Drug Administration)
  - Nutrition.gov
  - EFSA (European Food Safety Authority)
  - WHO
  - PubChem
  - NIH / NCBI
- Display disclaimer: This app summarizes public research and regulatory guidance. It does not provide medical advice. Always consult healthcare professionals for dietary concerns.\n
### 3.6 Ingredient Deep Dive Page (Optional)

When user taps an ingredient, display detailed view:
- Chemical name
- Common food uses
- Regulatory status
- Known controversies\n- Current scientific consensus
- Sources cited

## 4. Data Sources

- FDA.gov (Food & Drug Administration) - Primary source for accurate ingredient and nutritional data
- Nutrition.gov - Primary source for accurate nutritional information
- EFSA (European Food Safety Authority)\n- WHO (World Health Organization)\n- PubChem (chemical context)
- NIH / NCBI (scientific research)

## 5. UX and Interaction Guidelines

- Use tooltips instead of long text blocks
- Implement progressive disclosure (don't overload users)
- Maintain friendly, neutral tone throughout
- Avoid fear-based messaging
- Provide clear Why this matters explanations
- Use color indicators:
  - Green: Natural/generally safe
  - Yellow/Orange: Processed/moderate concern
  - Avoid red panic colors
- Make content skimmable with clear hierarchy
- Support both mobile and desktop experiences
- Display real-time detection feedback during scanning
- Show data source attribution for transparency

## 6. AI Behavior Guidelines

AI must:
- Admit uncertainty clearly
- Avoid absolute claims
- Explain why something matters to the user
- Personalize responses based on user profile\n- Prefer insight over raw statistics
- Keep explanations skimmable
- Use accurate data from FDA.gov and Nutrition.gov\n- Clearly identify food items by name
- Cross-reference multiple authoritative sources
- Use language like:
  - Better choice
  - Occasional choice\n  - Not ideal for daily use
- Avoid language like:\n  - Bad
  - Toxic
  - Dangerous

## 7. Visual Design Requirements

- Clean, minimal UI
- Mobile-first responsive design
- Styled and eye-catching application name and logo in top left corner that blends beautifully with interface\n- Real-time camera overlay showing detected food item name
- Match visual style shown in reference images:
  - Card-based layout for ingredients
  - Color-coded classification badges:
    - Green for Natural ingredients
    - Orange for Processed ingredients
    - Red/Orange for Synthetic ingredients
  - Expandable/collapsible sections
  - Clear visual hierarchy
  - Appropriate use of icons (checkmarks, warnings, person icons)
  - Subtle background colors for special sections (evolving science)

## 8. Technical Requirements

- Support camera access for both mobile and desktop webcam
- Implement real-time image recognition and food item detection
- Real-time camera preview with continuous scanning
- Display detected food item name in real-time overlay
- Implement OCR for ingredient list extraction
- Food item detection capability with confidence scoring
- Integration with FDA.gov and Nutrition.gov APIs or data sources:\n  - Real-time data fetching from official databases
  - Accurate nutritional information retrieval
  - Ingredient safety and regulatory status lookup
  - Cross-reference capabilities for data accuracy
- AI-powered ingredient analysis and explanation generation\n- User preference storage and retrieval
- Responsive design for all screen sizes
- Text input processing for multiple formats and languages
- Allergen detection and display functionality\n- Data caching for improved performance
- Error handling for network issues or unavailable data

## 9. Future Considerations (Not in Current Scope)

- Compare two products side-by-side
- Save scanned products history
- Advanced dietary profiles (diabetic, lactose intolerant, etc.)
- Region-based regulatory differences
- Offline scan cache

## 10. Reference Files

1. UI Reference Images:
   - 2 i.jpeg (Welcome Screen)
   - 1 i.jpeg (User Goal Selection)\n   - 3 i.jpeg (Preference Configuration)
   - 4 i.jpeg (Simplified Ingredient Summary, Overall Verdict, Personalized Insight)\n   - 5 i.jpeg (Ingredient Breakdown)
   - 6 i.jpeg (Ingredient Breakdown)
   - 7 i.jpeg (Ingredient Breakdown)
   - 8 i.jpeg (Ingredient Breakdown with Evolving Science)