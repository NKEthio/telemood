# TeleMood: High-Energy Satirical Program Tracker & Mood Guide for Fire TV

> *"Never miss the absurdly specific television moments that fit your exact vibe."*

**TeleMood** is a lightweight, high-energy 10-foot UI app engineered for Amazon Fire TV (Fire OS/Vega OS webview environments). Inspired by comedic absurdism and the hyper-specific realities of modern television, TeleMood transforms passive TV guide browsing into an interactive, mood-driven viewing itinerary.

## 🌟 Key Features

* **10-Foot UI Design:** Native D-pad navigation support (arrow keys + enter) with high-contrast, scalable focused cards designed for living room TV viewing.

* **Absurdly Specific Program Guide:** Curated, satirical TV schedules highlighting chaotic, niche television events (e.g., *Late Night Arguments with an Empty Refrigerator*).

* **The "Mood Itinerary" Engine:** A high-energy recommender that dynamically builds a tailored watch list based on the viewer's current emotional state or energy level.

* **Low-Resource Architecture:** Fully client-side rendered with zero heavy dependencies—optimized to run smoothly on any TV simulator or low-RAM development machine.

## 🛠️ Tech Stack

* **Framework:** Next.js / React

* **Styling:** Tailwind CSS (Focus state & living room TV contrast optimization)

* **Input Controller:** Custom JavaScript D-pad / Keyboard Listener Hook (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Enter`)

* **Platform Target:** Amazon Fire TV (Fire OS Webview)

## 🚀 Getting Started

### Prerequisites

* Node.js 18.x or higher

* npm or yarn

### Installation & Local Setup

1. **Clone the repository:**

   ```
   git clone https://github.com/NKEthio/telemood.git
   cd telemood
   
   ```

2. **Install dependencies:**

   ```
   npm install
   
   ```

3. **Run the development server:**

   ```
   npm run dev
   
   ```

4. **Open in Browser / Fire TV Webview Simulator:**
   Navigate to `http://localhost:3000`. Use your **Keyboard Arrow Keys** and **Enter** key to simulate a Fire TV remote D-pad controller.

## 🎮 Remote Control Layout

* `Arrow Keys`: Move focus between schedule cards and category tabs.

* `Enter`: Open show details or trigger the "Mood Itinerary" generator.

* `Escape` / `Back`: Return to the main grid view.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.