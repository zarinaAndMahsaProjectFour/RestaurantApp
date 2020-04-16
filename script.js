//Create a namespace
let restaurantsApp = {}
//Store API key
restaurantsApp.apiKey = '2-RCWO0-I-9m7PMN2zt0fcZ45itXKXWRfnBQtimCYUjh2skNC9-_CAF_SJdwlTkeymvzhlzSyQFDz0kih-S3Cjz1JIxklzgXrnO-YySwD4ThKeBFlskagdf0JeeVXnYx';

//Retrieve restaurant ID's 
restaurantsApp.getRestaurantIDs = (searchTerm, searchLocation) => {
    // Create empty arrays to store businesses information
    businessID=[]
    businessName=[]
    businessAddress=[]
    businessRating=[]
    businessPrice=[]
    businessReviews=[]
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
        console.log(result)
        // result.bussinesses is an array that can be looped over with forEach method and for each business item (is an object containing each business info) the info are pushed in the respective array
        result.businesses.forEach(function(item){

             businessID.push(item.id)
             businessRating.push(item.rating)
             businessPrice.push(item.price)
             businessName.push(item.name)
             businessAddress.push(item.location.display_address) 
          
    }); 
    // businessID array can be seen here
    console.log(businessID)
    // getReviews function is called after the first call is complete.
    restaurantsApp.getReviews(businessID)
})

}
restaurantsApp.getReviews=function(businessID){
    // for each business ID retrieved from businessID array make an ajax call and then push the result in to businessReview array
    businessID.forEach(function(item){
        
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
    restaurantsApp.getRestaurantIDs('Chicken', 'Toronto')
}


$(function() {
    restaurantsApp.init()
})
