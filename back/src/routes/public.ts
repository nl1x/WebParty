import express, { Router } from 'express';
import path from 'path';

const publicRouter = Router();

publicRouter.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

export default publicRouter;
