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

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false, default: 0 })
    envelope_amount: number;

    @Column({ type: "boolean", default: true })
    is_active: boolean;

    @Column({ type: "boolean", default: false })
    is_main: boolean;


    // Relations with User
    @ManyToOne( () => UserEntity, (user) => user.envelopes, { nullable: false, onDelete: "CASCADE" } )
    @JoinColumn({ name: "user_id" })
    user_id: UserEntity;


    // relation with transactions 
    @OneToMany( () => TransactionEntity, (transaction) => transaction.envelope )
    transactions: TransactionEntity[];

}
