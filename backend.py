from flask import Flask, render_template, request, jsonify
from duckduckgo_search import DDGS
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    query = data.get('query', '')
    if not query.strip():
        return jsonify({'search_results': []})
    try:
        ddg_results = perform_ddg_search(query, max_results=12)
        return jsonify({
            'search_results': ddg_results
        })
    except Exception as e:
        return jsonify({
            'error': f'Hata: {str(e)}',
            'search_results': []
        })

def perform_ddg_search(query, max_results=12):
    search_results = []
    
    try:
        with DDGS() as ddgs:
            results = ddgs.text(query, region='tr-tr', max_results=max_results)
            for r in results:
                search_results.append({
                    'title': r.get('title', ''),
                    'body': r.get('body', ''),
                    'href': r.get('href', '')
                })
    except Exception as e:
        print(f"Arama hatası: {str(e)}")
    
    return search_results

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)