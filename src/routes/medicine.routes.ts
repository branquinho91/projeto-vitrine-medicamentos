import { Router, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import Medicine from "../entities/Medicine";

const medicineRouter = Router();
const medicineRepository = AppDataSource.getRepository(Medicine);

medicineRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, quantity, userId } = req.body;

    if (!name || !quantity || !userId) {
      res.status(400).json({ error: "Preencha todos os campos" });
      return;
    }

    const medicine = medicineRepository.create({
      name,
      description,
      quantity,
      userId,
    });

    await medicineRepository.save(medicine);
    res.status(201).json(medicine);
  } catch {
    res.status(500).json({ error: "Erro ao salvar medicamento" });
  }
});

medicineRouter.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const medicines = await medicineRepository.find();

    if (!medicines) {
      res.status(200).json({ message: "Nenhum medicamento encontrado" });
      return;
    }

    res.json(medicines);
  } catch {
    res.status(500).json({ error: "Erro ao buscar medicamentos" });
  }
});

medicineRouter.get(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const medicine = await medicineRepository.findOneBy({
        id: Number(id),
      });

      if (!medicine) {
        res.status(200).json({ message: "Medicamento não encontrado" });
        return;
      }

      res.json(medicine);
    } catch {
      res.status(500).json({ error: "Erro ao buscar medicamento" });
    }
  },
);

medicineRouter.get(
  "/all",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.headers.userId);

      if (!userId) {
        res.status(400).json({ error: "Usuário não informado" });
        return;
      }

      const medicines = await medicineRepository.find({ where: { userId } });

      if (!medicines) {
        res.status(200).json({ message: "Nenhum medicamento encontrado" });
        return;
      }

      res.json(medicines);
    } catch {
      res.status(500).json({ error: "Erro ao buscar medicamentos" });
    }
  },
);

medicineRouter.put(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description, quantity, userId } = req.body;
      const medicine = await medicineRepository.findOneBy({
        id: Number(id),
      });

      if (!medicine) {
        res.status(200).json({ message: "Medicamento não encontrado" });
        return;
      }

      medicine.name = name || medicine.name;
      medicine.description = description || medicine.description;
      medicine.quantity = quantity || medicine.quantity;
      medicine.userId = userId || medicine.userId;

      await medicineRepository.save(medicine);
      const medicineUpdated = await medicineRepository.findOneBy({
        id: Number(id),
      });

      res.json(medicineUpdated);
    } catch {
      res.status(500).json({ error: "Erro ao atualizar medicamento" });
    }
  },
);

medicineRouter.delete(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const medicine = await medicineRepository.findOneBy({
        id: Number(id),
      });

      if (!medicine) {
        res.status(200).json({ message: "Medicamento não encontrado" });
        return;
      }

      await medicineRepository.delete(medicine);
      res.json({ message: "Medicamento deletado com sucesso" });
    } catch {
      res.status(500).json({ error: "Erro ao deletar medicamento" });
    }
  },
);

export default medicineRouter;
