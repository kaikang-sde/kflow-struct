import type { IComponent, IComponentData, IPage, TComponentTypes } from '@kflow-struct/share';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'page' })
export class Page implements IPage {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column()
    account_id: number = 0;

    @Column()
    page_name: string = '';

    @Column({ type: 'simple-array' })
    components: string[] = [];

    // page description
    @Column()
    tdk: string = '';

    @Column()
    desc: string = '';
}

@Entity({ name: 'component' })
export class Component implements IComponent {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column()
    type: TComponentTypes = 'titleText';

    @Column()
    page_id: number = 0;

    @Column()
    account_id: number = 0;

    // 自定义属性
    @Column({ type: 'simple-json' })
    options: Record<string, any> = {};
}

@Entity({ name: 'component_data' })
export class ComponentData implements IComponentData {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column()
    page_id: number = 0;

    @Column()
    user: string = '';

    @Column({ type: 'simple-json' })
    props: {
        id: number;
        value: string | string[];
    }[] = [];
}