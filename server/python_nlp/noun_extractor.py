import spacy
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"], supports_credentials=True)

# Load spaCy models for different languages
models = {}

def load_model(language):
    """Load spaCy model for the specified language"""
    model_map = {
        'Catalan': 'ca_core_news_sm',
        'Chinese': 'zh_core_web_sm',
        'Croatian': "hr_core_news_sm",
        'Danish': "da_core_news_sm",
        'Dutch': "nl_core_news_sm",
        'English': 'en_core_web_sm',
        'Finnish': "fi_core_news_sm",
        'French': "fr_core_news_sm",
        'German': "de_core_news_sm", 
        'Greek': "el_core_news_sm", 
        'Italian': "it_core_news_sm",
        'Japanese': "ja_core_news_sm",
        'Korean': "ko_core_news_sm",
        'Lithuanian': "lt_core_news_sm",
        'Macedonian': "mk_core_news_sm",
        'Norwegian': "nb_core_news_sm", 
        'Polish': "pl_core_news_sm", 
        'Portuguese': "pt_core_news_sm",
        'Romanian': "ro_core_news_sm",
        'Russian': "ru_core_news_sm",
        'Slovenian': "sl_core_news_sm",
        'Spanish': 'es_core_news_sm',
        'Swedish': "sv_core_news_sm",
        'Ukranian': "uk_core_news_sm"
    }
    
    model_name = model_map.get(language, 'en_core_web_sm')
    
    if model_name not in models:
        try:
            models[model_name] = spacy.load(model_name)
        except OSError:
            # Fallback to English if model not found
            if model_name != 'en_core_web_sm':
                models[model_name] = spacy.load('en_core_web_sm')
            else:
                raise Exception("English model not found. Please install: python -m spacy download en_core_web_sm")
    
    return models[model_name]

@app.route('/extract-nouns', methods=['POST'])
def extract_nouns():
    """Extract nouns from input text"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        language = data.get('language', 'en')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Load the appropriate model
        nlp = load_model(language)
        
        # Process the text
        doc = nlp(text)
        
        # Extract nouns with their details
        nouns = []
        for token in doc:
            if token.pos_ == 'NOUN':
                nouns.append({
                    'text': token.text,
                    'lemma': token.lemma_,
                    'start': token.idx,
                    'end': token.idx + len(token.text)
                })
        
        return jsonify({
            'nouns': nouns,
            'count': len(nouns),
            'language': language,
            'original_text': text
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'available_models': list(models.keys())})

if __name__ == '__main__':
    # Load English model by default
    load_model('en')
    app.run(host='0.0.0.0', port=5001, debug=True)