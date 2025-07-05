# Space Viz
# 🌌 Space Research Visualization

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Deploy to Vercel](https://vercel.com/button)](https://v0-space-visualization-app.vercel.app/)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-000?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38b2ac?logo=tailwindcss)](https://tailwindcss.com/)

A futuristic and interactive web application that visualizes real-time space data from NASA and other sources. This project bridges the gap between complex research and public understanding using intuitive UI, powerful APIs, and elegant visuals.

---

## 🚀 Live Preview

🔗 **[Launch the App](https://v0-space-visualization-app.vercel.app/)** – Explore the cosmos through an immersive interface.

---

## 📁 Table of Contents

- [📦 Installation & Setup](#-installation--setup)
- [💡 Features](#-features)
- [🧩 Tech Stack & Dependencies](#-tech-stack--dependencies)
- [📐 Folder Structure](#-folder-structure)
- [🎯 Future Enhancements](#-future-enhancements)
- [🤝 Contribution Guide](#-contribution-guide)
- [📄 License](#-license)

---

## 📦 Installation & Setup

### 🔧 Prerequisites

- Node.js (v18 or above)
- npm or yarn

### ⚙️ Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/stephenrodrick/space-research.git
cd space-research
````

2. **Install dependencies**

```bash
npm install
```

3. **Create environment variables**

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_NASA_API_KEY
NEXT_PUBLIC_WEATHER_API_KEY
NEXT_N2YO Satellite API_KEY
NEXT_Cesium Ion_KEY
```

4. **Run the development server**

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 💡 Features

✨ **NASA Data Visualizer**
Displays Astronomy Picture of the Day (APOD), Mars Rover photos, and other datasets using dynamic API calls.

✨ **Mission Explorer**
Showcases key space missions in an engaging scroll-based format.

✨ **Responsive Design**
Mobile-first, adaptive layouts using Tailwind CSS and Shadcn/UI components.

✨ **Clean & Minimal UI**
Styled using Vercel’s v0 layout engine, optimized for readability and speed.

✨ **Real-Time APIs**
Data fetched from NASA and weather APIs with minimal delay and intelligent fallback handling.

✨ **Dark Mode & Accessibility**
High-contrast UI and screen-reader-friendly elements for maximum accessibility.

---

## 🧩 Tech Stack & Dependencies

| Technology        | Role                                   |
| ----------------- | -------------------------------------- |
| **Next.js**       | React framework for full-stack dev     |
| **Tailwind CSS**  | Styling using utility-first classes    |
| **Shadcn/UI**     | Modern accessible UI components        |
| **Lucide Icons**  | Beautiful vector icon library          |
| **Framer Motion** | Animations and transitions             |
| **Recharts**      | Data visualization and graph rendering |
| **Vercel**        | Hosting and deployment platform        |

**APIs Used:**

* [NASA Open APIs](https://api.nasa.gov) – APOD, Mars Rovers, satellite data, etc.
* [OpenWeatherMap API](https://openweathermap.org/api) – For launch site climate data
* [CesiumIon](https://cesium.com/platform/cesium-ion/api)- 3D geospatial platform for Earth visualization
* [Wikipedia API](https://www.wikipedia.org/) - Access to Wikipedia articles for space topics
---

## 📐 Folder Structure

```
space-research/
├── components/         # Reusable UI components
├── pages/              # Application pages (e.g., index.tsx)
├── public/             # Static assets (images, icons)
├── styles/             # Tailwind & global CSS files
├── utils/              # Helper functions and API configs
├── .env.local          # Environment variables (ignored in git)
└── README.md           # Project documentation
```

---

## 🎯 Future Enhancements

* 🔮 **AI Data Summarizer** – Use GPT models to summarize NASA datasets
* 🌍 **3D Earth/Orbit Simulation** – Integrate Three.js for satellite visualization
* 📅 **Mission Timeline** – Chronological slider of major space missions
* 🧠 **Voice Assistant** – Ask questions about planets, missions, or space events
* 📡 **Live Satellite Tracker** – NORAD-based real-time positioning

---

## 🤝 Contribution Guide

We welcome all kinds of contributions — from code fixes and feature additions to documentation improvements.

### 🛠 How to Contribute

1. Fork this repository
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to your branch: `git push origin feature-name`
5. Open a Pull Request

Feel free to open issues for discussion or bug reports.

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for more details.

---

> 🛰️ Designed & Developed by [Stephen Rodrick](https://github.com/stephenrodrick)
> Deployed by our Team Ctrl alt elite.
> Powered by Open APIs, open source tech, and a love for the stars. 🌠


