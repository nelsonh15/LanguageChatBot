# spaCy Noun Extraction Service

This service provides noun extraction functionality using spaCy NLP library.

## Setup

1. **Install Python dependencies:**

   ```bash
   cd server/python_nlp
   pip install -r requirements.txt
   ```

2. **Download spaCy language models:**

   ```bash
   python -m spacy download en_core_web_sm
   ```

   For other languages (optional):

   ```bash
   python -m spacy download es_core_news_sm  # Spanish
   python -m spacy download fr_core_news_sm  # French
   python -m spacy download de_core_news_sm  # German
   ```

3. **Or run the automated setup:**
   ```bash
   python setup.py
   ```

## Usage

1. **Start the Python service:**

   ```bash
   python noun_extractor.py
   ```

   The service will run on `http://localhost:5001`

2. **Start your Node.js server:**

   ```bash
   cd ../
   npm run dev
   ```

3. **Make requests to extract nouns:**
   ```bash
   curl -X POST http://localhost:9000/api/nlp/extract-nouns \
     -H "Content-Type: application/json" \
     -d '{"text": "The quick brown fox jumps over the lazy dog", "language": "en"}'
   ```

## API Endpoints

### POST /extract_nouns

Extract nouns from input text.

**Request:**

```json
{
  "text": "The quick brown fox jumps over the lazy dog",
  "language": "en"
}
```

**Response:**

```json
{
  "nouns": [
    {
      "text": "fox",
      "lemma": "fox",
      "start": 16,
      "end": 19
    },
    {
      "text": "dog",
      "lemma": "dog",
      "start": 49,
      "end": 52
    }
  ],
  "count": 2,
  "language": "en",
  "original_text": "The quick brown fox jumps over the lazy dog"
}
```

### GET /health

Check service health and available models.

## Supported Languages

- `en` - English (default)
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese

Note: You need to download the corresponding spaCy models for each language you want to use.
