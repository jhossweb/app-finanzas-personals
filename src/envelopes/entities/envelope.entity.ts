import { BaseEntity } from "../../config/base.entity";
import { TransactionEntity } from "../../transactions/entities/transaction.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "envelope"})
export class EnvelopeEnity extends BaseEntity
{
    @Column({ type: "varchar", length: 100, nullable: false })
    name: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    envelpe_amount: number;

    @Column({ type: "boolean", default: true })
    is_active: boolean;

    // Relations with User
    @ManyToOne( () => UserEntity, (user) => user.envelopes, { nullable: false, onDelete: "CASCADE" } )
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

    @Column({ type: "uuid", nullable: false })
    user_id: string;


    // relation with transactions 
    @OneToMany( () => TransactionEntity, (transaction) => transaction.envelope )
    transactions: TransactionEntity[];

}
