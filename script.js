'use strict';

const makeupURL = 'https://makeup-api.herokuapp.com/api/v1/products.json';

//watch form 
//prevent submit btn default 
//collect values for user input
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#product-type').val();
    const brand = $('#brand').val();
    const minPrice = $('#min-price-input').val();
    const maxPrice = $('#max-price-input').val();
    getMakeUp(searchTerm, brand, minPrice, maxPrice);
    getYoutubeVideo(searchTerm, brand);
  });
}

//format url 
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getMakeUp(searchTerm, brand, minPrice, maxPrice) {
  const params = {
    product_type: searchTerm,
    brand: brand,
    price_greater_than: minPrice,
    price_less_than: maxPrice,
  };
  
  const queryString = formatQueryParams(params)
  const url = makeupURL + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();

  //if there are no results, display a msg
  if(!Object.keys(responseJson).length){
    $('#results-list').append(`<h2>Sorry, No Products Found For That Make-Up and/or Brand</h2>`);
  }
  // iterate through the items array
  for (let i = 0; i < responseJson.length; i++){
    
    // for each makeup object in the items array, add a list item to the results 
    //list with the full name, img, price, description, url
    $('#results-list').append(
      `<li class="each-product-result">
      <h3 class="product-name">${responseJson[i].name}</h3>
      <img class="product-img" src="${responseJson[i].image_link}">
      <p class="product-price">$${responseJson[i].price}</p>
      <p class="product-description">${responseJson[i].description}</p>
      <a class="product-url" href="${responseJson[i].product_link}" target=_blank>link</a>
      </li>`
    )};

    //display the results section  
    $('#results').removeClass('hidden');

    //clear input after results load
    $('#product-type').val('')
    $('#brand').val('')
    $('#min-price-input').val('');
    $('#max-price-input').val('');
};

$(watchForm);

//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv  YOUTUBE API vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

const youtubeURL = 'https://www.googleapis.com/youtube/v3/search';

function getYoutubeVideo(searchTerm, brand) {
 const params = {
    part:'snippet',
    key:'AIzaSyCR1zVcnvVor0l3h3x8Zkx9X--58hZwJLk',
    q: searchTerm + brand + ' makeup',
    maxResults: 5,
    type: 'video',
    order: 'Relevance',
    safeSearch: 'strict',
    relevanceLanguage: 'en'
  };

  const queryString = formatQueryParams(params)
  const url = youtubeURL + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayYoutubeResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayYoutubeResults(responseJson) {
  console.log(responseJson);

  $('#yt-results-list').empty();

  if(!Object.keys(responseJson.items).length){
    $('#yt-results-list').append(`<h2>Sorry, No Videos Found For That Make-Up and/or Brand</h2>`);
  }

  for (let i = 0; i < responseJson.items.length; i++){
    $('#yt-results-list').append(
      `<li>
      <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}?vq=hd1080" target=_blank>
        <h3>${responseJson.items[i].snippet.title}</h3>
      </a>
      
      <p>Channel: <a href="https://www.youtube.com/channel/${responseJson.items[i].snippet.channelId}" target=_blank>${responseJson.items[i].snippet.channelTitle}</a></p>
      
      <p>${responseJson.items[i].snippet.description}</p>
      
      <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}?vq=hd1080" target=_blank>
        <img src="${responseJson.items[i].snippet.thumbnails.default.url}">
      </a>
      </li>`)
  };

  $('#yt-results').removeClass('hidden');
};
