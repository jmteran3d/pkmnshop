import { Router } from 'express';
import { auth } from '../middleware/auth.js';
export const router=Router()

router.get('/',(req,res)=>{
    let isLogin=false
    if(req.session.usuario) isLogin=true

    res.status(200).render('home', {
        isLogin
    })
})

router.get('/registro',(req,res)=>{
    let isLogin=false
    if(req.session.usuario) isLogin=true

    res.status(200).render('registro', {
        isLogin
    })
})

router.get('/login',(req,res)=>{

    let isLogin=false
    if(req.session.usuario) isLogin=true

    res.status(200).render('login', {
        isLogin
    })
})

router.get('/perfil', auth, (req,res)=>{

    let {nombre, email}=req.session.usuario

    res.status(200).render('perfil', {
        nombre, 
        email, 
        isLogin: true
    })
})