import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToMany, JoinTable } from "typeorm";
import * as bcrypt from 'bcrypt';
import { ArticleEntity } from "../article/article.entity";

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    username: string;

    @Column()
    email?: string;
    
    @Column({ default: '' })
    bio: string;

    @Column({ default: '' })
    image: string;

    @Column()
    password?: string;

    @ManyToMany(() => ArticleEntity, (article) => article.author)
    @JoinTable()
    favorites: ArticleEntity[];

    @OneToMany(() => ArticleEntity, (article) => article.author)
    articles: ArticleEntity[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

} 