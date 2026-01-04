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
- Show live camera preview before capturing
- Allow user to capture image
- After capture:
  - If no food item detected: Display No food item detected message
  - If food item detected: Extract ingredient list using OCR\n- Allow user to edit OCR text if incorrect
- Require user confirmation before analysis\n
#### Text Input Feature\n- Provide text area for pasting or typing ingredient list or food item names
- Accept both comma-separated format (e.g., flour, sugar, salt) and paragraph format (e.g., full ingredient lists as they appear on packaging)
- Allow user to edit text before submitting for analysis
- No character limit or validation required
- Support multiple languages for ingredient names, with primary focus on English
- Parse and process submitted text

#### Mock Data Feature
- Provide sample products:
  - Packaged bread
  - Instant noodles
  - Protein bar
  - Soft drink

### 3.4 Analysis Processing (Backend Logic)\n
When user submits ingredients, AI should:
- Parse ingredient list
- Identify:\n  - Additives
  - Preservatives
  - Artificial colors/flavors\n  - Sweeteners
  - Emulsifiers
- Classify each ingredient:
  - Natural / Processed / Synthetic
- Cross-reference with FDA and Nutrition.gov data sources\n- Generate human-level explanations
- Adjust tone and depth based on user profile
- Highlight conflicting or evolving research when applicable

### 3.5 Results Screen (Primary Output)

Display analysis results matching the visual style shown in uploaded images.\n
#### Header Section: Application Branding
- Position application name and logo in top left corner
- Design requirements:
  - Styled and eye-catching presentation
  - Beautiful visual treatment that blends seamlessly with overall interface
  - Logo should be distinctive and memorable
  - Maintain consistent branding across all pages
\n#### Section 1: Simplified Ingredient Summary
- Display total ingredient count
- Show ingredient composition breakdown:
  - Visual bar chart with color coding:
    - Green: Natural ingredients
    - Orange: Processed ingredients
    - Red/Orange: Synthetic ingredients\n  - Count for each category\n- Brief summary text describing overall composition
- Use image 4 i.jpeg as the visual reference for this section

#### Section 2: Nutritional Content Overview
- Display key nutritional contents:
  - Calories
  - Protein
  - Carbohydrates
  - Fats (saturated and unsaturated)
  - Sugar
  - Sodium
  - Fiber
  - Vitamins and minerals (if available)
- Present in clear, scannable format
- Highlight notable values (high sugar, high sodium, etc.)

#### Section 3: Allergen Information
- Display allergens the product may contain
- Common allergens to check:
  - Milk
  - Eggs
  - Fish
  - Shellfish\n  - Tree nuts
  - Peanuts
  - Wheat
  - Soybeans
  - Sesame\n- Use clear warning icon or badge
- Highlight allergens prominently for user safety
- Include cross-contamination warnings if applicable

#### Section 4: Health Impact Analysis
- Provide clear explanation of health benefits and concerns
- Structure as:
  - ✅ Health Benefits:
    - List positive aspects (e.g., high in fiber, contains essential vitamins, good protein source)
    - Explain why these matter for health
  - ⚠️ Health Considerations:
    - List potential concerns (e.g., high sodium, added sugars, artificial additives)
    - Explain impact on health (e.g., may contribute to high blood pressure, not ideal for daily consumption)
- Use balanced, non-alarmist language
- Tailor explanations to user profile when relevant

#### Section 5: Overall Verdict
- Display verdict badge with appropriate color:
  - Better choice (green background)
  - Occasional choice (yellow/orange background)
  - Not ideal for daily use (orange background)
- Provide context-appropriate explanation
- Use image 4 i.jpeg as the visual reference for this section\n
#### Section 6: Personalized Insight
- Section header: FOR A [USER GOAL]\n- Tailored recommendation based on user profile:
  - Normal consumer
  - Fitness-focused
  - Health-conscious\n  - Medical condition / sensitive\n- Explain suitability for occasional vs daily consumption
- Use image 4 i.jpeg as the visual reference for this section

