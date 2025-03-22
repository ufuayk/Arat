document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const webResultsContainer = document.getElementById('webResultsContainer');
    const webResults = document.getElementById('webResults');
    const loader = document.getElementById('loader');

    searchInput.focus();

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    searchButton.addEventListener('click', performSearch);

    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;
        
        loader.classList.remove('hidden');
        
        fetch('/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        })
        .then(response => response.json())
        .then(data => {
            loader.classList.add('hidden');
    
            if (data.search_results && data.search_results.length > 0) {
                webResults.innerHTML = '';
                displaySearchResults(data.search_results);
                webResultsContainer.classList.remove('hidden');
                webResultsContainer.classList.add('fade-in');
            } else {
                webResultsContainer.classList.add('hidden');
                if (data.error) {
                    alert(data.error);
                }
            }
        })
        .catch(error => {
            loader.classList.add('hidden');
            alert('An error occurred while searching. Please try again.');
        });
    }

    function displaySearchResults(results) {
        webResults.innerHTML = '';
        results.forEach((result, index) => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.style.animationDelay = `${index * 0.05}s`;
            div.classList.add('fade-in');

            const title = document.createElement('a');
            title.className = 'result-title block';
            title.href = result.href;
            title.target = '_blank';
            title.textContent = result.title;

            const url = document.createElement('div');
            url.className = 'result-url';
            const urlObj = new URL(result.href);
            url.textContent = urlObj.hostname + urlObj.pathname;

            const snippet = document.createElement('div');
            snippet.className = 'result-snippet';
            snippet.textContent = result.body;

            div.appendChild(title);
            div.appendChild(url);
            div.appendChild(snippet);
            webResults.appendChild(div);
        });
    }

    function setTheme() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);
    setTheme();
});