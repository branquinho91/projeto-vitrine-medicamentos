import { Router, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import bcrypt from "bcrypt";
import User from "../entities/User";

const authRouter = Router();
const userRepository = AppDataSource.getRepository(User);

authRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Preencha todos os campos!" });
      return;
    }

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado!" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      res.status(200).json({ userId: user.id });
    } else {
      res.status(401).json({ error: "Usuário e/ou Senha incorreta!" });
    }
  } catch {
    res.status(500).json("Erro ao salvar usuário!");
  }
});

export default authRouter;
