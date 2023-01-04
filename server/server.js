import colors from "colors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express";
import { notFound, errorHandler } from "./middleware/error.middleware.js";
import connectDB from "./config/db.js";
import path from "path";
import morgan from "morgan";
import hpp from "hpp";
import cors from 'cors'
import helmet from "helmet";
import xss from 'xss-clean'
import ExpressMongoSanitize from "express-mongo-sanitize";
import fileupload from 'express-fileupload'


//import routers
import productRouter from "./routes/product.router.js";
import userRouter from "./routes/user.router.js";
import orderRouter from "./routes/order.router.js";
import uploadRouter from "./routes/upload.router.js";
dotenv.config();

connectDB();

const app = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10min
  max: 100,
});

//regular middlewares
app.use(fileupload())
app.use(express.json());
app.use(xss());
app.use(hpp());
app.use(cors());
app.use(limiter);
app.use(helmet());
app.use(ExpressMongoSanitize());
//mount routes
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);
app.get("/api/config/paypal", (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}



//custom middleware
app.use(notFound);
app.use(errorHandler);






//start server
const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold));

