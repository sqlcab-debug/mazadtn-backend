import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppSetting } from "./entities/app-setting.entity";

@Injectable()
export class SettingsService {

  constructor(
    @InjectRepository(AppSetting)
    private repo: Repository<AppSetting>
  ){}

  async getAll() {
    return this.repo.find();
  }

  async get(key:string) {
    return this.repo.findOne({ where:{ key } });
  }

  async set(key:string,value:string) {

    let setting = await this.repo.findOne({ where:{ key } });

    if(!setting){
      setting = this.repo.create({ key,value });
    }else{
      setting.value = value;
    }

    setting.updatedAt = new Date();

    return this.repo.save(setting);
  }

}