# Semantic PDF Search Backend

This folder contains the Express backend for the semantic PDF search app. It accepts PDF uploads, extracts and chunks text, generates embeddings with Mistral, stores vectors in MongoDB, and answers semantic search requests against the uploaded document.

## What This Backend Does

- Receives PDF uploads through `POST /api/upload`.
- Saves the uploaded file in the local `uploads/` folder.
- Extracts text from the PDF.
- Splits the extracted content into smaller chunks.
- Generates embeddings for each chunk using Mistral.
- Stores each chunk with its embedding in MongoDB.
- Accepts semantic search queries through `POST /api/search`.
- Uses MongoDB Atlas vector search to find the most relevant chunks for a given `pdfId`.

## Folder Structure

- `server.js` starts the Express app and registers middleware and routes.
- `config/db.js` connects the app to MongoDB.
- `controllers/` contains the upload and search logic.
- `routes/` defines the API endpoints.
- `middleware/upload.middleware.js` handles PDF uploads with Multer.
- `services/` contains PDF extraction, embedding generation, and search helpers.
- `models/` stores the MongoDB schemas.
- `uploads/` stores uploaded PDF files on disk.

## API Endpoints

### Health Check

`GET /`

Returns a simple JSON response confirming the server is running.

### Upload a PDF

`POST /api/upload`

This endpoint expects a `multipart/form-data` request with the file field named `pdf`.

Response example:

```json
{
	"success": true,
	"pdfId": "1722933894270.pdf",
	"chunksStored": 12
}
```

### Search a PDF

`POST /api/search`

Request body example:

```json
{
	"query": "What does the document say about job responsibilities?",
	"pdfId": "1722933894270.pdf"
}
```

Response example:

```json
{
	"results": [
		{
			"text": "matched chunk text",
			"fileName": "resume.pdf",
			"pdfId": "1722933894270.pdf",
			"score": 0.859
		}
	]
}
```

## Environment Variables

Create a `.env` file in `server/` with the following values:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
MISTRAL_API_KEY=your_mistral_api_key
```

Notes:

- `MONGO_URI` must point to a MongoDB database that supports vector search.
- The search pipeline uses a MongoDB vector index named `vector_index`.
- `MISTRAL_API_KEY` is required for embedding generation.

## Local Development

Install dependencies and start the server:

```bash
npm install
npm run dev
```

For production:

```bash
npm run start
```

The server runs on `http://localhost:5000` by default unless `PORT` is set.

## How The Flow Works

1. The frontend uploads a PDF file.
2. Multer stores the file in `uploads/`.
3. The backend extracts text from the PDF.
4. The text is split into chunks.
5. Each chunk is embedded using Mistral.
6. Chunks and embeddings are stored in MongoDB with a shared `pdfId`.
7. The frontend sends a search query and the `pdfId` back to the backend.
8. The backend creates a query embedding and searches matching chunks with MongoDB vector search.

## Important Implementation Details

- Uploads are limited to PDF files only.
- Maximum upload size is 10 MB.
- Search requires both `query` and `pdfId`.
- If no chunks exist for a `pdfId`, the API returns a 404 response.
- If no matches are found, the API also returns a 404 response.

## Related Frontend

The frontend that talks to this backend lives in the sibling `client/` folder.

