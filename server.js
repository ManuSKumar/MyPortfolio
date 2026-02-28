// This wrapper exists because the user keeps typing `node server.js`
// The actual server code utilizing pdf-parse MUST run in a CommonJS context (.cjs)
import('./server.cjs').catch(err => {
    console.error("Failed to load the server:", err);
});
