const form = document.querySelector("form");
const input = document.getElementById("nameSearch");
const factsContainer = document.querySelector(".facts-container");
const randomBtn = document.querySelector(".random-btn");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const inputValue = input.value;

  fetch(`https://anapioficeandfire.com/api/characters/?name=${inputValue}`)
    .then((response) => {
      return response.json();
    })

    .then((data) => {
      console.log(data.length);
      if (data.length > 0) {
        const character = data[0];
        factsContainer.innerHTML = "";
        const ul = document.createElement("ul");
        for (let prop in character) {
          if (
            prop == "name" ||
            prop == "gender" ||
            (prop == "culture" && character.culture !== "") ||
            (prop == "born" && character.born !== "") ||
            (prop == "died" && character.died !== "") ||
            (prop == "titles" && character.titles !== "") ||
            (prop == "aliases" && character.aliases !== "") ||
            (prop == "tvSeries" && character.tvSeries !== "") ||
            (prop == "playedBy" && character.playedBy !== "")
          ) {
            const li = document.createElement("li");
            const text = document.createTextNode(`${prop}: ${character[prop]}`);
            li.appendChild(text);
            ul.appendChild(li);
          }
        }
        factsContainer.appendChild(ul);
      } else {
      
        factsContainer.innerHTML = "No character found with that name.";
      }

      input.value = "";
    });
});

randomBtn.addEventListener("click", () => {
  fetch(`https://anapioficeandfire.com/api/books/1`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const randomNum = Math.floor(Math.random() * 435);
      console.log(data.characters[0]);
      console.log(data.characters.length);
      console.log(randomNum);
      console.log(data.characters[randomNum]);
      let randomData = data.characters[randomNum];
      fetch(randomData)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          //  if (data.length > 0) {
          console.log(data.name);
          const character = data;
          factsContainer.innerHTML = "";
          const ul = document.createElement("ul");
          for (let prop in character) {
            if (
              prop == "name" ||
              prop == "gender" ||
              (prop == "culture" && character.culture !== "") ||
              (prop == "born" && character.born !== "") ||
              (prop == "died" && character.died !== "") ||
              (prop == "titles" && character.titles !== "") ||
              (prop == "aliases" && character.aliases !== "") ||
              (prop == "tvSeries" && character.tvSeries !== "") ||
              (prop == "playedBy" && character.playedBy !== "")
            ) {
              const li = document.createElement("li");
              const text = document.createTextNode(
                `${prop}: ${character[prop]}`
              );
              li.appendChild(text);
              ul.appendChild(li);
            } else {
            }
          }
          factsContainer.appendChild(ul);
        });
    });
});

function showPicture(characterName) {
  const apiKey = "7Sk_mL_3slbsideJsDCd_ZqOKixwc9Waz2uy854AAz4";
  const url = `https://api.unsplash.com/search/photos?query=gameofthrone${characterName}&client_id=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const firstResult = data.results[0];
      const imageUrl = firstResult.urls.regular;

      const img = document.createElement("img");
      img.src = imageUrl;

      const pictureContainer = document.querySelector(".picture-container");
      pictureContainer.innerHTML = "";
      pictureContainer.appendChild(img);
    })
    .catch((error) => console.log(error));
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  1000,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight / 2);
camera.position.setX(0);
camera.position.setY(0);
camera.position.setZ(50);

renderer.render(scene, camera);
const canvas = document.querySelector("#bg");
const outerRadius = 100;
const innerRadius = 60;
const tubeSegments = 160;
const radialSegments = 100;

const textureLoader = new THREE.TextureLoader();

const ringpic = new THREE.TextureLoader().load("1-Game-of-thrones.jpg");
const material = new THREE.MeshStandardMaterial({
  map: ringpic,
});

const geometry = new THREE.TorusGeometry(
  outerRadius,
  30,
  tubeSegments,
  radialSegments,
  Math.PI * 2
);
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(-24, 30, 42);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight);
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(2000, 50);

scene.add(lightHelper, gridHelper);
scene.background = ringpic;
let torusRotationX = 0;
let torusRotationY = 0;
let torusRotationZ = 0;

function animate() {
  // Call the animate function recursively on each frame
  requestAnimationFrame(animate);

  // Update the torus rotation on each frame
  torusRotationX += 0.01;
  torusRotationY += 0.01;
  torusRotationZ += 0.01;
  torus.rotation.set(torusRotationX, torusRotationY, torusRotationZ);

  // Render the scene with the updated camera and torus position
  renderer.render(scene, camera);
}

animate();

// const toggleButton = document.createElement("button");
// toggleButton.textContent = "Toggle Torus";

// // Add the button to the DOM
// document.body.appendChild(toggleButton);

// // Add an event listener to the button that toggles the visibility of the torus
// toggleButton.addEventListener("click", () => {
//   torus.visible = !torus.visible;
// });
