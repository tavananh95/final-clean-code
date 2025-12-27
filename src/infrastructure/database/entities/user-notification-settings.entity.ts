import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'user_notification_settings' })
export class UserNotificationSettingsEntity {
    @PrimaryColumn('uuid')
    userId!: string;

    @Column({ default: true })
    enabled!: boolean;

    @Column({ type: 'time' })
    timeOfDay!: string;

    @Column()
    timezone!: string;

    @Column({ type: 'timestamptz', nullable: true })
    nextRunAt!: Date | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
