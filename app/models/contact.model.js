module.exports = (mongoose) => {
    const schema = mongoose.Schema({
        name : String,
        phone : String,
        address : String 
    }, {
        timestamps : true
    })

    const Contact = mongoose.model("contacts", schema);
    return Contact;
}