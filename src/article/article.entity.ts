import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, BeforeUpdate, JoinColumn, OneToMany } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { CommentEntity } from '../comment/comment.entity';

@Entity({ name: 'articles' })
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @Column({ default: '' })
    title: string;

    @Column({ default: '' })
    description: string;

    @Column()
    body: string;

    @Column('simple-array')
    tagList: string[];

    @Column({type: 'timestamp',  default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({type: 'timestamp',  default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ default: 0 })
    favoritesCount: number;

    @Column()
    authorId: number;

    @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true })
    @JoinColumn({ name: 'authorId' })
    author: UserEntity;

    @OneToMany(() => CommentEntity, (comment) => comment.article)
    comments: CommentEntity[];

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }
}