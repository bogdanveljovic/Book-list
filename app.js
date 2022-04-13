class Book {
    constructor(title,author,isbn) {
        this.title = title;
        this.author = author
        this.isbn = isbn
    }
}

class UI {
    addBookToList(book) {
        const list = document.getElementById("book-list");
        //Kreiramo tr element
        const row = document.createElement("tr");
        //Ubacujemo kolone
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href= "#" class = "delete">X </a> </td>
        `
        list.appendChild(row);
    }
     
    showAlert(message,className){
        // create div
        const div = document.createElement("div");
        // add classes
        div.className  = `alert ${className}`;
        // add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form")
        container.insertBefore(div,form);
        // timeout after 3 sec
        setTimeout(function(){
            document.querySelector(".alert").remove();
        }, 3000);
    }

    deleteBook(target){
        if (target.className === "delete") {
            target.parentElement.parentElement.remove();
            this.showAlert("Book Removed", "success")
        }
       
    }
    clearFields(){
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("isbn").value = "";
    }
}

// Local Storage Class
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem("books") === null){
            books = [];
        }   else {
            books = JSON.parse(localStorage.getItem("books"))
        }
        return books;
    }
    
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI;

            //Add book to UI
            ui.addBookToList(book)
        });
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books))
    }

    static removeBook(isbn){
       const books = Store.getBooks();
       books.forEach(function(book,index) {
           if(book.isbn === isbn) {
               books.splice(index, 1)
           };
       });
       localStorage.setItem("books", JSON.stringify(books))
    }
}

//DOM Load Event
document.getElementById("DOMContentLoaded",Store.displayBooks);

document.getElementById("book-form").addEventListener("submit", 
    function(e){
    
    const title = document.getElementById("title").value,
        author = document.getElementById("author").value,
        isbn = document.getElementById("isbn").value;

       

        //Instanciramo knjigu
        const book = new Book (title,author,isbn)
       

        // Instatiating UI
        const ui = new UI();

        // Validation
        if(title === "" || author === "" || isbn === "") {
            //Error alert
            ui.showAlert("Please fill in all the fields","error")
        } else {

        // Adding book to list
        ui.addBookToList(book)

        // Adding to Local Storage
        Store.addBook(book)

        // Show success
        ui.showAlert("Book Added", "success");

        // Clear fields
        ui.clearFields()
        }
    e.preventDefault();
});

// Event Listener for Delete
document.getElementById("book-list").addEventListener
("click", function(e){
    const ui = new UI;
    // Delete book
    ui.deleteBook(e.target);
    
    // Remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        
    e.preventDefault();
})