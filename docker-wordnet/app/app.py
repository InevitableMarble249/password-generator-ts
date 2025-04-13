import nltk
from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from nltk.corpus import wordnet as wn
import random
import sys

app = Flask(__name__)
api = Api(app)

class RandomNouns(Resource):
    def get(self):
        try:
            print("Noun endpoint called", file=sys.stderr, flush=True)
            # Get all noun synsets
            noun_synsets = list(wn.all_synsets(pos='n'))
            
            if not noun_synsets:
                print("No nouns found in WordNet", file=sys.stderr, flush=True)
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
                        result = {"word": word, "definition": definition}
                        print(f"Found noun: {result}", file=sys.stderr, flush=True)
                        return result
            
            print("No single-word nouns found", file=sys.stderr, flush=True)
            return {"error": "No single-word nouns found"}, 404
        except Exception as e:
            print(f"Error in noun endpoint: {str(e)}", file=sys.stderr, flush=True)
            return {"error": str(e)}, 500

class RandomAdjectives(Resource):
    def get(self):
        try:
            print("Adjective endpoint called", file=sys.stderr, flush=True)
            # Get all adjective synsets
            adj_synsets = list(wn.all_synsets(pos='a'))
            
            if not adj_synsets:
                print("No adjectives found in WordNet", file=sys.stderr, flush=True)
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
                        result = {"word": word, "definition": definition}
                        print(f"Found adjective: {result}", file=sys.stderr, flush=True)
                        return result
            
            print("No single-word adjectives found", file=sys.stderr, flush=True)
            return {"error": "No single-word adjectives found"}, 404
        except Exception as e:
            print(f"Error in adjective endpoint: {str(e)}", file=sys.stderr, flush=True)
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
    print("Starting WordNet API server", file=sys.stderr, flush=True)
    app.run(host='0.0.0.0', port=5001, debug=False) 