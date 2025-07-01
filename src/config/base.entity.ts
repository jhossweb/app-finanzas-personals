import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

export class BaseEntity 
{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({
        type: "datetime",
        default: () => "CURRENT_TIMESTAMP",
        name: "created_at"
    })
    createdAt: Date;

    @CreateDateColumn({
        type: "datetime",
        default: () => "CURRENT_TIMESTAMP",
        name: "updated_at"
    })
    updatedAt: Date;
}