import { json } from "express";
import { db } from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    // Verificar si el usuario existe
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("El usuario ya existe");

        // Crear nuevo usuario
        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUES (?)";

        const values = [req.body.username, req.body.email, hash, req.body.name];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(201).json({ message: "Usuario creado con éxito" });
        });
    });
};

export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("Usuario no encontrado");

        // Verificar contraseña
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if (!checkPassword) return res.status(401).json("Contraseña incorrecta");

        // Crear token JWT
        const token = jwt.sign({ id: data[0].id }, "secretKey");

        // Separar contraseña del resto de los datos
        const { password, ...others } = data[0];

        // Configurar cookie y devolver respuesta
        res
            .cookie("token", token, {
                httpOnly: true,
            })
            .status(200)
            .json({ message: "Usuario logueado", user: others });
    });
};

export const logout = (req, res) => {
    res.clearCookie("token"), {
        secure: true,
        sameSite: "none"
    }.status(200).json({ message: "Logout exitoso" });
};
