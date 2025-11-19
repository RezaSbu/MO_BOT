# 🤖 MO_BOT - Google Gemini AI Chatbot

A modern AI chatbot built with **React**, **TypeScript**, and **Google Gemini AI Studio** - designed for seamless conversations and intelligent responses.



## ✨ Features

- 💬 **Real-time Chat Interface** - Smooth conversation experience
- 🧠 **Powered by Google Gemini** - Latest AI capabilities
- ⚡ **Fast & Responsive** - Built with Vite for optimal performance
- 🎨 **Modern UI** - Clean and intuitive design
- 📱 **Mobile-Friendly** - Responsive across all devices
- 🔐 **Secure API Integration** - Environment-based configuration

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS/TypeScript
- **AI Model**: Google Gemini AI Studio
- **Package Manager**: npm

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API Key

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/RezaSbu/MO_BOT.git
cd MO_BOT
1.
Install dependencies
bash
npm install
1.
Configure API Key

Create a .env.local file in the root directory:
env
GEMINI_API_KEY=your_gemini_api_key_here
1.
Run the development server
bash
npm run dev
1.
Open in browser

Navigate to http://localhost:5173
🚀 Deployment
Build for Production
bash
npm run build
Preview Production Build
bash
npm run preview
📁 Project Structure
MO_BOT/
├── src/
│   ├── components/     # React components
│   ├── services/       # API services
│   ├── types.ts       # TypeScript definitions
│   ├── App.tsx        # Main application
│   └── main.tsx       # Application entry point
├── public/            # Static assets
├── package.json       # Dependencies
├── vite.config.ts     # Vite configuration
└── tsconfig.json      # TypeScript configuration
🔧 Configuration
Environment Variables
GEMINI_API_KEY: Your Google Gemini API key
Customization
Modify chatbot responses in the services directory
Customize UI components in the components directory
Adjust styling in CSS files
🤝 Contributing
1.
Fork the repository
2.
Create a feature branch (git checkout -b feature/amazing-feature)
3.
Commit your changes (git commit -m 'Add amazing feature')
4.
Push to the branch (git push origin feature/amazing-feature)
5.
Open a Pull Request
