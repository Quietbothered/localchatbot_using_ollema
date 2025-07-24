

// // backend/index.js
// const express = require('express');
// const cors = require('cors');
// // const fetch = require('node-fetch');
// const db = require('./db');

// const app = express();
// const port = 3001; // Backend server port

// app.use(cors());
// app.use(express.json());

// // In-memory store for active stream controllers
// const activeStreams = {};

// // GET /api/chats - Get list of past chat sessions
// app.get('/api/chats', async (req, res) => {
//   try {
//     const { rows } = await db.query('SELECT * FROM chats ORDER BY created_at DESC');
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch chats' });
//   }
// });

// // GET /api/chat/:chatId - Get full message history for a chat
// app.get('/api/chat/:chatId', async (req, res) => {
//   try {
//     const { chatId } = req.params;
//     const { rows } = await db.query('SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC', [chatId]);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch messages' });
//   }
// });

// // POST /api/chat/:chatId/message - Send a message and stream the reply
// app.post('/api/chat/:chatId/message', async (req, res) => {
//   const { chatId } = req.params;
//   const { message } = req.body;
//   const abortController = new AbortController();
//   activeStreams[chatId] = abortController;

//   try {
//     // 1. Save user's message
//     await db.query(
//       'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)',
//       [chatId, 'user', message]
//     );

//     // 2. Prepare for streaming response from Ollama
//     const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         model: 'gemma3:1b',
//         prompt: message,
//         stream: true,
//       }),
//       signal: abortController.signal,
//     });

//     if (!ollamaResponse.ok) {
//         // This will catch errors like Ollama not being available
//         const errorText = await ollamaResponse.text();
//         throw new Error(`Ollama API error: ${ollamaResponse.status} ${errorText}`);
//     }

//     res.setHeader('Content-Type', 'text/plain');
//     res.setHeader('Transfer-Encoding', 'chunked');

//     let assistantResponse = '';
//     //  (const chunk of ollamaResponse.body) {
//     //   if (abortController.signal.aborted) break;
//     //   const part = JSON.parse(chunk.toString());
//     //   if (part.response) {
//     //     res.write(part.response); // Stream token to frontend
//     //     assistantResponse += part.response;
//     //   }
//     //   if (part.done) {
//     //     break;
//     //   }
//     // }
//     const { Readable } = require('stream');
// const readline = require('readline');

// const nodeStream = Readable.fromWeb(ollamaResponse.body);

// const rl = readline.createInterface({
//   input: nodeStream,
//   crlfDelay: Infinity,
// });

// for await (const line of rl) {
//   if (!line.trim()) continue;
//   try {
//     const part = JSON.parse(line);
//     if (part.response) {
//       res.write(part.response);
//       assistantResponse += part.response;
//     }
//     if (part.done) break;
//   } catch (err) {
//     console.error('Invalid JSON chunk:', line);
//   }
// }

//     if (!abortController.signal.aborted) {
//         // 3. Save assistant's full response
//         await db.query(
//           'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)',
//           [chatId, 'assistant', assistantResponse]
//         );
//     }

//     res.end();

//   } catch (err) {
//     if (err.name === 'AbortError') {
//       console.log(`Stream for chat ${chatId} was aborted by the user.`);
//     } else {
//       console.error('Error during chat processing:', err);
//       // for awaitSend a specific error message to the frontend
//       if (!res.headersSent) {
//         res.status(500).json({ error: 'An error occurred during chat processing.', details: err.message });
//       }
//     }
//   } finally {
//       delete activeStreams[chatId];
//   }
// });

// // POST /api/chat - Create a new chat session
// app.post('/api/chat', async (req, res) => {
//     try {
//         const { title } = req.body;
//         const { rows } = await db.query(
//             'INSERT INTO chats (title) VALUES ($1) RETURNING *',
//             [title || 'New Chat']
//         );
//         res.status(201).json(rows[0]);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to create new chat' });
//     }
// });

// // POST /api/chat/:chatId/stop - Stop a streaming response
// app.post('/api/chat/:chatId/stop', (req, res) => {
//     const { chatId } = req.params;
//     if (activeStreams[chatId]) {
//         activeStreams[chatId].abort();
//         res.status(200).send('Stream stopped');
//     } else {
//         res.status(404).send('No active stream found for this chat');
//     }
// });

// app.listen(port, async () => {
//   // The db.js file is not provided here, but should be the same as before
//   // await db.createTables(); 
//   console.log(`Backend server listening at http://localhost:${port}`);
// });

// backend/index.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Make sure node-fetch is installed
const db = require('./db');

const app = express();
const port = 3001; // Backend server port

app.use(cors());
app.use(express.json());

// In-memory store for active stream controllers
const activeStreams = {};

// --- Existing Routes ---

