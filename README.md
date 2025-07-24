File Content
# Local ChatGPT-style Chat App

## 👋 Introduction

This project is a full-stack chat application designed to communicate with a local Large Language Model (LLM) using Ollama. It provides a user interface similar to ChatGPT, allowing users to start new chat sessions, view chat history, send messages, and interrupt ongoing LLM responses.

This application was developed as part of the Cointab Technical Assessment.

## 🧠 Objective

The primary objective was to build a local chat application that integrates with the `gemma:1b` model from Ollama, streams LLM responses, persists chat sessions and messages in a PostgreSQL database, and offers a clean, intuitive user interface.

## 🚀 Features

* **Chat Interface:**
    * Text input for sending messages.
    * "Send" button and "Enter to send" functionality.
    * Displays user and bot messages in chronological order.
    * Renders streamed LLM responses token-by-token.
    * "Stop" button to interrupt ongoing LLM generation.
* **Chat History Sidebar:**
    * "New Chat" button to start fresh conversations.
    * Lists past chat sessions with titles and dates.
    * Automatically names new chats (e.g., based on the first prompt).
* **Backend API:**
    * `POST /api/chat`: Creates a new chat session.
    * `POST /api/chat/:chatId/message`: Sends a message and streams the LLM reply.
    * `POST /api/chat/:chatId/stop`: Aborts an ongoing streaming response.
    * `GET /api/chats`: Retrieves a list of all past chat sessions.
    * `GET /api/chat/:chatId`: Fetches the full message history for a specific chat.
* **Database Persistence:**
    * Uses PostgreSQL to store chat sessions and messages.

## 🧱 Tech Stack

* **Frontend:** Next.js (React-based)
* **Backend:** Node.js (Express.js)
* **LLM Runtime:** Ollama (`gemma:1b` model)
* **Database:** PostgreSQL
* **UI Style:** [e.g., Tailwind CSS - Specify what you used]

## 🛠️ Prerequisites

Before you can set up and run this application, ensure you have the following installed on your system:

* **Node.js:** (LTS version recommended)
* **npm** or **Yarn:** (Comes with Node.js)
* **PostgreSQL:** Database server.
* **Ollama:** Download and install Ollama for your operating system from [https://ollama.com/download](https://ollama.com/download).

## ⚙️ Setup Instructions

Follow these steps to get the application running locally:

### 1. Clone the Repository

```bash
git clone [Your GitHub Repo URL]
cd [Your Repo Name]

2. Ollama Setup
First, ensure Ollama is running and download the required LLM model:

# Pull the gemma3:1b model (approx. 815MB)
ollama pull gemma3:1b

# You can test it by running:
ollama run gemma3:1b

Ensure Ollama is running on http://localhost:11434.

3. Database Setup (PostgreSQL)
Create a PostgreSQL Database:

# Connect to your PostgreSQL server (e.g., via psql)
# createuser --interactive # if you need a new user
createdb chatbot_db

Replace chatbot_db with your desired database name if different.

Apply Database Schema:
Navigate to your backend directory and apply the schema.
If you're using a migration tool (e.g., Knex.js):

cd backend
npm install knex pg # if not already installed
npx knex migrate:latest

If you're applying SQL directly (e.g., from db/schema/initial_schema.sql):
Connect to your chatbot_db using psql or a GUI tool, then execute the SQL statements from your schema file. For example, if you have db/schema/initial_schema.sql in your repo:

psql -d chatbot_db -U your_username -f db/schema/initial_schema.sql

Alternatively, you can manually paste and execute the following SQL:

-- Create chats table
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
);

Note: Ensure gen_random_uuid() is available (PostgreSQL 13+ or CREATE EXTENSION pgcrypto;)

Database Configuration (Backend):
In your backend project, ensure your database connection string or configuration (e.g., in a .env file or config file) points to your PostgreSQL database.

Example .env entry (in your backend directory):

DATABASE_URL="postgresql://your_username:your_password@localhost:5432/chatbot_db"

Replace your_username and your_password with your PostgreSQL credentials.

I have used username = postgres and password as MUKA

4. Backend Setup
Navigate to the backend directory:

cd backend

Install dependencies:

npm install
# or yarn install

Start the backend server:

npm start
# or node server.js (if your main file is server.js)

The backend server should start, typically on http://localhost:5000 (or whatever port you configured).

5. Frontend Setup
Navigate to the frontend directory:

cd ../frontend # Assuming you are in the backend directory

Install dependencies:

npm install
# or yarn install

Start the Next.js development server:

npm run dev
# or yarn dev

The frontend application should now be accessible in your browser, typically at http://localhost:3000.

🏃 Local Run Instructions
Ensure Ollama is running and the gemma3:1b model is pulled (ollama run gemma:1b).

Ensure your PostgreSQL database is running and the chatbot_db schema is applied.

Start the backend server (from the backend directory): npm start.

Start the frontend development server (from the frontend directory): npm run dev.

Open your web browser and navigate to http://localhost:3000 to interact with the chat application.

⚠️ Assumptions or Constraints
Ollama Availability: It's assumed that the Ollama runtime is installed and accessible