document.getElementById('searchBtn').addEventListener('click', function () {
    let searchTerm = document.getElementById('searchInput').value.trim();
    
    if (searchTerm) {
        console.log("Searching for: " + searchTerm);
        window.location.href = 'search_results.html?query=' + encodeURIComponent(searchTerm);
    }
});
