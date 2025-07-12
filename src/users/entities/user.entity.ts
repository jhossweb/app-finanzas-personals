import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../config/base.entity";

import { CategoryEntity } from "../../categories/entities/category.entity";
import { TransactionEntity } from "../../transactions/entities/transaction.entity";

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity
{
    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
        unique: true,
    })
    username: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    password: string;

    
    @OneToMany(
        () => CategoryEntity, 
        (category) => category.user    
    )
    categories: CategoryEntity[];

    @OneToMany(
        () => TransactionEntity,
        (transaction) => transaction.user_id,
    )
    transactions: TransactionEntity[];

}
