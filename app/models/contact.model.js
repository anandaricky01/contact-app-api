module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
        unique: true,
      },
      address: String,
    },
    {
      timestamps: true,
    }
  );

  const Contact = mongoose.model("contacts", schema);
  return Contact;
};
