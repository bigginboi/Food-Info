# 🍽️ Food-Info — AI-Native Food Understanding

Food-Info is an **AI-native web application** that helps users understand packaged food **at the moment of decision**.  
Instead of listing ingredients, the system **reasons about what matters**, explains **trade-offs**, and communicates **uncertainty** clearly.

This project is designed as a **co-pilot**, not a database.

---

## ✨ What Makes This Different

- 🤖 **AI-first experience** — AI speaks first, no filters or forms  
- 🧠 **Reasoning over retrieval** — explains *why* something matters  
- ⚖️ **Balanced output** — benefits, trade-offs, and uncertainty  
- 🎯 **Decision-focused** — optimized for real-world use, not data overload  

---

## 🗂️ Project Structure

```text
├── README.md              # Project documentation
├── components.json        # UI component configuration
├── index.html             # Application entry
├── package.json           # Dependency management
├── postcss.config.js      # PostCSS configuration
├── public                 # Static assets
│   ├── favicon.png
│   └── images
├── src                    # Source code
│   ├── App.tsx
│   ├── main.tsx
│   ├── routes.tsx
│   ├── index.css
│   ├── components         # UI components
│   ├── context            # Global context
│   ├── hooks              # Custom hooks
│   ├── layout             # Layout components
│   ├── pages              # Application pages
│   ├── services           # Supabase / data services
│   ├── lib                # Utilities
│   └── types              # Type definitions
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
