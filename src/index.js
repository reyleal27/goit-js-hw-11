import {BASE_URL, options} from './api'
import Notiflix from 'notiflix';
import axios from 'axios';
import simpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";


// const gallery = document.querySelector('.gallery');
// const searchInput = document.querySelector('input[name="searchQuery"]');
// const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('input[name="searchQuery"');
const searchForm = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more')
const loader = document.querySelector('.loader');


const lightbox = new simpleLightbox ('.lightbox',{
  captionsData: 'alt',
  captionDelay: 250,
});



let totalHits = 0;
let reachedEnd = false;

function renderGallery(hits){
  const markup = hits.map(
    ({
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  }) => {
    return ` 
    <a href = "${largeImageURL}" class="lightbox">
      <div class= "photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
              <div class="info">
                  <p class="info-item">
                    <b>Likes</b> 
                    ${likes}
                  </p>
                  <p class="info-item">
                    <b>Views</b>
                    ${views}
                  </p>
                  <p class="info-item">
                    <b>Comments</b>
                    ${comments}
                </p>
                  <p class="info-item">
                    <b>Downloads </b>
                    ${downloads}
                  </p>
              </div>
        </div>
      </a>`
      }
     
   ) 
   showLoadMoreBtn();
   hideLoader();
   gallery.insertAdjacentHTML("beforeend", markup.join("")); 

   if (options.params.page * options.params.per_page >= totalHits) {
        if (!reachedEnd) {
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
         
          reachedEnd = true;
         hideLoadMoreBtn();
         hideLoader();
        }
      }
      lightbox.refresh();
};



async function handleSubmit(e) {
    e.preventDefault();
    options.params.q = searchInput.value.trim();
    if (options.params.q === '') {
      return;
    }
    options.params.page = 1;
    gallery.innerHTML = '';
    reachedEnd = false;
    
    try {
      const response = await axios.get(BASE_URL, options);
      totalHits = response.data.totalHits;
  
      const {hits}  = response.data;
  
      
      console.log(options.params.q);
      if (hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        renderGallery(hits);
      }
      searchInput.value = '';
    } catch (err) {
      Notiflix.Notify.failure(err)
    }
  };
  
searchForm.addEventListener('submit', handleSubmit);


async function loadMoreImg(){
  options.params.page += 1;
  
  try {
    hideLoadMoreBtn();
    showLoader();
    const response = await axios.get(BASE_URL, options);
    const hits = response.data.hits;
    renderGallery(hits);
    console.log(options.params.q);

  }
  catch (err){
    Notiflix.Notify.failure(err);
  }
};

  function showLoader(){
    loader.classList.add('show');
  }

  function hideLoader(){
    loader.classList.remove('show');
  }

  function showLoadMoreBtn(){
    loadMoreBtn.classList.add('show');
  }
  function hideLoadMoreBtn(){
    loadMoreBtn.classList.remove('show');
  }
  

loadMoreBtn.addEventListener('click', loadMoreImg);
  

