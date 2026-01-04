# Food Label Info – AI Ingredient Interpreter Requirements Document

## 1. Application Overview

### 1.1 Application Name\nFood Label Info – AI Ingredient Interpreter

### 1.2 Application Description
An AI-driven consumer web application that helps users understand food product labels effortlessly by interpreting ingredient lists and translating complex chemical, scientific, or regulatory language into clear, honest, human-friendly insights.

### 1.3 Core Value Proposition
Understand what's really in your food — in seconds.\n
## 2. Core Principles

- Interpret information on behalf of the user, not just display it
- Simplify without dumbing down
- Be transparent about uncertainty and evolving science
- Avoid fear-mongering
- Minimize friction and manual input
- Explain why this matters in plain language

## 3. Application Structure and Pages

### 3.1 Onboarding Flow
\n#### Welcome Screen
- Display value proposition: Understand what's really in your food — in seconds.\n- CTA button: Get Started
- Use image 2 i.jpeg as the visual reference for this screen

#### User Goal Selection
- Question: What best describes you right now?
- Options:\n  - Normal consumer
  - Fitness-focused
  - Health-conscious
  - Medical condition / sensitive (self-reported)
  - Curious / learning
- Use image 1 i.jpeg as the visual reference for this screen

#### Preference Configuration
- Avoid ingredients with (toggles/checkboxes):
  - High sugar
  - Artificial additives
  - Preservatives
  - Allergens
- Tone preference (radio buttons):
  - Simple
  - Balanced
  - Detailed
- Store these preferences for personalized explanations
- Use image 3 i.jpeg as the visual reference for this screen

### 3.2 Home Screen (Main Action Hub)
\n#### Primary Actions
- 📷 Scan Food Label (Camera) - Large, prominent button
- 📤 Upload Image from Local Storage - Secondary button
- ✍️ Paste / Type Ingredients or Food Items - Secondary button
- 🧪 Try a Sample Label (Mock Data) - Tertiary button
\n#### Secondary Information
- How it works (expandable explainer)
- Disclaimer: This app summarizes public research and regulatory guidance. It does not provide medical advice.\n\n### 3.3 Ingredient Input Handling

#### Image Scan Feature
- Support both phone camera and laptop webcam
- Show live camera preview with real-time scanning capability
- Real-time detection and identification:\n  - Continuously analyze camera feed to detect food items
  - Display detected food item name in real-time overlay
  - Show confidence level of detection
- When food item is detected:
  - Display food item name prominently
  - Extract ingredient list using OCR
  - Fetch accurate nutritional data from Nutrition.gov and FDA.gov
  - Cross-reference detected item with official databases to ensure data accuracy
- If no food item detected: Display No food item detected message
- Allow user to capture image to lock detection
- After capture:
  - Confirm detected food item name
  - Display extracted ingredient list
  - Allow user to edit OCR text if incorrect
- Require user confirmation before full analysis

#### Image Upload Feature
- Provide upload button to select image from local storage
- Accept common image formats: JPG, JPEG, PNG, HEIC, WEBP
- Display uploaded image preview
- Analyze uploaded image for food item detection:\n  - Identify food item name with high accuracy
  - Extract ingredient list using OCR
  - Fetch accurate nutritional data from Nutrition.gov and FDA.gov
  - Cross-reference detected item with official databases to ensure 100% data accuracy
- Display detected food item name prominently
- Show extracted ingredient list
- Allow user to edit OCR text if incorrect
- Require user confirmation before proceeding to full analysis
- Provide option to re-upload if detection fails or is inaccurate

#### Text Input Feature
- Provide text area for pasting or typing ingredient list or food item names
- Accept both comma-separated format (e.g., flour, sugar, salt) and paragraph format (e.g., full ingredient lists as they appear on packaging)
- Allow user to edit text before submitting for analysis
- No character limit or validation required
- Support multiple languages for ingredient names, with primary focus on English\n- Parse and process submitted text\n
#### Mock Data Feature
- Provide sample products:\n  - Packaged bread\n  - Instant noodles
  - Protein bar
  - Soft drink
\n### 3.4 Analysis Processing (Backend Logic)

When user submits ingredients (via camera scan, image upload, or text input), AI should:
- Parse ingredient list
- Identify:\n  - Additives\n  - Preservatives
  - Artificial colors/flavors
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

Display analysis results matching the visual style shown in uploaded images.\n
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

