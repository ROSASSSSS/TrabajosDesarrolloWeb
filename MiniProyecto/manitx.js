// 1. Crear los productos
const products = [
    {
        id: 1,
        name: "Nike Flight",
        brand: "Nike",
        price: 229900,
        description: "Balón para partidos exigentes.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe3fVhZsoCDn5r-pVzQb4ClInh4DjFdHSc_WUflPF0vQ&s=10"
    },
    {
        id: 2,
        name: "Adidas UCL Pro",
        brand: "Adidas",
        price: 249900,
        description: "Diseño inspirado en el fútbol de élite.",
        image: "https://molten.com.co/cdn/shop/articles/balon-de-futbol-sala-vs-balon-de-futbol-tradicional-en-que-se-diferencian-realmente-3889229.png?v=1763066495"
    },
    {
        id: 3,
        name: "Puma Orbita",
        brand: "Puma",
        price: 199900,
        description: "Ideal para entrenamientos.",
        image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Molten F5A3200",
        brand: "Molten",
        price: 179900,
        description: "Una opción versátil para jugar fútbol.",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Adidas Tiro League",
        brand: "Adidas",
        price: 159900,
        description: "Pensado para mejorar tu técnica.",
        image: "https://media.falabella.com/falabellaCO/883586214_1/w=1500,h=1500,fit=cover"
    },
    {
        id: 6,
        name: "Nike Academy",
        brand: "Nike",
        price: 149900,
        description: "Un balón para tus entrenamientos.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqzDoRcLoL4s4T9vouLclOgovCgyfy1PlVdNWZIRt5P7tKlltBGIO-o2E&s=10"
    }
];


const productList = document.getElementById("product-list");


function formatPrice(price) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(price);
}


function displayProducts() {
    productList.innerHTML = "";

    products.forEach(function(product) {
        const card = document.createElement("article");

        card.classList.add("product-card");

        card.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image"
                loading="lazy"
            >

            <span class="product-brand">${product.brand}</span>

            <h3 class="product-name">${product.name}</h3>

            <p class="product-description">
                ${product.description}
            </p>

            <p class="product-price">
                ${formatPrice(product.price)}
            </p>
        `;

        productList.appendChild(card);
    });
}


displayProducts();