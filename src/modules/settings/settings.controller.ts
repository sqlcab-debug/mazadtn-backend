import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { SettingsService } from "./settings.service";

@Controller("settings")
export class SettingsController {

  constructor(private readonly service:SettingsService){}

  @Get()
  async getAll(){
    return this.service.getAll();
  }

  @Get(":key")
  async get(@Param("key") key:string){
    return this.service.get(key);
  }

  @Put(":key")
  async set(
    @Param("key") key:string,
    @Body() body:{value:string}
  ){
    return this.service.set(key,body.value);
  }

}