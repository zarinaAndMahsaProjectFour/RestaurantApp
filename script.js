// Create a namespace
let restaurantsApp = {}
// Store API key
restaurantsApp.apiKey = '2-RCWO0-I-9m7PMN2zt0fcZ45itXKXWRfnBQtimCYUjh2skNC9-_CAF_SJdwlTkeymvzhlzSyQFDz0kih-S3Cjz1JIxklzgXrnO-YySwD4ThKeBFlskagdf0JeeVXnYx';

// A place to save reviews so we don't request the same review multiple times
restaurantsApp.reviews = {}

// Retrieve restaurant ID's 
restaurantsApp.getRestaurants = (searchTerm, searchLocation) => {

    
    $.ajax({
        // We need the first link in order to bypass CORS policy issues
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
        restaurantsApp.displayRestaurantDetails(result, 0);
        restaurantsApp.showMore(result);
    })   
}

restaurantsApp.getReview = function(businessID){

    return $.ajax({
        url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${businessID}/reviews`,
        method: "GET",
        headers: {
        "accept": "application/json",
        "x-requested-with": "xmlhttprequest",
        "Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${restaurantsApp.apiKey}`
        },
        data: {}
    })    
}


// Use the GeoLocation-DB API to get the user's city
restaurantsApp.getCity = async function() {
    // Wait for the result to come back (promise)
    let location = await $.ajax({
        url: "https://geolocation-db.com/jsonp",
        jsonpCallback: "callback",
        dataType: "jsonp"
    });

    return location.city;
}

// Place the results from the Yelp API on the page
restaurantsApp.displayRestaurantDetails = function(result, addedResults) {

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
        let businessUrl = result.businesses[i].url

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

        // Uniformly resize images
        businessImage = businessImage.replace('o.jpg', '300s.jpg')
        
        let html = `<div class="restaurantWrapper">
                <div class="imageWrapper" id=${businessID}>
                    <a href="#"><img src="${businessImage}"/></a>
                    <p><i class="fas fa-drumstick-bite" aria-hidden="true"></i></p>
                </div>
                <div class="restaurantInfo">
                <h2><a href="${businessUrl}">${businessName}</a></h2>
                <span class="sr-only">Rating:${businessRating}</span>
                <span aria-hidden="true">${ratingString}</span>
                <span class="sr-only">Price:${businessPrice}</span>
                <span aria-hidden="true">${priceString}</span> 
                <h3>${businessAddress}</h3>
                </div>
                </div>`
        // Displays each result to the page
        $('.restaurantList').append(html)
    }

    restaurantsApp.handleHoverFocus();
}

restaurantsApp.showMore = function(result) {
    let addedResults=0;
    
    $(window).on("scroll", function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            addedResults=addedResults+6
            restaurantsApp.displayRestaurantDetails(result, addedResults)
        }
    });
}

restaurantsApp.getReviewHtml = async function (businessID) {

    
    let reviewHtml = "";
    if (businessID in restaurantsApp.reviews) {
        // We have already searched for this review, simply use it
        reviewHtml = restaurantsApp.reviews[businessID];
    } else {
        let reviewInfo = await restaurantsApp.getReview(businessID);
        if (reviewInfo.reviews.length > 0) {
            // If there are any reviews, get the raint and text of the first review
            let ratingText = reviewInfo.reviews[0].text;
            let rating = reviewInfo.reviews[0].rating;
            let ratingString = "";
            if (rating !== undefined) {
                for (let i = 0; i < parseInt(rating); i++) {
                    ratingString += `<i class="fas fa-star"></i>`
                }
            }

            reviewHtml = `
                <span>${ratingString}</span>
                ${ratingText}
                `

            restaurantsApp.reviews[businessID] = reviewHtml;
        }
    }

    return reviewHtml

}
//Set up event handlers on hover and on focus of images
restaurantsApp.handleHoverFocus = function() {
    $('.imageWrapper').off('mouseover').on('mouseover', async function(e) {
        //ignore events that fire on the div
        let businessID = e.target.parentNode.parentNode.id;
        if (businessID === "") {
            return;
        }
        //retrieve review HTML and display on page
        let reviewHtml = await restaurantsApp.getReviewHtml(businessID);
        let reviewParagraph = $(e.target.parentNode.parentNode.children[1]);
        reviewParagraph.html(reviewHtml);
    });
    
    $('.imageWrapper a').off('focus').on('focus', async function(e) {

        let businessID = e.target.parentNode.id;
        if (businessID === "") {
            return;
        }
        //Retrieve review HTML and display on page
        let reviewHtml = await restaurantsApp.getReviewHtml(businessID);
        let reviewParagraph = $(e.target.parentNode.children[1]);
        reviewParagraph.html(reviewHtml);
    });
}
//Set up event handler to store user input on submit 
restaurantsApp.handleSearch = function () {
        $('form').on('submit', function(e){
        e.preventDefault();
        let locationInput = $('#locationInput').val().trim(' ');
        let termInput = $('#termInput').val().trim(' ');

        restaurantsApp.getRestaurants(termInput, locationInput);
    });
}

restaurantsApp.init = async function () {

    restaurantsApp.handleSearch();
    let userCity = await restaurantsApp.getCity();
    $('#locationInput').val(userCity)
}

$(function() {
    restaurantsApp.init()
})
