//Create a namespace
let restaurantsApp = {}
//Store API key
restaurantsApp.apiKey = '2-RCWO0-I-9m7PMN2zt0fcZ45itXKXWRfnBQtimCYUjh2skNC9-_CAF_SJdwlTkeymvzhlzSyQFDz0kih-S3Cjz1JIxklzgXrnO-YySwD4ThKeBFlskagdf0JeeVXnYx';
// Create empty arrays to store businesses information
restaurantsApp.businessID=[]
restaurantsApp.businessName=[]
restaurantsApp.businessAddress=[]
restaurantsApp.businessRating=[]
restaurantsApp.businessPrice=[]
restaurantsApp.businessReviews=[]
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
        console.log(result)
        // result.bussinesses is an array on bussinesses that can be looped through with forEach method ,then for each business object the info are stored in respective array
        result.businesses.forEach(function(item){

             restaurantsApp.businessID.push(item.id)
             restaurantsApp.businessRating.push(item.rating)
             restaurantsApp.businessPrice.push(item.price)
             restaurantsApp.businessName.push(item.name)
             restaurantsApp.businessAddress.push(item.location.display_address) 
          
    }); 
    restaurantsApp.getReviews()
})

}
restaurantsApp.getReviews=function(){
    restaurantsApp.businessID.forEach(function(item){
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
            restaurantsApp.businessReviews.push(result.reviews)
            console.log(restaurantsApp.businessReviews)
        })
        .catch(function(result){
            console.log(result)

        })
        
    })
}

restaurantsApp.init = function () {
    restaurantsApp.getRestaurantIDs('Chicken', 'Toronto')
}


$(function() {
    restaurantsApp.init()
})