#### Section 7: Ingredient-by-Ingredient Breakdown
- Display each ingredient as expandable card:
  - Ingredient name (plain English)
  - Classification badge with color indicator:
    - Green: Natural
    - Orange: Processed
    - Red/Orange: Synthetic
  - Brief one-line description\n  - Expandable details including:
    - Chemical name
    - Why it's used
    - Benefits (checkmark icon)\n    - Considerations (warning icon)
    - Who should care more (person icon)
    - Evolving Science section (if applicable) with light background highlighting uncertainty
- Use images 5 i.jpeg, 6 i.jpeg, 7 i.jpeg, and 8 i.jpeg as visual references for this section

#### Section 8: Conflicting / Evolving Science
- Clearly label uncertainty when research is mixed
- Explain:
  - What some studies say
  - What regulatory bodies allow
  - Why opinions differ
- Use distinct visual treatment (light yellow/beige background)
- Use image 8 i.jpeg as the visual reference for this section

#### Section 9: Sources & Credibility
- Expandable section: Where this information comes from\n- List authoritative sources:
  - FDA (Food & Drug Administration)
  - Nutrition.gov
  - EFSA (European Food Safety Authority)
  - WHO
  - PubChem
  - NIH / NCBI
- Display disclaimer: This app summarizes public research and regulatory guidance. It does not provide medical advice. Always consult healthcare professionals for dietary concerns.

### 3.6 Ingredient Deep Dive Page (Optional)

When user taps an ingredient, display detailed view:
- Chemical name
- Common food uses
- Regulatory status
- Known controversies
- Current scientific consensus
- Sources cited
\n## 4. Data Sources\n
- FDA.gov (Food & Drug Administration)
- Nutrition.gov
- EFSA (European Food Safety Authority)
- WHO (World Health Organization)
- PubChem (chemical context)
- NIH / NCBI (scientific research)

## 5. UX and Interaction Guidelines

- Use tooltips instead of long text blocks\n- Implement progressive disclosure (don't overload users)
- Maintain friendly, neutral tone throughout
- Avoid fear-based messaging\n- Provide clear Why this matters explanations
- Use color indicators:
  - Green: Natural/generally safe
  - Yellow/Orange: Processed/moderate concern\n  - Avoid red panic colors
- Make content skimmable with clear hierarchy
- Support both mobile and desktop experiences

## 6. AI Behavior Guidelines

AI must:\n- Admit uncertainty clearly
- Avoid absolute claims
- Explain why something matters to the user
- Personalize responses based on user profile
- Prefer insight over raw statistics
- Keep explanations skimmable
- Use language like:
  - Better choice
  - Occasional choice
  - Not ideal for daily use
- Avoid language like:
  - Bad
  - Toxic
  - Dangerous

## 7. Visual Design Requirements

- Clean, minimal UI
- Mobile-first responsive design
- Styled and eye-catching application name and logo in top left corner that blends beautifully with interface
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
- Implement OCR for ingredient list extraction
- Real-time camera preview before capture
- Food item detection capability
- Integration with FDA.gov and Nutrition.gov data
- AI-powered ingredient analysis and explanation generation
- User preference storage and retrieval\n- Responsive design for all screen sizes
- Text input processing for multiple formats and languages
- Allergen detection and display functionality

## 9. Future Considerations (Not in Current Scope)

- Compare two products side-by-side
- Save scanned products history
- Advanced dietary profiles (diabetic, lactose intolerant, etc.)
- Region-based regulatory differences
- Offline scan cache\n
## 10. Reference Files

1. UI Reference Images:
   - 2 i.jpeg (Welcome Screen)\n   - 1 i.jpeg (User Goal Selection)
   - 3 i.jpeg (Preference Configuration)
   - 4 i.jpeg (Simplified Ingredient Summary, Overall Verdict, Personalized Insight)
   - 5 i.jpeg (Ingredient Breakdown)
   - 6 i.jpeg (Ingredient Breakdown)
   - 7 i.jpeg (Ingredient Breakdown)
   - 8 i.jpeg (Ingredient Breakdown with Evolving Science)