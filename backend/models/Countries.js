const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
    countryname: String,
    states: [
       {
           name: {
            type: String
           },
           cities: [
            {
                name: {
                    type: String
                }
            }
          ]
       }    
    ]
})

module.exports = mongoose.model('Countries', CountrySchema)