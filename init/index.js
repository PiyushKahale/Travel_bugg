const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");


const Mongo_URL = "mongodb://127.0.0.1:27017/travel_bug";


main()
    .then(() => {
        console.log("Now, Connected to DB");
    })
    .catch((err) => {
        console.log("Error has ooccured");
    });
async function main() {
    await mongoose.connect(Mongo_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj) => 
        ({...obj, owner: "66f0d0b9838dd0cdeb7e8ad5"}));
    await Listing.insertMany(initData.data);
    console.log("data was Initialized...!");
}

initDB();