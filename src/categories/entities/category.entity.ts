import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { TransactionEntity } from "../../transactions/entities/transaction.entity";

export enum CategoryType {
    INCOME = 'ingreso',
    EXPENSE = 'gasto',
    TRANSFER = 'transferencia',
    INVESTMENT = 'inversion',
    DEBT = 'deuda',
    SAVINGS = 'ahorro',
    OTHER = 'otro',
}

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
    
    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    name: string;

    @Column({
        type: 'text',
        default: CategoryType.OTHER,
    })
    type: CategoryType;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    description?: string;

    @Column({ default: true })
    isDefault: boolean;

    @ManyToOne(
        () => UserEntity,
        (user) => user.categories,
        { nullable: true, onDelete: 'CASCADE' }
    )
    user: UserEntity;

    // Relación recursiva: cada categoría puede tener una categoría padre
    @ManyToOne(() => CategoryEntity, (category) => category.children, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'parent_id' })
    parent: CategoryEntity;

    // Relación recursiva: una categoría puede tener muchas categorías hijas
    @OneToMany(() => CategoryEntity, (category) => category.parent)
    children: CategoryEntity[];


    @OneToMany( () => TransactionEntity, (transaction) => transaction.category_id)
    transactions: TransactionEntity[];
}