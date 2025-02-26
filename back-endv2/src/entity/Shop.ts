import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from "typeorm";
import { Customization } from "./Customization";
import { Translation } from "./Translation";

@Entity()
export class Shop {
  @PrimaryColumn()
  shopify_domain: string;

  @Column()
  active: number; 

  @Column({ nullable: true })
  access_token: string; 

  @Column({ nullable: true, type:'varchar', length:500 })
  shopify_access_scopes_granted: string; 

  @Column({nullable : true})
  shop_owner: string; 

  @Column({ nullable: true })
  storefront_access_token: string;

  @Column({ nullable: true })
  shopify_plan: string;

  @Column({ nullable: true })
  email: string; 

  @Column({ nullable: true })
  country: string; 

  @Column({ nullable: true })
  money_format: string; 

  @Column({ nullable: true })
  money_with_currency_format: string; 

  @CreateDateColumn()
  created_at: Date; 

  @UpdateDateColumn()
  updated_at: Date; 

  @OneToOne(() => Customization, (customization) => customization.shopify_domain, { cascade: true })
  customization: Customization; 

  @OneToMany(() => Translation, (translation) => translation.shopify_domain)
  translations: Translation[]; 
}
