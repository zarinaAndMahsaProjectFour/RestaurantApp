//Create a namespace
let restaurantsApp = {}
//Store API key
restaurantsApp.apiKey = '2-RCWO0-I-9m7PMN2zt0fcZ45itXKXWRfnBQtimCYUjh2skNC9-_CAF_SJdwlTkeymvzhlzSyQFDz0kih-S3Cjz1JIxklzgXrnO-YySwD4ThKeBFlskagdf0JeeVXnYx';


restaurantsApp.displayRestaurantDetails = function(result) {
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
}



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
            location: searchLocation,
            limit: 3,
        }
    }).then(function (result) {
        // Put the results on the page
        restaurantsApp.displayRestaurantDetails(result)

        // Keep track of all business IDs
        businessIDs = []
        result.businesses.forEach(function(item){
            businessIDs.push(item.id);
        });

        // Get reviews and put them on the page
        restaurantsApp.getReviews(businessIDs)
        
    });
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

restaurantsApp.getReviews=function(businessIDs){
    // for each business ID retrieved from businessID array make an ajax call and then push the result in to businessReview array
    businessIDs.forEach(function(item){
        businessReviews = []
        console.log(item)
        $.ajax({
            url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${item}/reviews`,
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
    })
}

restaurantsApp.init = function () {
    //set up event listener to accept user input
    $('form').on('submit', function (e) {
        e.preventDefault();
        let locationInput = $('#locationInput').val().trim(' ');
        let termInput = $('#termInput').val().trim(' ');

        restaurantsApp.getRestaurantIDs(termInput, locationInput)
    })
}


$(async function() {
    restaurantsApp.init()

    // Get user city and populate the locationTerm input
    let userCity = await restaurantsApp.getCity();
    $('#locationInput').val(userCity)
})
