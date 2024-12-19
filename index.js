const url = 'https://jsonplaceholder.typicode.com/photos'; // URL base de la API

// Selección de elementos del DOM
const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const showMoreButtonEl = document.getElementById("show-more-button");

// Variables de estado
let albumId = 1; // Número de álbum por defecto
let currentPage = 1;
const photosPerPage = 10;

// Función para buscar fotos por número de álbum
async function fetchPhotos() {
  try {
    // Solicitar datos de la API
    const response = await fetch(`${url}?albumId=${albumId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // Convertir la respuesta a JSON
    const photos = await response.json();

    // Calcular las fotos para mostrar según la página actual
    const startIndex = (currentPage - 1) * photosPerPage;
    const endIndex = startIndex + photosPerPage;
    const currentPhotos = photos.slice(startIndex, endIndex);

    // Limpiar resultados si es la primera página
    if (currentPage === 1) {
      searchResultsEl.innerHTML = '';
    }

    // Mostrar las fotos
    currentPhotos.forEach(photo => {
      const photoWrapper = document.createElement('div');
      photoWrapper.classList.add('photo-result');

      const img = document.createElement('img');
      img.src = photo.thumbnailUrl;
      img.alt = photo.title;

      const title = document.createElement('p');
      title.textContent = photo.title;

      photoWrapper.appendChild(img);
      photoWrapper.appendChild(title);
      searchResultsEl.appendChild(photoWrapper);
    });

    // Mostrar/ocultar botón "Show More Photos"
    if (endIndex < photos.length) {
      showMoreButtonEl.style.display = 'block';
    } else {
      showMoreButtonEl.style.display = 'none';
    }
  } catch (error) {
    console.error('Hubo un error al obtener las fotos:', error);
  }
}

// Evento para manejar la búsqueda en el formulario
formEl.addEventListener("submit", (event) => {
  event.preventDefault(); // Evitar recargar la página
  albumId = parseInt(searchInputEl.value); // Obtener número de álbum ingresado
  if (isNaN(albumId) || albumId < 1) {
    alert("Por favor, introduce un número de álbum válido.");
    return;
  }
  currentPage = 1; // Reiniciar la página
  fetchPhotos(); // Buscar fotos del álbum
});

// Evento para cargar más fotos al hacer clic en el botón
showMoreButtonEl.addEventListener("click", () => {
  currentPage++; // Incrementar página
  fetchPhotos(); // Buscar más fotos
});

// Cargar un álbum inicial al cargar la página (opcional)
fetchPhotos();