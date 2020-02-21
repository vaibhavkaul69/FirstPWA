const container = document.querySelector(".container")
const coffees = [
  { name: "Perspiciatis", image: "dummy-image.png" },
  { name: "Voluptatem", image: "dummy-image.png" },
  { name: "Explicabo", image: "dummy-image.png" },
  { name: "Rchitecto", image: "dummy-image.png" },
  { name: " Beatae", image: "dummy-image.png" },
  { name: " Vitae", image: "dummy-image.png" },
  { name: "Inventore", image: "dummy-image.png" },
  { name: "Veritatis", image: "dummy-image.png" },
  { name: "Accusantium", image: "dummy-image.png" },
]
const showCoffees = () => {
    let output = ""
    coffees.forEach(
      ({ name, image }) =>
        (output += `
                <div class="card">
                  <img class="card--avatar" src=${image} />
                  <h1 class="card--title">${name}</h1>
                  <a class="card--link" href="#">Taste</a>
                </div>
                `)
    )
    container.innerHTML = output
  }
  
  document.addEventListener("DOMContentLoaded", showCoffees);
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("service-worker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
  }