// src/routes/cookiesRouter.js
import { Router } from "express";

export const router = Router();

router.get("/set", (req, res) => {
    let persona = {
        font: "Arial",
        fontSize: 15,
        darkMode: false
    };
    res.cookie("cookie01", persona, {});
    res.cookie("cookie02vto01", persona, { maxAge: 5 * 1000 });
    res.cookie("cookie03vto02", persona, { expires: new Date(2025, 11, 18) });
    res.cookie("cookie04signed", persona, { signed: true });

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "Cookies seteadas!" });
});

router.get("/get", (req, res) => {
    let cookies = req.cookies;
    let signedCookies = req.signedCookies;

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ cookies, signedCookies });
});

router.get("/del", (req, res) => {
    let nombresCookies = Object.keys(req.cookies);
    nombresCookies.forEach(n => res.clearCookie(n));

    nombresCookies = Object.keys(req.signedCookies);
    nombresCookies.forEach(n => res.clearCookie(n));

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ payload: "Cookies eliminadas" });
});
