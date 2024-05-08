const page = window.location.pathname.substring(1);
const mainPageContent = `<div class="d-grid gap-2 col-6 mx-auto mt-5">
            <button class="btn btn-primary" type="button" onclick="location.href='/pizza/list'">Pizza List</button>
            <button class="btn btn-primary" type="button" onclick="location.href='/api/pizza'">See Pizza List</button>
            <button class="btn btn-primary" type="button" onclick="location.href='/api/allergens'">See Allergens List</button>
            <button class="btn btn-primary" type="button" onclick="location.href='/api/order'">See Order History List</button>
            </div>`;


const navBar = `<nav class="navbar bg-dark" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand">Pizza Menu</a>
    <button class="btn btn-outline-success">Back</button>
  </div>
</nav>`

let orderList = [];
let pizzas = [];
let orderHistory = [];

const showIngredients = (ingredients) => {
    return ingredients.join(", ")
}

let allergenList = [];

const showAllergens = (allergens) => {
    return [...allergens].map(x => allergenList.filter(item => item.id === x)[0].name).join(", ")
}

const card = (pizza) => {
    return content = `<div class="card text-bg-light m-3" style="width: 18rem;">
                <img src="/images/${pizza.id}.jpg" class="card-img-top" alt="${pizza.name} image">
                <div class="card-body">
                    <h5 class="card-title text-center">${pizza.name}</h5>
                    <hr>
                    <p class="card-text"><strong>Ingredients:</strong> ${showIngredients(pizza.ingredients)}</p>
                    <h6 class="card-text bg-info-subtle text-center">Allergens: ${showAllergens(pizza.allergens)}</h6>
                    <h5 class="card-text text-center"><strong>Price: ${pizza.price}$</strong></h3>
                    <hr>
                    <div class="d-flex justify-content-around flex-row">
                            <button class="btn btn-sm btn-outline-success">-</button>
                            <h5 id="${pizza.id}" class="text-primary">0</h5>
                            <button class="btn btn-sm btn-outline-success">+</button>
                            <button class="btn btn-sm btn-success">Add</button>
                    </div>
                </div>
            </div>`
}

const pizzaList = (list) => {
    let toAdd = "";
    list.forEach(pizza => {
        toAdd += card(pizza);
    })
    return toAdd;
}

const formElement = `<form>
<h3>Order details</h3>
<div class="form-group">
  <label for="firstName">First Name:</label>
  <input class="form-control" type="text" id="firstName" placeholder="Enter first name" required>
  <label for="lastName">Last Name:</label>
  <input class="form-control" type="text" id="lastName" placeholder="Enter last name" required>
  <hr>
  <h4>Address</h4>
  <label for="city">City:</label>
  <input class="form-control" type="text" id="city" placeholder="Enter city" required>
  <label for="street">Street:</label>
  <input class="form-control" type="text" id="street" placeholder="Enter street" required>
  <hr>
  <label for="inputEmail">Email address</label>
  <input class="form-control" type="email" class="form-control" id="inputEmail" placeholder="Enter email" required>
</div>
<div id="msg"></div>
<button id="order" class="btn btn-success mt-2 mb-2">Place Order</button>
</form>`

const pizzaListPageContent = (data) => {
    pizzas = [...data];
    return `<div class="d-flex flex-row justify-content-around align-items-start">
        <div class="col-8 d-flex align-items-center justify-content-center m-auto flex-column">
            <div class="row">${pizzaList(data)}</div>
        </div>
        <div class="col-2 text-center m-4" id="form" hidden>${formElement}</div>
    </div>`
}

function formateDate() {
    let date = new Date();
    return {
        year: date.getFullYear(),
        month: `${date.getMonth() + 1}`.length === 2 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        day: `${date.getDate()}`.length === 2 ? date.getDate() : `0${date.getDate()}`,
        hours: date.getHours(),
        minutes: date.getMinutes()
    }
}