// GET /api/chats - Get list of past chat sessions
app.get('/api/chats', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM chats ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// GET /api/chat/:chatId - Get full message history for a chat
app.get('/api/chat/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { rows } = await db.query('SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC', [chatId]);
    res.json(rows);
  } catch (err) {
    console.error(`Error fetching messages for chat ${chatId}:`, err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/chat/:chatId/message - Send a message and stream the reply
app.post('/api/chat/:chatId/message', async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;
  const abortController = new AbortController();
  activeStreams[chatId] = abortController;

  try {
    await db.query(
      'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)',
      [chatId, 'user', message]
    );

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3:1b',
        prompt: message,
        stream: true,
      }),
      signal: abortController.signal,
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      throw new Error(`Ollama API error: ${ollamaResponse.status} ${errorText}`);
    }

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    let assistantResponse = '';
    //const { Readable } = require('stream');
    const readline = require('readline');
    //const nodeStream = Readable.fromWeb(ollamaResponse.body);
    const rl = readline.createInterface({ input: ollamaResponse.body, crlfDelay: Infinity });

    for await (const line of rl) {
      if (abortController.signal.aborted) break;
      if (!line.trim()) continue;
      try {
        const part = JSON.parse(line);
        if (part.response) {
          res.write(part.response);
          assistantResponse += part.response;
        }
        if (part.done) break;
      } catch (err) {
        console.error('Invalid JSON chunk:', line);
      }
    }

    if (!abortController.signal.aborted) {
      await db.query(
        'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)',
        [chatId, 'assistant', assistantResponse]
      );
    }

    res.end();
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log(`Stream for chat ${chatId} was aborted by the user.`);
    } else {
      console.error('Error during chat processing:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'An error occurred during chat processing.', details: err.message });
      } else {
        res.end();
      }
    }
  } finally {
    delete activeStreams[chatId];
  }
});

// POST /api/chat - Create a new chat session
app.post('/api/chat', async (req, res) => {
    try {
        const { title } = req.body;
        const { rows } = await db.query(
            'INSERT INTO chats (title) VALUES ($1) RETURNING *',
            [title || 'New Conversation']
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('Error creating new chat:', err);
        res.status(500).json({ error: 'Failed to create new chat' });
    }
});

// --- New Routes for Title and Delete ---

/**
 * POST /api/chat/:chatId/title
 * Generates and updates a chat title based on the initial message.
 */
app.post('/api/chat/:chatId/title', async (req, res) => {
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required to generate a title.' });
    }

    try {
        const titlePrompt = `Generate a concise, short title (under 5 words) for a conversation that starts with this message: "${message}". Respond with ONLY the title itself, without any introductory text, labels, or quotation marks.`;

        const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gemma3:1b',
                prompt: titlePrompt,
                stream: false, // We want a single response, not a stream
            }),
        });

        if (!ollamaResponse.ok) {
            const errorText = await ollamaResponse.text();
            throw new Error(`Ollama API error for title generation: ${ollamaResponse.status} ${errorText}`);
        }

        const ollamaResult = await ollamaResponse.json();
        // Trim whitespace and remove any surrounding quotes the model might add
        let generatedTitle = ollamaResult.response.trim().replace(/^"|"$/g, '');

        if (!generatedTitle) {
            generatedTitle = 'Titled Chat'; // Fallback title
        }

        const { rows } = await db.query(
            'UPDATE chats SET title = $1 WHERE id = $2 RETURNING *',
            [generatedTitle, chatId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        res.json(rows[0]);

    } catch (err) {
        console.error('Failed to generate title:', err);
        res.status(500).json({ error: 'Failed to generate title', details: err.message });
    }
});

/**
 * DELETE /api/chat/:chatId
 * Deletes a chat and all its associated messages.
 */
app.delete('/api/chat/:chatId', async (req, res) => {
  const { chatId } = req.params;
  
  // Using a database transaction is best practice here to ensure both operations succeed or fail together.
  // The implementation may vary based on your 'db' module setup.
  // This example assumes two separate queries for simplicity.
  try {
    // First, delete messages linked to the chat
    await db.query('DELETE FROM messages WHERE chat_id = $1', [chatId]);
    
    // Then, delete the chat itself
    await db.query('DELETE FROM chats WHERE id = $1', [chatId]);
    
    res.status(204).send(); // 204 No Content is a standard success response for DELETE
  } catch (err) {
    console.error(`Failed to delete chat ${chatId}:`, err);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});


// POST /api/chat/:chatId/stop - Stop a streaming response
app.post('/api/chat/:chatId/stop', (req, res) => {
    const { chatId } = req.params;
    if (activeStreams[chatId]) {
        activeStreams[chatId].abort();
        res.status(200).send('Stream stopped');
    } else {
        res.status(404).send('No active stream found for this chat');
    }
});

app.listen(port, () => {
  // Assuming db.createTables() is handled or not needed on every start
  console.log(`✅ Backend server listening at http://localhost:${port}`);
});