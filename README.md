# JS Exercise AI

A Vite + React + TypeScript web app that generates JavaScript programming exercises using Gemini API and provides AI-powered code correction with detailed feedback.

## Features

- **3-Column Layout**: Sidebar with topics, center playground for exercises, right panel for AI corrections
- **10 JavaScript Topics**: Basics, Conditionals, Loops, Functions, Arrays, Objects, Strings, DOM & Events, Async, ES6+
- **3 Difficulty Levels**: Easy, Medium, Hard
- **AI-Powered**: Generates new exercises and corrects solutions with detailed feedback
- **JSON-Only Output**: Strict JSON-only prompts with repair mechanism for invalid responses
- **Local Storage**: API key stored securely in browser localStorage

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API Key (get from [Google AI Studio](https://aistudio.google.com/app/apikey))

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

4. Enter your Gemini API key in the settings modal

## Usage

1. **Select a Topic**: Click on any topic in the left sidebar
2. **Choose Difficulty**: Select Easy, Medium, or Hard from the top of the center panel
3. **View Exercise**: Read the problem statement, requirements, and examples
4. **Write Solution**: Code your solution in the text editor
5. **Check Solution**: Click "Resolve / Check" to get AI feedback
6. **Review Feedback**: Check the right panel for score, mistakes, and corrected code
7. **New Exercise**: Click "New Exercise" to generate another exercise for the same topic

## Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx         # Topic navigation
│   ├── Playground.tsx      # Exercise display and code editor
│   ├── CorrectionPanel.tsx # AI feedback display
│   └── SettingsModal.tsx   # API key management
├── lib/
│   └── gemini.ts           # API calls and prompt templates
├── types.ts                # TypeScript type definitions
├── App.tsx                 # Main application component
├── main.tsx               # Entry point
└── styles.css             # All styles
```

## Security

- Your API key is stored locally in your browser's localStorage
- The key is never sent to any server except Google's Gemini API
- Do not share your API key publicly

## License

MIT
