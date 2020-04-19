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
            limit: 12,
        }
    }).then(function (result) {
        // Put the results on the page
        restaurantsApp.displayRestaurantDetails(result)

        restaurantsApp.getReviews(result)
     
        })   
    }

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

restaurantsApp.displayRestaurantDetails = function(result) {
  
    $('.ListOne').empty()
    //This takes the first three results, can be changed later
    for (let i = 0; i < 6; i++) {
        let businessID = result.businesses[i].id
        let businessName = result.businesses[i].name
        let businessImage = result.businesses[i].image_url
        let businessRating = result.businesses[i].rating
        let businessPrice = result.businesses[i].price
        let businessAddress = result.businesses[i].location.display_address
        console.log(businessPrice)
        console.log(result.businesses[i]);

        let priceString = ""
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

        let html = `<div>
                <img src="${businessImage}">
                <div class="restaurantInfo">
                <h2>${businessName}</h2>
                <span>${ratingString}</span>
                <span>${priceString}</span> 
                <h3>${businessAddress}</h3>
                </div>
                </div>`
        //Displays each result to the page
        $('.listOne').append(html)
    }

    $('.ListTwo').empty()
    //This takes the first three results, can be changed later
    for (let i = 6; i < 12; i++) {
        let businessID = result.businesses[i].id
        let businessName = result.businesses[i].name
        let businessImage = result.businesses[i].image_url
        let businessRating = result.businesses[i].rating
        let businessPrice = result.businesses[i].price
        console.log(businessPrice)
        let businessAddress = result.businesses[i].location.display_address
        console.log(result.businesses[i]);

        let priceString = ""
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

        let html = `<div>
                <img src="${businessImage}">
                <div class="restaurantInfo">
                <h2>${businessName}</h2>
                <span>${ratingString}</span>
                <span>${priceString}</span> 
                <h3>${businessAddress}</h3>
                </div>
                </div>`
        //Displays each result to the page
        $('.listTwo').append(html)
    } 
        
}

restaurantsApp.showMore = function(){
    
    let slideIndex = 1;
    showDivs(slideIndex);

    function showDivs(n) {
        let i;
        let x = $(".restaurantList");
        console.log(x)
        if (n > x.length) {slideIndex = 1}
        if (n < 1) {slideIndex = x.length} ;
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        x[slideIndex-1].style.display = "grid";
    }
    
    $('button.right').on('click', function(){
        showDivs(slideIndex += +1)
    })
    $('button.left').on('click', function(){
        showDivs(slideIndex += -1)
    })

}

restaurantsApp.handleSearch = function (e) {
    e.preventDefault();
    let locationInput = $('#locationInput').val().trim(' ');
    let termInput = $('#termInput').val().trim(' ');

    restaurantsApp.getRestaurants(termInput, locationInput);
}

restaurantsApp.init = async function () {

    restaurantsApp.getRestaurants('Chicken', 'northyork ontario')
    restaurantsApp.showMore()

    //set up event listener to accept user input
    $('form').on('submit', restaurantsApp.handleSearch);

    // Get user city and populate the locationTerm input
    let userCity = await restaurantsApp.getCity();
    $('#locationInput').val(userCity)
}

$(function() {
    restaurantsApp.init()
})