function handlePlaceOrder() {
    if (document.getElementById("firstName").value === "" ||
        document.getElementById("lastName").value === "" ||
        document.getElementById("inputEmail").value === "" ||
        document.getElementById("city").value === "" ||
        document.getElementById("street").value === "") {
        document.getElementById("msg").innerHTML = `All elements required`;
        document.getElementById("msg").style.color = "red";
    } else {
        if (orderList.length > 0) {
            orderHistory.push({
                date: formateDate(),
                order: orderList,
                customer: {
                    name: `${document.getElementById("firstName").value} ${document.getElementById("lastName").value}`,
                    email: `${document.getElementById("inputEmail").value}`,
                    Address: {
                        city: document.getElementById("city").value,
                        street: document.getElementById("street").value
                    }
                }
            });
            if (orderHistory.length > 0) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderHistory)
                };
                fetch("/api/order", requestOptions)
                    .then(response => response.json())
                    .then(data => console.log(data))
                document.getElementById("msg").innerHTML = `Successful`;
                document.getElementById("msg").style.color = "green";
                document.getElementById("firstName").value = "";
                document.getElementById("lastName").value = "";
                document.getElementById("inputEmail").value = "";
                document.getElementById("city").value = "";
                document.getElementById("street").value = "";
            }
        }
    }

}

function handleOrder() {
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            switch (event.target.innerHTML) {
                case "-": if (+event.target.parentNode.children[1].innerHTML > 0 && event.target.parentNode.children[3].innerHTML === "Add") {
                    event.target.parentNode.children[1].innerHTML = +event.target.parentNode.children[1].innerHTML - 1;
                };
                    break;
                case "+":
                    if (event.target.parentNode.children[3].innerHTML === "Add") {
                        event.target.parentNode.children[1].innerHTML = +event.target.parentNode.children[1].innerHTML + 1;
                    }
                    break;
                case "Add":
                    if (+event.target.parentNode.children[1].innerHTML > 0) {
                        let pizzaId = +event.target.parentNode.children[1].id;
                        let indexOfPizza = pizzas.findIndex(pizza => pizza.id === pizzaId);
                        orderList.push({
                            quantity: +event.target.parentNode.children[1].innerHTML,
                            pizza: pizzas[indexOfPizza].id
                        });
                        event.target.innerHTML = "Remove";
                        event.target.classList.remove("btn-success");
                        event.target.classList.add("btn-danger");
                        document.getElementById("form").hidden = false;
                    }
                    break;
                case "Remove":
                    let pizzaOrderId = +event.target.parentNode.children[1].id;
                    let indexOfPizzaInOrder = orderList.findIndex(order => order.pizza.id === pizzaOrderId);
                    orderList.splice(indexOfPizzaInOrder, 1);
                    event.target.innerHTML = "Add";
                    event.target.classList.add("btn-success");
                    event.target.classList.remove("btn-danger");
                    event.target.parentNode.children[1].innerHTML = 0;
                    if (orderList.length === 0) {
                        document.getElementById("form").hidden = true;
                    }
                    break;
                case "Back":
                    window.location.assign("/");
                    break;
                case "Place Order":
                    handlePlaceOrder();
                    console.log(orderHistory);
                    break;
                default: break;
            }
        })
    })
}


window.addEventListener("load", async () => {
    const rootElement = document.getElementById("root");
    switch (page) {
        case "":
            rootElement.innerHTML = mainPageContent;
            break;
        case "pizza/list":
            await fetch("/api/allergens")
                .then(response => response.json())
                .then(data => allergenList = data);

            await fetch("/api/pizza")
                .then(response => response.json())
                .then(data => {
                    rootElement.innerHTML = pizzaListPageContent(data);
                });

            await fetch("/api/history")
                .then(response => response.json())
                .then(data => orderHistory = data);

            rootElement.insertAdjacentHTML("beforebegin", navBar);
            handleOrder();
            break;
        default:
            rootElement.innerHTML = mainContent;
            break;
    }

    console.log(page)
})