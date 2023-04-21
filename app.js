const form = document.querySelector("form");
const input = document.getElementById("nameSearch");
const factsContainer = document.querySelector(".facts-container");
const randomBtn = document.querySelector(".random-btn");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const inputValue = input.value;
  showPicture(`${inputValue}`);

  fetch(`https://anapioficeandfire.com/api/characters/?name=${inputValue}`)
    .then((response) => {
      return response.json();
    })

    .then((searchCharacter) => {
      console.log(searchCharacter);
      if (searchCharacter.length > 0) {
        const character = searchCharacter[0];
        factsContainer.innerHTML = "";
        const ul = document.createElement("ul");
        for (let prop in character) {
          if (
            prop == "name" ||
            prop == "gender" ||
            (prop == "culture" && character.culture !== "") ||
            (prop == "born" && character.born !== "") ||
            (prop == "died" && character.died !== "") ||
            (prop == "titles" && character.titles[0] !== "") ||
            (prop == "aliases" && character.aliases[0] !== "") ||
            (prop == "tvSeries" && character.tvSeries[0] !== "") ||
            (prop == "playedBy" && character.playedBy[0] !== "")
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
  const Bookurls = [
    `https://anapioficeandfire.com/api/books/1`,
    `https://anapioficeandfire.com/api/books/2`,
    `https://anapioficeandfire.com/api/books/3`,
    `https://anapioficeandfire.com/api/books/4`,
    `https://anapioficeandfire.com/api/books/5`,
  ];
  Promise.all(Bookurls.map((url) => fetch(url)))

    .then((responses) => {
      return Promise.all(responses.map((response) => response.json()));
    })

    .then((fiveBooksData) => {
      console.log(fiveBooksData);
      console.log(fiveBooksData[0]);

      const allCharacter = fiveBooksData.map((obj) =>
        obj.characters.concat(obj.povCharacters)
      );
      console.log(allCharacter);

      const cominedArray = allCharacter.reduce((acc, arr) => {
        return acc.concat(arr);
      }, []);

      console.log(cominedArray);
      console.log(cominedArray.length);

      ////////3572 total Characters,  3528 Characters, 44 povCharacters

      const randomNum = Math.floor(Math.random() * 3573);
      let randomData = cominedArray[randomNum];
      fetch(randomData)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const character = data;
          showPicture(`${character.name}`);
          factsContainer.innerHTML = "";
          const ul = document.createElement("ul");
          for (let prop in character) {
            if (
              prop == "name" ||
              prop == "gender" ||
              (prop == "culture" && character.culture !== "") ||
              (prop == "born" && character.born !== "") ||
              (prop == "died" && character.died !== "") ||
              (prop == "titles" && character.titles.length > 1) ||
              (prop == "aliases" && character.aliases.length > 1) ||
              (prop == "tvSeries" && character.tvSeries.length > 1) ||
              (prop == "playedBy" && character.playedBy.length > 1)
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
  const url = `https://api.unsplash.com/search/photos?query=${characterName}&client_id=${apiKey}`;

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
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth + 450, (window.innerHeight / 2.5) + 200);
camera.position.setX(0);
camera.position.setY(0);
camera.position.setZ(0);

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

scene.background = ringpic;
let torusRotationX = 0;
let torusRotationY = 0;
let torusRotationZ = 0;

function animate() {
  requestAnimationFrame(animate);

  torusRotationX += 0.01;
  torusRotationY += 0.01;
  torusRotationZ += 0.01;
  torus.rotation.set(torusRotationX, torusRotationY, torusRotationZ);

  renderer.render(scene, camera);
}

animate();

// The toggle button
const t1 = document.createElement("button");
t1.textContent = "Toggle Torus";
t1.className = "t1Btn";
document.body.appendChild(t1);
const t2 = document.createElement("div");
t1.appendChild(t2);
t1.addEventListener("click", () => {
  torus.visible = !torus.visible;
});

const mapContainer = document.querySelector(".map-container");
const toggleButton = document.querySelector(".map");

toggleButton.addEventListener("click", () => {
  mapContainer.classList.toggle("hidden");
  console.log("click");
});

const housefact = document.querySelector(".housefact-container");
const select = document.querySelector("select");
select.addEventListener("change", (event) => {
  const selectedHouse = event.target.value;
  console.log(`You selected ${selectedHouse}`);
  if (selectedHouse === "empty") {
    housefact.innerHTML = "";
  }

  fetch("https://anapioficeandfire.com/api/houses/")
    .then((response) => {
      return response.json();
    })
    .then((housesData) => {
      for (let i = 0; i < housesData.length; i++) {
        if (housesData[i].name === selectedHouse) {
          const house = housesData[i];
          const ul = document.createElement("ul");
          console.log(house);
          for (const [key, value] of Object.entries(house)) {
            if (
              key !== "url" &&
              value !== "" &&
              value.length > 1 &&
              value.indexOf("http") === -1 &&
              value[0].indexOf("http") === -1
            ) {
              const li = document.createElement("li");
              const text = document.createTextNode(`${key}: ${value}`);
              li.appendChild(text);
              ul.appendChild(li);
            }
          }

          const founderValue = house.founder;
          if (founderValue.indexOf("http") === 0) {
            fetch(founderValue)
              .then((res) => {
                return res.json();
              })
              .then((founderData) => {
                const founderName = founderData.name;
                const li = document.createElement("li");
                const text = document.createTextNode(`founder :${founderName}`);
                li.appendChild(text);
                ul.appendChild(li);
              });
          }
          const currentLord = house.currentLord;
          if (currentLord.indexOf("http") === 0) {
            fetch(currentLord)
              .then((res) => {
                return res.json();
              })
              .then((founderData) => {
                const founderName = founderData.name;
                const li = document.createElement("li");
                const text = document.createTextNode(
                  `current Lord :${founderName}`
                );
                li.appendChild(text);
                ul.appendChild(li);
              });
          }
          const overLord = house.overlord;
          if (overLord.indexOf("http") === 0) {
            fetch(overLord)
              .then((res) => {
                return res.json();
              })
              .then((founderData) => {
                const founderName = founderData.name;
                const li = document.createElement("li");
                const text = document.createTextNode(
                  `overlord :${founderName}`
                );
                li.appendChild(text);
                ul.appendChild(li);
              });
          }
          const swornMembers = house.swornMembers;
          if (swornMembers.length > 1) {
            Promise.all(
              swornMembers.map((url) => fetch(url).then((res) => res.json()))
            ).then((swornMembersData) => {
              const names = swornMembersData.map((member) => member.name);
              const li = document.createElement("li");
              const text = document.createTextNode(
                `swornMembers: ${names.join(", ")}`
              );
              li.appendChild(text);
              ul.appendChild(li);
            });
          }

          const housefact = document.querySelector(".housefact-container");
          housefact.innerHTML = "";
          housefact.appendChild(ul);
        }
      }
    });
});