#### Section 2: Complete Ingredient List
- Display full list of all ingredients contained in the food item
- Present ingredients in order as they appear on the product label\n- Clearly indicate which ingredients are natural and which are not:
  - Natural ingredients: Marked with green indicator or Natural badge
  - Processed ingredients: Marked with orange indicator or Processed badge
  - Synthetic ingredients: Marked with red/orange indicator or Synthetic badge\n- Format as scannable list with clear visual separation
- Each ingredient should be clickable to view detailed breakdown

#### Section 3: Simplified Ingredient Summary
- Display total ingredient count
- Show ingredient composition breakdown:\n  - Visual bar chart with color coding:\n    - Green: Natural ingredients\n    - Orange: Processed ingredients
    - Red/Orange: Synthetic ingredients
  - Count for each category
- Brief summary text describing overall composition
- Use image 4 i.jpeg as the visual reference for this section

#### Section 4: Nutritional Content Overview
- Display accurate nutritional contents fetched from Nutrition.gov and FDA.gov:\n  - Calories
  - Protein
  - Carbohydrates
  - Fats (saturated and unsaturated)
  - Sugar
  - Sodium
  - Fiber
  - Vitamins and minerals (if available)
- Present in clear, scannable format
- Highlight notable values (high sugar, high sodium, etc.)
- Include data source attribution

#### Section 5: Allergen Information
- Display allergens the product may contain based on official data
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

#### Section 6: Health Impact Analysis
- Provide clear explanation of health benefits and concerns based on FDA.gov and Nutrition.gov data
- Structure as:
  - ✅ Health Benefits:\n    - List positive aspects (e.g., high in fiber, contains essential vitamins, good protein source)
    - Explain why these matter for health
  - ⚠️ Health Considerations:
    - List potential concerns (e.g., high sodium, added sugars, artificial additives)
    - Explain impact on health (e.g., may contribute to high blood pressure, not ideal for daily consumption)
- Use balanced, non-alarmist language
- Tailor explanations to user profile when relevant

#### Section 7: Overall Verdict
- Display verdict badge with appropriate color:\n  - Better choice (green background)
  - Occasional choice (yellow/orange background)
  - Not ideal for daily use (orange background)
- Provide context-appropriate explanation
- Use image 4 i.jpeg as the visual reference for this section

#### Section 8: Personalized Insight
- Section header: FOR A [USER GOAL]
- Tailored recommendation based on user profile:\n  - Normal consumer\n  - Fitness-focused\n  - Health-conscious
  - Medical condition / sensitive
- Explain suitability for occasional vs daily consumption
- Use image 4 i.jpeg as the visual reference for this section

#### Section 9: Ingredient-by-Ingredient Detailed Breakdown
- Display each ingredient as expandable card with accurate data from FDA.gov and Nutrition.gov:\n  - Ingredient name (plain English)
  - Classification badge with color indicator:\n    - Green: Natural\n    - Orange: Processed\n    - Red/Orange: Synthetic
  - Brief one-line description
  - Expandable details including:
    - Chemical name
    - Why it's used
    - Natural vs Non-Natural classification with clear explanation
    - Benefits (checkmark icon):\n      - List all known health benefits
      - Explain nutritional value
      - Describe positive effects on body
      - Include scientific evidence when available
    - Disadvantages (warning icon):
      - List all known health concerns
      - Explain potential negative effects
      - Describe risks for specific populations
      - Include dosage or consumption warnings
      - Mention long-term effects if applicable
    - Who should care more (person icon)
    - Evolving Science section (if applicable) with light background highlighting uncertainty
- Use images 5 i.jpeg, 6 i.jpeg, 7 i.jpeg, and 8 i.jpeg as visual references for this section

#### Section 10: Conflicting / Evolving Science
- Clearly label uncertainty when research is mixed
- Explain:\n  - What some studies say
  - What regulatory bodies allow
  - Why opinions differ
- Use distinct visual treatment (light yellow/beige background)
- Use image 8 i.jpeg as the visual reference for this section

#### Section 11: Sources & Credibility
- Expandable section: Where this information comes from
- List authoritative sources:\n  - FDA (Food & Drug Administration)
  - Nutrition.gov
  - EFSA (European Food Safety Authority)
  - WHO\n  - PubChem
  - NIH / NCBI
- Display disclaimer: This app summarizes public research and regulatory guidance. It does not provide medical advice. Always consult healthcare professionals for dietary concerns.

### 3.6 Ingredient Deep Dive Page (Optional)

When user taps an ingredient, display detailed view:
- Chemical name
- Common food uses
- Regulatory status
- Natural vs Non-Natural classification
- Comprehensive benefits:\n  - Nutritional advantages
  - Health benefits
  - Functional benefits in food
- Comprehensive disadvantages:
  - Health risks
  - Side effects
  - Contraindications
  - Population-specific concerns
