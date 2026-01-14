import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: function (v:string) {
          // Simple URL validation (optional, can be more strict)
          return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(v);
        },
        message: (props: { value: string }) => `${props.value} is not a valid image URL!`,
      },
    },
    imageType: {
      type: String,
      enum: ["jpg", "jpeg", "png", "gif", "webp"],
      default: "jpg",
    },
    imageSize: {
      type: Number, // in bytes
    },
    publicId: {
      type: String, // Useful for cloud storage (e.g., Cloudinary or S3)
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Optional: Virtual for full image URL if stored as just filename
// profileSchema.virtual('imageUrl').get(function () {
//   return `https://yourcdn.com/uploads/${this.image}`;
// });
 const Profile = mongoose.model("Profile", profileSchema);
export { profileSchema, Profile as ProfileModel };
