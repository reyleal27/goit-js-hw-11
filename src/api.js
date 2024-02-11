
export const BASE_URL = "https://pixabay.com/api/";
const api_key = "42283682-cbd5aadb7ea641090067d964b";



export const options = {
    params: {
        key: api_key,
        q: '',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
    },
};