- Known controversies\n- Current scientific consensus
- Sources cited

## 4. Data Sources\n
- FDA.gov (Food & Drug Administration) - Primary source for accurate ingredient and nutritional data
- Nutrition.gov - Primary source for accurate nutritional information
- EFSA (European Food Safety Authority)\n- WHO (World Health Organization)\n- PubChem (chemical context)\n- NIH / NCBI (scientific research)
\n## 5. UX and Interaction Guidelines

- Use tooltips instead of long text blocks
- Implement progressive disclosure (don't overload users)
- Maintain friendly, neutral tone throughout
- Avoid fear-based messaging
- Provide clear Why this matters explanations
- Use color indicators:\n  - Green: Natural/generally safe
  - Yellow/Orange: Processed/moderate concern
  - Avoid red panic colors
- Make content skimmable with clear hierarchy
- Support both mobile and desktop experiences
- Display real-time detection feedback during scanning
- Show data source attribution for transparency
- Clearly distinguish natural from non-natural ingredients throughout the interface
- Provide smooth upload experience with clear feedback
- Display upload progress and processing status

## 6. AI Behavior Guidelines

AI must:
- Admit uncertainty clearly
- Avoid absolute claims
- Explain why something matters to the user
- Personalize responses based on user profile
- Prefer insight over raw statistics
- Keep explanations skimmable
- Use accurate data from FDA.gov and Nutrition.gov\n- Clearly identify food items by name
- Cross-reference multiple authoritative sources
- Provide comprehensive benefits and disadvantages for each ingredient
- Clearly classify ingredients as natural or non-natural
- Ensure 100% accuracy when analyzing uploaded images
- Use language like:\n  - Better choice
  - Occasional choice
  - Not ideal for daily use
- Avoid language like:
  - Bad\n  - Toxic
  - Dangerous
\n## 7. Visual Design Requirements

- Clean, minimal UI
- Mobile-first responsive design
- Styled and eye-catching application name and logo in top left corner that blends beautifully with interface
- Real-time camera overlay showing detected food item name\n- Clear visual indicators for natural vs non-natural ingredients throughout the interface
- Upload button with clear icon and label
- Image preview area for uploaded images
- Match visual style shown in reference images:\n  - Card-based layout for ingredients
  - Color-coded classification badges:\n    - Green for Natural ingredients
    - Orange for Processed ingredients
    - Red/Orange for Synthetic ingredients
  - Expandable/collapsible sections\n  - Clear visual hierarchy
  - Appropriate use of icons (checkmarks, warnings, person icons)
  - Subtle background colors for special sections (evolving science)

## 8. Technical Requirements

- Support camera access for both mobile and desktop webcam
- Implement real-time image recognition and food item detection
- Real-time camera preview with continuous scanning\n- Display detected food item name in real-time overlay
- Implement image upload functionality:\n  - File picker for local storage access
  - Support for JPG, JPEG, PNG, HEIC, WEBP formats\n  - Image preview before analysis
  - File size validation and compression if needed
- Implement OCR for ingredient list extraction from both camera and uploaded images
- Food item detection capability with confidence scoring
- Integration with FDA.gov and Nutrition.gov APIs or data sources:\n  - Real-time data fetching from official databases
  - Accurate nutritional information retrieval
  - Ingredient safety and regulatory status lookup
  - Cross-reference capabilities for data accuracy
  - Comprehensive benefits and disadvantages data retrieval
  - Natural vs non-natural classification data
- AI-powered ingredient analysis and explanation generation
- User preference storage and retrieval
- Responsive design for all screen sizes
- Text input processing for multiple formats and languages
- Allergen detection and display functionality
- Data caching for improved performance
- Error handling for network issues or unavailable data
- Upload progress indicators and status messages

## 9. Future Considerations (Not in Current Scope)

- Compare two products side-by-side
- Save scanned products history
- Advanced dietary profiles (diabetic, lactose intolerant, etc.)\n- Region-based regulatory differences
- Offline scan cache\n\n## 10. Reference Files

1. UI Reference Images:
   - 2 i.jpeg (Welcome Screen)
   - 1 i.jpeg (User Goal Selection)
   - 3 i.jpeg (Preference Configuration)
   - 4 i.jpeg (Simplified Ingredient Summary, Overall Verdict, Personalized Insight)\n   - 5 i.jpeg (Ingredient Breakdown)\n   - 6 i.jpeg (Ingredient Breakdown)\n   - 7 i.jpeg (Ingredient Breakdown)
   - 8 i.jpeg (Ingredient Breakdown with Evolving Science)