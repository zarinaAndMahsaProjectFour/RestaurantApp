//Create a namespace
let restaurantsApp = {}
//Store API key
restaurantsApp.apiKey = '2-RCWO0-I-9m7PMN2zt0fcZ45itXKXWRfnBQtimCYUjh2skNC9-_CAF_SJdwlTkeymvzhlzSyQFDz0kih-S3Cjz1JIxklzgXrnO-YySwD4ThKeBFlskagdf0JeeVXnYx';
//Retrieve restaurant ID's 
restaurantsApp.getRestaurantIDs = (searchTerm, searchLocation) => {
    $.ajax({
        //We need the first link in order to bypass CORS policy issues
        url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search",
        method: "GET",
        headers: {
            "accept": "application/json",
            "x-requested-with": "xmlhttprequest",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${restaurantsApp.apiKey}`
        },
        data: {
            term: searchTerm,
            location: searchLocation
        }
    }).then(function (result) {
        //Empty restaurantList so we can append results each time
        $('.restaurantList').empty()
        //This takes the first three results, can be changed later
        for (let i = 0; i < 3; i++) {
            let businessID = result.businesses[i].id
            let businessName = result.businesses[i].name
            let businessImage = result.businesses[i].image_url
            let businessRating = result.businesses[i].rating
            let businessPrice = result.businesses[i].price
            let businessAddress = result.businesses[i].location.display_address

            let html = `<div>
                <img src="${businessImage}">
                <h2>${businessName}</h2>
                <span>${businessRating}</span>
                <span><i class="fas fa-dollar-sign"></i><i class="fas fa-dollar-sign"></i></span> 
                <h3>${businessAddress}</h3>
                </div>`
            //Displays each result to the page
            $('.restaurantList').append(html)
        }
    });

}
restaurantsApp.init = function () {
    restaurantsApp.getRestaurantIDs('Chicken', 'Toronto')

}


$(function() {
    restaurantsApp.init()
});