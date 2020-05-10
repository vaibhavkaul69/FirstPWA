const container=document.querySelector('.container');
const coffees = [
  { name: "Perspiciatis", image: "dummy-image.jpg" },
  { name: "Voluptatem", image: "dummy-image.jpg" },
  { name: "Explicabo", image: "dummy-image.jpg" },
  { name: "Rchitecto", image: "dummy-image.jpg" },
  { name: " Beatae", image: "dummy-image.jpg" },
  { name: " Vitae", image: "dummy-image.jpg" },
  { name: "Inventore", image: "dummy-image.jpg" },
  { name: "Veritatis", image: "dummy-image.jpg" },
  { name: "Accusantium", image: "dummy-image.jpg" },
]

  for(let i in coffees){
    container.innerHTML+=`
    <div class="card">
      <img class="card--avatar" src=${coffees[i].image} />
      <h1 class="card--title">${coffees[i].name}</h1>
      <a class="card--link" href="#">Taste</a>
    </div>
    `;
  };
        
 console.log(window);
  //Register a service worker if it exists
  if('serviceWorker' in navigator){
    navigator.serviceWorker
    .register('/service-worker.js')
    .then(response=>console.dir(response))
    .catch(error=> console.log('Service Worker Is Nor registered :'+error));
  }

  