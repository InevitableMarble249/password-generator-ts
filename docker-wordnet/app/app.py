import nltk
from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from nltk.corpus import wordnet as wn
import random

app = Flask(__name__)
api = Api(app)

class RandomNouns(Resource):
    def get(self):
        try:
            # Get all noun synsets
            noun_synsets = list(wn.all_synsets(pos='n'))
            
            if not noun_synsets:
                return {"error": "No nouns found in WordNet"}, 500
            
            # Filter for single words only
            random.shuffle(noun_synsets)
            
            # Process synsets until we find a single word
            for synset in noun_synsets:
                for lemma in synset.lemmas():
                    word = lemma.name()
                    # Check if it's a single whole word (no underscore, hyphen or space)
                    if '_' not in word and '-' not in word and ' ' not in word:
                        definition = synset.definition()
                        return {"word": word, "definition": definition}
            
            return {"error": "No single-word nouns found"}, 404
        except Exception as e:
            return {"error": str(e)}, 500

class RandomAdjectives(Resource):
    def get(self):
        try:
            # Get all adjective synsets
            adj_synsets = list(wn.all_synsets(pos='a'))
            
            if not adj_synsets:
                return {"error": "No adjectives found in WordNet"}, 500
            
            # Filter for single words only
            random.shuffle(adj_synsets)
            
            # Process synsets until we find a single word
            for synset in adj_synsets:
                for lemma in synset.lemmas():
                    word = lemma.name()
                    # Check if it's a single whole word (no underscore, hyphen or space)
                    if '_' not in word and '-' not in word and ' ' not in word:
                        definition = synset.definition()
                        return {"word": word, "definition": definition}
            
            return {"error": "No single-word adjectives found"}, 404
        except Exception as e:
            return {"error": str(e)}, 500

# Register the resources
api.add_resource(RandomNouns, '/api/random/noun')
api.add_resource(RandomAdjectives, '/api/random/adjective')

@app.route('/')
def home():
    return jsonify({
        "service": "WordNet API",
        "endpoints": [
            "/api/random/noun",
            "/api/random/adjective"
        ]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False) 