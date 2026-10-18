import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("Liên kết cơ sở dữ liệu thành công");
    } catch (error) {
        console.log("Lỗi khi liên kết với CSDL: ", error);
        process.exit(1);
    }
};
