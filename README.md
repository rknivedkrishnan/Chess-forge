# OpeningForge - The Intelligent Chess Repertoire Manager

OpeningForge is a modern, interaction-driven chess training platform designed to help you build, organize, and master your opening repertoire. Unlike static PGN viewers, OpeningForge provides an active learning environment where the board responds to your moves, helping you build solid muscle memory for every variation.

**🚀 Live Demo**: [chessforge.vercel.app](https://chessforge.vercel.app/)

---

## ✨ Key Features

### 🧠 Intelligent Training Engine
*   **Active Practice Mode**: Don't just look at moves—play them. Testing your memory with automated opponent responses.
*   **Human-like Latency**: A built-in 600ms "thinking" delay for opponent moves creates a more natural, human-like training flow.
*   **Color-Aware Logic**: The app automatically detects if you are studying a White or Black repertoire, flips the board, and even plays the first move for you.
*   **Silent Feedback**: In Practice Mode, incorrect moves flash a subtle red ring, providing instant visual feedback.

### 📁 Advanced Repertoire Management
*   **Folder-Based Organization**: Group your variations into custom studies (Folders).
*   **Multi-Line Selection**: Move multiple variations between folders at once with our bulk-selection tool.
*   **Inline Renaming**: Easily rename studies or specific lines to match your tournament prep needs.
*   **Smart Importing**: Support for multi-PGN imports with automatic chapter and group creation.

### 🎨 Premium User Experience
*   **Cyber-Dark Theme**: A sleek, modern aesthetic designed for long study sessions.
*   **Keyboard Support**: Navigate variations naturally using your Arrow Keys.
*   **Responsive Board**: High-performance chess board with smooth transitions and move validation.

---

## 🛠️ Tech Stack
*   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) with local storage persistence.
*   **Logic**: [Chess.js](https://github.com/jhlywa/chess.js) (v1+)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Database**: [Prisma](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/) (Configured for Cloud Sync)

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 20+
*   NPM or Yarn

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/rknivedkrishnan/Chess-forge.git
    cd Chess-forge
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file in the root directory and add the following:
    ```env
    DATABASE_URL="your_postgresql_url"
    NEXTAUTH_SECRET="your_secret"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open the app**:
    Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 How to Use

1.  **Import Your Repertoire**: Go to the Dashboard and click "Load from PGN". You can paste multiple variations at once.
2.  **Organize**: Create folders using the `+` icon. Use the selection mode (arrows icon) to move your imported lines into your new folders.
3.  **Learn**: Open a variation in **Learn Mode**. Use your arrow keys to walk through the line and understand the ideas.
4.  **Practice**: Switch to **Practice Mode** to test your memory. The site will play the opponent's moves for you. If you get a move wrong, you'll see a red flash—try again until you've mastered the line!

---

## 📄 License
This project is for educational and personal use. All contributions are welcome!

Designed with ❤️ for Chess Players.
