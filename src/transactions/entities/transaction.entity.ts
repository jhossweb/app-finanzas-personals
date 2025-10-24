import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { CategoryEntity } from "../../categories/entities/category.entity";
import { EnvelopeEnity } from "../../envelopes/entities/envelope.entity";

@Entity({ name: 'transactions' })
export class TransactionEntity extends BaseEntity
{
    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    amount: number;
    
    @Column({ type: "varchar", length: 50, nullable: false })
    currency: string;
    
    @Column({ type: "varchar", length: 255, nullable: true })
    description?: string;
    
    @ManyToOne( () => UserEntity, user => user.transactions, { nullable: false, onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'user_id' })
    user_id: UserEntity;

    @ManyToOne( () => CategoryEntity, category => category.transactions, { nullable: false, onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'category_id' })
    category_id: CategoryEntity;


    // relations envelope
    @ManyToOne( () => EnvelopeEnity, envelope => envelope.transactions, { nullable: true, onUpdate: 'RESTRICT' })
    @JoinColumn({ name: 'envelope_id' })
    envelope: EnvelopeEnity;

    @Column({ type: "uuid", nullable: true })
    envelope_id: string;
}
