import  mongoose from 'mongoose'
import colors from 'colors'

export const DbConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('DB Connected Successfully'.bgMagenta);
    } catch (error) {
        console.log('DB Connection Failed:'.bgRed, error);
    }
}