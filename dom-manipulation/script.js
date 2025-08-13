const API_URL = "http://localhost:3000/quotes";

// Fetch quotes from server or fallback to localStorage
async function fetchQuotesFromServer()  {
  try {
    const response = await fetch(API_URL);
    const serverQuotes = await response.json();
    localStorage.setItem('quotes', JSON.stringify(serverQuotes));
    return serverQuotes;
  } catch (error) {
    console.error("Failed to load quotes from server, using localStorage:", error);
    const storedQuotes = localStorage.getItem('quotes');
    return storedQuotes ? JSON.parse(storedQuotes) : [];
  }
}

// Save quotes to localStorage
function saveQuotes(quotes) {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote(quotes) {
  if (!quotes.length) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  document.getElementById('quoteDisplay').innerHTML = randomQuote.text;
  sessionStorage.setItem('lastQuoteIndex', randomIndex);
}

// Add new quote to server
async function addQuoteToServer(quote) {
  quote.updatedAt = new Date().toISOString();
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    console.log("Quote added to server:", quote);
  } catch (error) {
    console.error("Failed to add quote to server:", error);
  }
}

// Periodic sync (server wins)
async function syncQuotes() {
  try {
    const response = await fetch(API_URL);
    const serverQuotes = await response.json();
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

    if (JSON.stringify(localQuotes) !== JSON.stringify(serverQuotes)) {
      localStorage.setItem('quotes', JSON.stringify(serverQuotes));
      populateCategories(serverQuotes);
      alert("Quotes updated from server (server wins)");
    }
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

// Initialize app
async function init() {
  const quotes = await loadQuotes();

  // Show last quote or random
  const lastIndex = sessionStorage.getItem('lastQuoteIndex');
  if (lastIndex !== null && quotes[lastIndex]) {
    document.getElementById('quoteDisplay').innerHTML = quotes[lastIndex].text;
  } else {
    showRandomQuote(quotes);
  }

  // New Quote button
  document.getElementById('newQuote').addEventListener('click', () => showRandomQuote(quotes));

  // Create Add Quote Form
  createAddQuoteForm(quotes);

  // Import/Export
  document.getElementById("exportQuotes").addEventListener("click", () => exportQuotes(quotes));
  document.getElementById("importFile").addEventListener("change", event => importFromJsonFile(event, quotes));

  // Populate category dropdown
  populateCategories(quotes);

  // Start periodic sync every 30s
  setInterval(syncQuotes, 30000);
}

// Create Add Quote Form
function createAddQuoteForm(quotes) {
  const quoteFormContainer = document.getElementById('formContainer');
  const form = document.createElement('form');

  const inputText = document.createElement('input');
  inputText.id ='newQuoteText';
  inputText.type ='text';
  inputText.placeholder = 'Enter a new quote';
  inputText.required = true;

  const inputCategory = document.createElement('input');
  inputCategory.id = 'newQuoteCategory';
  inputCategory.type = 'text';
  inputCategory.placeholder = 'Enter a new quote category';
  inputCategory.required = true;

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Add Quote';

  form.appendChild(inputText);
  form.appendChild(inputCategory);
  form.appendChild(submitButton);
  quoteFormContainer.appendChild(form);

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const newQuoteText = inputText.value.trim();
    const newQuoteCategory = inputCategory.value.trim();
    if (!newQuoteText || !newQuoteCategory) {
      alert('Please enter both a quote and a category.');
      return;
    }
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes(quotes);
    await addQuoteToServer(newQuote);
    showRandomQuote(quotes);
    populateCategories(quotes);
    inputText.value = '';
    inputCategory.value = '';
  });
}

// Import JSON
function importFromJsonFile(event, quotes) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes) || !importedQuotes.every(q => q.text && q.category)) {
        alert('Invalid JSON format.');
        return;
      }
      quotes.push(...importedQuotes);
      saveQuotes(quotes);
      populateCategories(quotes);
      alert('Quotes imported successfully!');
    } catch (error) {
      alert('Error parsing JSON: ' + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Export JSON
function exportQuotes(quotes) {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Category filter
function populateCategories(quotes) {
  const categoryFilter = document.getElementById("categoryFilter");
  
  // Keep only the "All" option
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Get unique categories from quotes
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  // Add each category
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}


// Filter Quotes
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    document.getElementById("quoteDisplay").innerHTML = filteredQuotes[randomIndex].text;
  } else {
    document.getElementById("quoteDisplay").innerHTML = "No quotes in this category.";
  }
}

// Start app
init();
