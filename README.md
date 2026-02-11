# The Stoic Dad 🛡️

> **Master yourself. Lead your family.**

A modern web application that transforms ancient Stoic philosophy into practical daily guidance for fathers. Built with Next.js, TypeScript, and Tailwind CSS.

---

## ✨ Features

### 🎓 Learning System
- **30 Progressive Modules**: From Dichotomy of Control to The Final Exam
- **Interactive Quizzes**: Knowledge checks with instant feedback
- **Scenario-Based Learning**: Real-world parenting challenges with Stoic solutions

### 🔥 Habit Formation
- **Daily Streak Tracking**: Build consistency with visual motivation
- **Progress Visualization**: Circular progress ring shows completion status
- **Milestone Rewards**: Inspirational quotes unlock at 3, 7, and 30-day streaks

### 🛡️ Crisis Support
- **Emergency Toolkit**: Quick-access FAB button for moments of overwhelm
- **4 Stoic Protocols**:
  - Dichotomy of Control
  - View From Above
  - Memento Mori
  - Tactical Pause

### 📓 Personal Growth
- **Reflection Journal**: Private notes for each module
- **Analytics Dashboard**: Track virtue mastery (Courage, Temperance, Justice, Wisdom)
- **Performance Metrics**: Monitor quiz scores and completion rate

### 🎨 Premium UX
- **Dark Mode Design**: Slate 900 background with Amber 500 accents
- **Smooth Animations**: Glow, shimmer, float effects
- **Responsive Layout**: Mobile-first with desktop sidebar
- **Glassmorphism**: Modern, polished aesthetic

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 How to Use

### First-Time Users
1. **Welcome Modal** guides you through the app's value
2. **Module 1** is unlocked by default
3. Complete the quiz to unlock the next module

### Daily Practice
1. **Check your streak** on the dashboard
2. **Choose a module** from "The Path"
3. **Read the lesson** and reflect on the daily challenge
4. **Take the quiz** to test your understanding
5. **Add journal notes** to deepen retention

### Crisis Moments
1. Click the **red shield button** (bottom-right)
2. Select the appropriate Stoic protocol
3. Follow the guided technique
4. Return to the present moment

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main application
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles + animations
├── components/               # Core Stoic Dad components
├── data/
│   ├── index.ts              # 30-Day course data registry
│   └── modules/              # Individual daily module files
├── store/
│   └── useCourseStore.ts     # Unified Zustand state management
└── lib/
    ├── gamification.ts       # XP and Level logic
    ├── schemas.ts            # Zod validation schemas
    └── utils.ts              # Utility functions
```

---

## 🧬 Genetic Evolution Script

The project includes a sophisticated `scripts/evolve.js` engine that allows the application to "evolve" its own content:

- **Mutation Engine**: Automatically varies headlines and marketing copy.
- **Genetic Loops**: Can be run in `--batch` mode to test 1000s of variations.
- **Auto-Commit**: Automatically git-commits successful "evolutions" after build verification.
- **Daemon Mode**: Can run as a background process to continuously improve the PWA's messaging.

```bash
# Run a single evolution mutation
npm run evolve

# Run a batch of 10 mutations
node scripts/evolve.js --batch 10

# Run the evolution daemon
npm run evolve:daemon
```

---

## 💾 Data Persistence

All user progress is stored in **localStorage**:

| Key | Description |
|-----|-------------|
| `stoic-dad-progress` | Highest unlocked module |
| `stoic-dad-completed` | Array of completed module IDs |
| `stoic-dad-streak` | Current daily streak |
| `stoic-dad-longest-streak` | Personal best streak |
| `stoic-dad-last-checkin` | Last activity date |
| `stoic-dad-welcomed` | First-time onboarding flag |
| `stoic-dad-journal-{id}` | Per-module reflection notes |

---

## 🎯 Course Curriculum

1. **The Dichotomy of Control** - Focus only on what you can control
2. **Memento Mori** - Use death awareness to fuel presence
3. **The View From Above** - Cosmic perspective for small problems
4. **Premeditatio Malorum** - Prepare for adversity
5. **Voluntary Discomfort** - Build antifragility in children
6. **The Stoic Courage** - Face fear with rational assessment
7. **The Temperate Father** - Master impulses and desires
8. **The Just Patriarch** - Fairness, service, and social duty
9. **The Legacy of Wisdom** - Refine your worldview
10. **The Final Exam** - Operational readiness assessment

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Canvas Confetti
- **Utilities**: clsx, tailwind-merge
- **Validation**: Zod

---

## 🎨 Design System

### Colors
- **Background**: Slate 950
- **Cards**: Slate 900/800
- **Primary**: Amber 500
- **Text**: Slate 50/300/400

### Typography
- **Font**: Inter (Google Fonts)
- **Heading**: Bold, tight tracking
- **Body**: Relaxed line-height (1.7)

### Components
- `.btn-primary` - Amber CTA with shadow
- `.btn-secondary` - Slate ghost button
- `.glass-card` - Glassmorphism effect
- `.badge-*` - Contextual status badges

---

## 📖 Philosophy

### Why Stoicism for Fathers?

> "The impediment to action advances action. What stands in the way becomes the way." — Marcus Aurelius

Modern fatherhood is overwhelming. Stoicism provides:
- **Emotional Regulation**: Pause before reacting
- **Perspective**: Separate controllable from uncontrollable
- **Virtue Ethics**: Live by principles, not impulses
- **Resilience**: Prepare for adversity, don't avoid it

### The Four Cardinal Virtues

1. **Courage** - Face challenges without fear
2. **Temperance** - Master desires and impulses
3. **Justice** - Treat others fairly, serve the family
4. **Wisdom** - Distinguish good from bad decisions

---

## 🚧 Future Roadmap

- [ ] Spaced repetition system
- [ ] Audio narration for lessons
- [ ] Community scenario sharing
- [ ] Export progress as PDF
- [ ] PWA for offline access
- [ ] Push notifications

---

## 📄 License

This project is for educational purposes. Stoic philosophy is public domain.

---

## 🙏 Acknowledgments

- **Marcus Aurelius** - Meditations
- **Epictetus** - Enchiridion
- **Seneca** - Letters from a Stoic
- **Ryan Holiday** - The Daily Stoic

---

## 📧 Support

For questions or feedback, this is a demo application built as a code example.

---

**Built with ❤️ for fathers who want to be better.**


_"We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Aristotle_

_Deployment Check: 2026-02-02T05:43:00_

## 🚀 Deployment

The project is deployed to Vercel.

**Production URL:** [the-stoic-dad.vercel.app](https://the-stoic-dad.vercel.app)
**Vercel Project:** `the-stoic-dad`

> [!IMPORTANT]
> When re-linking the project, ensure you use the `the-stoic-dad` project name in the `pharmotago` team.
