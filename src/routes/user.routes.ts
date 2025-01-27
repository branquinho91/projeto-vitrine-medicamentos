import { Router, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import User from "../entities/User";
// import bcrypt from "bcrypt";

const userRoutes = Router();

const userRepository = AppDataSource.getRepository(User);

userRoutes.post(
  "/users",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ error: "Preencha todos os campos" });
        return;
      }

      const user = userRepository.create({ name, email, password });

      await userRepository.save(user);

      res.json(user);
    } catch {
      res.status(500).json("Erro ao salvar usuário");
    }
  },
);

userRoutes.post(
  "/login",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await userRepository.findOne({ email });

      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      // const isValidPassword = await bcrypt.compare(password, user.password);

      // if (!isValidPassword) {
      //   res.status(401).json({ error: "Senha inválida" });
      //   return;
      // }

      res.json(user);
    } catch {
      res.status(500).json("Erro ao fazer login");
    }
  },
);

export default userRoutes;
