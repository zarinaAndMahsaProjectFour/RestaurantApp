//Create a namespace
let restaurantsApp = {}
//Store API key
restaurantsApp.apiKey = '2-RCWO0-I-9m7PMN2zt0fcZ45itXKXWRfnBQtimCYUjh2skNC9-_CAF_SJdwlTkeymvzhlzSyQFDz0kih-S3Cjz1JIxklzgXrnO-YySwD4ThKeBFlskagdf0JeeVXnYx';

//Retrieve restaurant ID's 
restaurantsApp.getRestaurants = (searchTerm, searchLocation) => {

    
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
            location: searchLocation,
            limit: 24,
        }
    }).then(function (result) {
        // Put the results on the page
        restaurantsApp.displayRestaurantDetails(result, 0)
        restaurantsApp.getReviews(result)
        restaurantsApp.showMore(result)
     
        })   
    }
restaurantsApp.getReviews=function(result){
    // for each business ID retrieved from businessID array make an ajax call and then push the result in to businessReview array
    for (let i = 0; i < 6; i++) {
        let businessID = result.businesses[i].id
        businessReviews = []
        $.ajax({
            url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${businessID}/reviews`,
            method: "GET",
            headers: {
            "accept": "application/json",
            "x-requested-with": "xmlhttprequest",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${restaurantsApp.apiKey}`
            },
            data: {}
        }).then(function(result){
            businessReviews.push(result.reviews)
            console.log(businessReviews)
        })
    }}


// Use the GeoLocation-DB API to get the user's city
restaurantsApp.getCity = async function() {
    // wait for the result to come back (promise)
    let location = await $.ajax({
        url: "https://geolocation-db.com/jsonp",
        jsonpCallback: "callback",
        dataType: "jsonp"
    });

    return location.city;
}


restaurantsApp.displayRestaurantDetails = function(result, addedResults) {
    
    console.log(result)
    
    if(addedResults==0){
        $('.restaurantList').empty()
    }
    
    for (let i = addedResults; i < addedResults + 6; i++) {
        let businessID = result.businesses[i].id
        let businessName = result.businesses[i].name
        let businessImage = result.businesses[i].image_url
        let businessRating = result.businesses[i].rating
        let businessPrice = result.businesses[i].price
        let businessAddress = result.businesses[i].location.display_address
        let businessUrl=result.businesses[i].url

        let priceString = "";
        if (businessPrice !== undefined) {
            
            for (let i = 0; i < businessPrice.length; i++) {
                priceString += `<i class="fas fa-dollar-sign"></i>`
            }
        }

        let ratingString = "";
        if (businessRating !== undefined) {
            for (let i = 0; i < parseInt(businessRating); i++) {
                ratingString += `<i class="fas fa-star"></i>`
            }
        }

        // Fix images
        businessImage = businessImage.replace('o.jpg', '300s.jpg')
        

        let html = `<div class="restaurantWrapper">
                <div class="imageWrapper">
                    <img src="${businessImage}">
                </div>
                <div class="restaurantInfo">
                <h2><a href="${businessUrl}">${businessName}</a></h2>
                <span>${ratingString}</span>
                <span>${priceString}</span> 
                <h3>${businessAddress}</h3>
                </div>
                </div>`
        //Displays each result to the page
        $('.restaurantList').append(html)
    }       
}

restaurantsApp.showMore = function(result){
    let addedResults=0;
    
    $(window).on("scroll", function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            addedResults=addedResults+6
            restaurantsApp.displayRestaurantDetails(result, addedResults)
        }
    });
}

restaurantsApp.handleSearch = function () {
        $('form').on('submit', function(e){
        e.preventDefault();
        let locationInput = $('#locationInput').val().trim(' ');
        let termInput = $('#termInput').val().trim(' ');
        restaurantsApp.getRestaurants(termInput, locationInput);
    });
}

restaurantsApp.init = async function () {

    restaurantsApp.handleSearch()
    let userCity = await restaurantsApp.getCity();
    $('#locationInput').val(userCity)
}

$(function() {
    restaurantsApp.init()
})
