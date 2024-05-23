// Array to store all the products
let todosProdutos = [];

// Function to fetch products from the database (db.json)
async function getProdutos() {
    // Try to fetch products from the database
    try {
        const response = await fetch('db.json');
        const listaCards = await response.json(); // Store the fetched products in a variable
        console.log('Dados obtidos:', listaCards); // Log the fetched products for debugging purposes

        todosProdutos = listaCards; // Update the global todosProdutos array with the fetched products

        return listaCards; // Return the fetched products
    } catch (error) {
        console.error('Erro ao obter produtos:', error); // Log any errors encountered during the fetch operation
        throw error; // Re-throw the error to be handled by the calling function
    }
}

// Function to display products on the webpage
async function mostrarProdutos() {
    try {
        // Fetch products using the getProdutos function
        await getProdutos();
        const containerProdutos = document.querySelector('.produtos'); // Get the container element to display the products

        // Check if there are any products to display
        if (todosProdutos.length === 0) {
            containerProdutos.textContent = 'Sem Produto no Estoque';
        } else {
            // Iterate through each product and create a card for it
            todosProdutos.forEach(criarCardProduto);
        }
    } catch (error) {
        console.error('Erro ao obter produtos:', error); // Log any errors encountered during the fetch operation
    }
}

// Function to create a card for a product
async function criarCardProduto(produto) {
    // Create the card element and set its class
    const card = document.createElement('div');
    card.classList.add('card');

    // Create the image element and set its source and alternate text
    const imagem = document.createElement('img');

    if (produto.imagem) {
        // If the product has an image, set its source
        if (produto.imagem instanceof File) {
            // If the image is a File object, create a FileReader to read its data
            const reader = new FileReader();
            reader.onload = function () {
                imagem.src = reader.result; // Set the image source to the data URL
            };
            reader.readAsDataURL(produto.imagem); // Read the image data
        } else {
            // If the image is not a File object, set its source to the provided URL
            imagem.src = produto.imagem;
        }
    } else {
        // If the product does not have an image, set a placeholder image
        imagem.src = 'placeholder_imagem.png';
    }
    imagem.alt = 'Imagem do produto'; // Set the alternate text for the image

    // Create the container for the product information and set its class
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('card-container--info');

    // Create the product name element and set its text content
    const nomeProduto = document.createElement('p');
    nomeProduto.textContent = produto.produto;

    // Create the product value container and set its class
    const valorProduto = document.createElement('div');
    valorProduto.classList.add('card-container--value');

    // Create the product value element and set its text content
    const valor = document.createElement('p');
    valor.textContent = `R$ ${produto.valor.toFixed(2)}`;

    // Create the delete icon element and set its source and alternate text
    const lixoIcon = document.createElement('img');
    lixoIcon.classList.add('lixo');
    lixoIcon.src = 'img/lixo.png';
    lixoIcon.alt = 'Ícone de eliminação';

    // Append the product value element and the delete icon element to the product value container
    valorProduto.appendChild(valor);
    valorProduto.appendChild(lixoIcon);

    // Append the product name element and the product value container to the product information container
    infoContainer.appendChild(nomeProduto);
    infoContainer.appendChild(valorProduto);

    // Append the image element and the product information container to the card element
    card.appendChild(imagem);
    card.appendChild(infoContainer);

    // Get the container element to display the products
    const containerProdutos = document.querySelector('.produtos');
    containerProdutos.id = 'todosProdutos'; // Set the ID of the container element

    // Append the card element to the container element
    containerProdutos.appendChild(card);

    // Add an event listener to the delete icon element to delete the product when clicked
    lixoIcon.addEventListener('click', async () => {
        try {
            const confirmacao = confirm("Tem certeza que deseja excluir este produto?");
            if (confirmacao) {
                card.remove(); // Remove the card element from the container element
                const produtosRestantes = containerProdutos.querySelectorAll('.card'); // Get the remaining product cards
                if (produtosRestantes.length === 0) {
                    containerProdutos.textContent = 'Sem Produto no Estoque'; // Display a message if there are no remaining products
                }
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error); // Log any errors encountered during the delete operation
        }
    });
}

// Get the product form element
const formProduto = document.getElementById("form-produto");

// Add an event listener to the product form element to handle form submissions
formProduto.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
        // Get the form field values
        const nome = document.getElementById("nome").value;
        const valor = parseFloat(document.getElementById("valor").value);
        const imagem = document.getElementById("imagem").files[0];

        // Create a new product object
        const novoProduto = {
            produto: nome,
            valor: valor,
            imagem: imagem,
        };

        // Add the new product to the todosProdutos array
        todosProdutos.push(novoProduto);

        // Reset the form fields
        formProduto.reset();

        // Create a card for the new product
        await criarCardProduto(novoProduto);

        // Display a success message
        const sucessoSpan = document.createElement("span");
        sucessoSpan.textContent = "Produto inserido com sucesso";
        sucessoSpan.style.color = "blue";
        formProduto.appendChild(sucessoSpan);

        // Remove the success message after 3 seconds
        setTimeout(() => {
            formProduto.removeChild(sucessoSpan);
        }, 3000);
    } catch (error) {
        console.error("Erro ao adicionar novo produto:", error); // Log any errors encountered during the form submission
    }
});

// Display the initial products
mostrarProdutos();
