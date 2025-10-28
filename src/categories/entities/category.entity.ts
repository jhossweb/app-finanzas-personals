import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { TransactionEntity } from "../../transactions/entities/transaction.entity";


@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
    
    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    description?: string;


    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @ManyToOne(
        () => UserEntity,
        (user) => user.categories,
        { nullable: true, onDelete: 'CASCADE' }
    )
    user: UserEntity;


    @OneToMany( () => TransactionEntity, (transaction) => transaction.category_id)
    transactions: TransactionEntity[];
}