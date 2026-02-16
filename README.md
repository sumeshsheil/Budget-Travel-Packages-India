# Budget Travel Packages

Budget Travel Packages is a modern, high-performance landing page for a travel agency specializing in affordable and customized tour packages across India.

## 🚀 Key Features

- **Dynamic Search**: Enhanced search functionality for exploring travel packages.
- **Smooth Navigation**: Fully functional header links with smooth scroll to sections (Services, Travel Purpose, FAQs, etc.).
- **Interactive Booking Form**: Modular, multi-step booking form with integrated OTP verification (via MessageCentral) and real-time validation.
- **Service Hubs**: Detailed multi-city operations sections (Kolkata, Delhi, Mumbai).
- **Modern UI/UX**: Built with a focus on premium aesthetics, using animations (Lottie, Framer Motion) and responsive design.
- **Smooth Scrolling**: Integrated with Lenis for a premium scrolling experience.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [Lottie React](https://github.com/gamertree/lottie-react)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Validation**: [Zod](https://zod.dev/)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)

## 📂 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm / yarn / pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (`.env.local`):

   ```env
   # Add your API keys for OTP, Database, etc.
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components/landing`: Core landing page sections and UI components.
- `src/lib/redux`: State management slices and store configuration.
- `public/animations`: Lottie JSON files for site animations.

## 📄 License

This project is private and intended for internal use.
