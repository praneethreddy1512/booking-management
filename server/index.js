import express from 'express';
import cros from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/connectdb.js';
import providerRouter from './route/provider.route.js';
import slotRouter from './route/slot.route.js';
import userrouter from './route/user.route.js';
import bookingrouter from './route/booking.route.js';
dotenv.config();

const app = express();

app.use(cros({
    origin: ["https://booking-management-phi.vercel.app/"],
    credentials: true
})
)

app.use(express.json());
app.use(helmet({
    crossOriginResourcePolicy: false,
}));


app.use(morgan('dev'));


const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.json({ message: "API is running..." });
})

app.use("/api/providers", providerRouter);
app.use("/api/slots", slotRouter);
app.use("/api/users", userrouter);
app.use("/api/bookings", bookingrouter);
connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})