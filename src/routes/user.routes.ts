import { Router, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import bcrypt from "bcrypt";
import User from "../entities/User";

const userRouter = Router();
const userRepository = AppDataSource.getRepository(User);

userRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Preencha todos os campos" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);
    res.status(201).json(user);
  } catch {
    res.status(500).json({ error: "Erro ao salvar usuário" });
  }
});

export default userRouter;
