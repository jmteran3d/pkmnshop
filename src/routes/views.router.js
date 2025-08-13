import { Router } from 'express';
import { auth, authJWT } from '../middleware/auth.js';

export const router=Router()

router.get('/',(req,res)=>{
    let isLogin=false
    if(req.session.user) isLogin=true

    res.status(200).render('home', {
        isLogin
    })
})

router.get('/registro',(req,res)=>{
    let isLogin=false
    if(req.session.user) isLogin=true

    res.status(200).render('registro', {
        isLogin
    })
})

router.get('/login',(req,res)=>{

    let isLogin=false
    if(req.session.user) isLogin=true

    res.status(200).render('login', {
        isLogin
    })
})

router.get('/perfil', authJWT, (req, res) => {
    // req.user viene del JWT
    const { first_name, last_name, email, age, role } = req.user;

    res.status(200).render('perfil', {
        first_name,
        last_name,
        email,
        age,
        role,
        isLogin: true
    });
});
