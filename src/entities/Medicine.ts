import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import User from "./User";

@Entity("medicines")
class Medicine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "int", nullable: false })
  quantity: number;

  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;
}

export default Medicine;
