//Create a namespace
let restaurantsApp = {}
//Store API key
restaurantsApp.apiKey = '2-RCWO0-I-9m7PMN2zt0fcZ45itXKXWRfnBQtimCYUjh2skNC9-_CAF_SJdwlTkeymvzhlzSyQFDz0kih-S3Cjz1JIxklzgXrnO-YySwD4ThKeBFlskagdf0JeeVXnYx';

restaurantsApp.displayRestaurantDetails = function(result) {
    
        $('.restaurantListOne').empty()
        //This takes the first three results, can be changed later
        for (let i = 0; i < 6; i++) {
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
            $('.listOne').append(html)
        }

        $('.restaurantListTwo').empty()
        //This takes the first three results, can be changed later
        for (let i = 6; i < 12; i++) {
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
            $('.listTwo').append(html)
        }
}

restaurantsApp.displayMore=function(){
    $('.restaurantList p').on('click', function(){
        $('.listOne').removeClass('unhidden')
        $('.listOne').addClass('hidden')
        $('.listTwo').removeClass('hidden')
        $('.listTwo').addClass('unhidden')
    })
}



//Retrieve restaurant Info
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
            limit: 12,
        }
    }).then(function (result) {
        // Put the results on the page
        restaurantsApp.displayRestaurantDetails(result)

        restaurantsApp.getReviews(result)
     
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

restaurantsApp.init = function () {
    restaurantsApp.getRestaurants('Chicken', 'northyork ontario')
    restaurantsApp.displayMore()
}


$(function() {
    restaurantsApp.init()
})
