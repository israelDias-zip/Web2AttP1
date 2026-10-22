import express, {Request, Response} from 'express';

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World! Welcome thats the login page");
});

export default router;