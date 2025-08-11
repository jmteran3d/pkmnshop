import { Router } from 'express';
import { auth } from '../middleware/auth.js';
export const router=Router()

router.use(auth)

router.get('/',(req,res)=>{

    let productos="productos listado"

    res.setHeader('Content-Type','application/json')
    res.status(200).json({productos})
})