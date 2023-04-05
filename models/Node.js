const mongoose= require("mongoose")

const NodeSchema= new mongoose.Schema(
    {
        id: {
            type: Number,
            // required: true
        },

        name: {
            type: String, 
            required: true
        },

        children: {
            type: [ Number ],
        },
    },
    {

        timestamps: true
    }
)

module.exports= mongoose.model("Node", NodeSchema)