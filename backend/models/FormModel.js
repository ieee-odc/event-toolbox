const mongoose = require ("mongoose");
const Schema= mongoose.Schema;
const FormSchema= new Schema (
    {

    eventId:{
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required:true
    },
   
    price: {
        type: Number,
        default: 0
    },

    data: {
        type: Map,
        of: Schema.Types.Mixed  //Allow any type of value in the Map
    }

});
module.exports = mongoose.model('Form', FormSchema);

