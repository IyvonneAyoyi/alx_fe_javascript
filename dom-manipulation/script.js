const storedQuotes = localStorage.getItem('quotes');
const quotes = storedQuotes ? JSON.parse(storedQuotes) : [
  {text: "Code is like humor. When you have to explain it, it’s bad. — Cory House", category: "motivational"},
  {text: "Don’t stop when you’re tired. Stop when you’re done.", category: "motivational"},
  {text: "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it." , category: "motivational"},
  {text: "The best way to predict the future is to invent it. — Alan Kay" ,category: "inspirational"},
  {text: "Simplicity is the soul of efficiency. — Austin Freeman" ,category: "inspirational"},
  {text: "Learning to write programs stretches your mind, and helps you think better. — Bill Gates" ,category: "inspirational"}
];

// Function to save quotes array to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}


function showRandomQuote(quotes) {

    // Pick random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    console.log(randomQuote); 

    //Get element by id
   const displayQuote = document.getElementById('quoteDisplay');

   //  set its text to the quote’s text property
   displayQuote.innerHTML= randomQuote.text;

   // Save last viewed quote index to sessionStorage
    sessionStorage.setItem('lastQuoteIndex', randomIndex);
};

// On page load show last quote from sessionStorage or random quote
window.onload = () => {
  const lastIndex = sessionStorage.getItem('lastQuoteIndex');
  if (lastIndex !== null && quotes[lastIndex]) {
    document.getElementById('quoteDisplay').innerHTML = quotes[lastIndex].text;
  } else {
    showRandomQuote(quotes);
  }
};


//Show random quote when page loads
showRandomQuote(quotes);

// Get button by id
const newQuoteButton = document.getElementById('newQuote');

//Add event Listener to the button
newQuoteButton.addEventListener('click',()=>{
showRandomQuote(quotes);   
    
});


//Create function to add new form
function createAddQuoteForm() {
    //Get the container div where the form will be added
    const quoteFormContainer = document.getElementById('formContainer');
    

    //Create form element
    const form = document.createElement('form');


    // input for quote text
    const inputText = document.createElement('input');
    inputText.id ='newQuoteText';
    inputText.type ='text';
    inputText.placeholder = 'Enter a new quote';
    inputText.required = true;
  

    // input for quote category
    const inputCategory = document.createElement('input')
    inputCategory.id = 'newQuoteCategory';
    inputCategory.type = 'text';
    inputCategory.placeholder = 'Enter a new quote category';
    inputCategory.required = true;

    // Create a submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Quote';

    // Appending Form Input Eement
    form.appendChild(inputText);
    form.appendChild(inputCategory);
    form.appendChild(submitButton);
    
    //Appending form element to div container
    quoteFormContainer.appendChild(form);
    console.log('Inputs added:', inputText, inputCategory);

    // Add event listener to the submit button
    form.addEventListener('submit', function(event) {
    event.preventDefault(); 

    //Remove whitespace from text values
  const newQuoteText = inputText.value.trim();
  const newQuoteCategory = inputCategory.value.trim();

  // Error Handling
  if (!newQuoteText || !newQuoteCategory) {
    console.log('Please enter both a quote and a category.');
    return;
  }

 //New Quotes object 
 const newQuote = {
    text: newQuoteText,
    category: newQuoteCategory
  };

  // Add new quote to the array
  quotes.push(newQuote); 
  
  // Optionally show a random quote (could be the new one)
  showRandomQuote(quotes); 


  // Clear input fields
  inputText.value = '';      
  inputCategory.value = '';
});
};

 createAddQuoteForm();

 // Function for Importing file
 function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

  //Add event listener to import 
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);


// Function for exporting json files
  function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2); // Convert quotes array to pretty JSON string
  const blob = new Blob([dataStr], { type: "application/json" }); // Create a Blob with JSON MIME type
  const url = URL.createObjectURL(blob); // Create a downloadable URL for the Blob


  // create anchor element for url
  const a = document.createElement("a"); 
  a.href = url;

  //default file name
  a.download = "quotes.json"; 

  // Programmatically click to trigger download
  a.click(); 

  //Remove the url
  URL.revokeObjectURL(url); 
}

//Add event listener to export button
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

