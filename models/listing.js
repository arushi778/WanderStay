const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

const listingSchema = new Schema({

    title : {
        type: String,
        required : true
    },
    description : {
        type: String
    },
    image: {
        filename: { type: String},
        url: { type: String, 
            // set : (v) => !v || v === ""?"https://images.pexels.com/photos/12314825/pexels-photo-12314825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1": v,
 
        }
    },
    price : {
        type: Number
    },
    location : {
        type: String
    },
    country : {
        type: String
    },
    reviews : {
        type : [{
            type : Schema.Types.ObjectId,
            ref : "Review"
        }]
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    geometry : {
          type: {
            type: String, 
            enum: ['Point'], 
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
        }
});

listingSchema.post("findOneAndDelete",async(listing)=>{

    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;