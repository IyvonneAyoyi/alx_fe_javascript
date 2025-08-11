const quotes = [
  // Motivational Quotes
  {text: "Code is like humor. When you have to explain it, it’s bad. — Cory House", category: "motivational"},
  {text: "Don’t stop when you’re tired. Stop when you’re done.", category: "motivational"  },
  { text: "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it." , category: "motivational"},
  //Inspirational
  {text: "The best way to predict the future is to invent it. — Alan Kay" ,category: "inspirational"},
  {text: "Simplicity is the soul of efficiency. — Austin Freeman" ,category: "inspirational"},
  { text: "Learning to write programs stretches your mind, and helps you think better. — Bill Gates" ,category: "inspirational"}
];



function showRandomQuote(quotes) {

    // Pick random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    console.log(randomQuote); 

    //Get element by id
   const displayQuote = document.getElementById('quoteDisplay');

   //  set its text to the quote’s text property
   displayQuote.textContent= randomQuote.text
};

//Show random quote when page loads
showRandomQuote(quotes);

// Get button by id
const newQuoteButton = document.getElementById('newQuote');

//Add event Listener to the button
newQuoteButton.addEventListener('click',()=>{
    showRandomQuote(quotes);
});