'use strict';

const APIRandom = 'https://api.thecatapi.com/v1/images/search?limit=3&api_key=dab929d6-56d8-465c-b6ef-80aaa595704a';
const APIFavorites = 'https://api.thecatapi.com/v1/favourites';

async function fetchData(urlApi) {
  const response = await fetch(urlApi);
  const data = await response.json();
  return data;
}

const loadRandomMichis = async ()=> {
  try {
    let catJSON = await fetchData(APIRandom);
    
    let catImage1 = catJSON[0].url;
    let catImage2 = catJSON[1].url;
    let catImage3 = catJSON[2].url;

    const img1 = document.getElementById('cat-container1');
    const img2 = document.getElementById('cat-container2');
    const img3 = document.getElementById('cat-container3');
    
    img1.src = catImage1;
    img2.src = catImage2;
    img3.src = catImage3;

    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    const btn3 = document.getElementById('btn3');

    btn1.onclick = ()=> saveFavoriteMichi(catJSON[0].id);
    btn2.onclick = ()=> saveFavoriteMichi(catJSON[1].id);
    btn3.onclick = ()=> saveFavoriteMichi(catJSON[2].id);
  } 
  catch(error) {
    console.error(error);
  }
}

loadRandomMichis();

async function loadFavoritesMichis(){
  let catResponse = await fetch(APIFavorites,{
    method: "GET",
    headers: {
      "Content-Type":"application/json",
      "x-api-key": "dab929d6-56d8-465c-b6ef-80aaa595704a"
    }
  });

  let catJSON = await catResponse.json();

    const favorites = document.getElementById('favoritesMichis');
    
    if(catJSON.status !== 200 && catJSON.length == 0 && catJSON.message !== 'NOT-FOUND'){
      favorites.innerHTML = `<h3 style="color:#922B21">Ocurrió un error ${catJSON.status} de ${catJSON.message}</h3>`;
      console.log(catJSON)
    }

    if(catJSON.length === 0){
      favorites.innerHTML = `<h3 style="color:#626567">Aún no has añadido un gatito a favoritos.</h3>`
    }

    else {
      const section = document.getElementById('favoritesMichis');
      section.innerHTML = ''

      catJSON.forEach(michi => {
        const article = document.createElement('article');
        const img = document.createElement('img');
        const button = document.createElement('button');
        const btnText = document.createTextNode('Eliminar Michi de favoritos');
        
        button.classList.add('buttonMichiFavorites');
        button.appendChild(btnText);
        article.classList.add('michiContainer');
        img.src = michi.image.url;
        button.onclick = ()=> deleteFavoriteMichi(michi.id)
        
        article.appendChild(img);
        article.appendChild(button);
        section.appendChild(article);

      })
    }
}

loadFavoritesMichis();

async function saveFavoriteMichi(id) {
  let catResponse = await fetch(APIFavorites,{
    method: 'POST',
    headers: {
      "Content-Type":"application/json",
      "x-api-key": "dab929d6-56d8-465c-b6ef-80aaa595704a"
    },
    body: JSON.stringify({
      image_id: `${id}`
    })
  });

  let catJSON = await catResponse.json();

  if (catJSON.message === 'SUCCESS') {
    console.log('gatito guardado');
    loadFavoritesMichis()
  }
}

async function deleteFavoriteMichi(id){
  let catResponse = await fetch(`https://api.thecatapi.com/v1/favourites/${id}`,{
    method: 'DELETE',
    headers: {
      "Content-Type":"application/json",
      "x-api-key": "dab929d6-56d8-465c-b6ef-80aaa595704a"
    }
  });
  
  let catJSON = await catResponse.json();

  if(catJSON.message === 'SUCCESS'){
    console.log('gatito eliminado de favoritos');
    loadFavoritesMichis()
  }
}

const button = document.getElementById('botonsito');
button.addEventListener('click',()=> loadRandomMichis());