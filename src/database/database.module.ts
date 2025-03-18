import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './typeorm-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ConfigService } from '@nestjs/config';
// import { mongodbToken, IMongoConfig } from 'src/config';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    // MongooseModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => {
    //     try{
    //         const mongoConfig = configService.get<IMongoConfig>(mongodbToken);
    //     if (!mongoConfig) {
    //       throw new Error('MongoDB configuration is not defined!');
    //     }
    //     return {
    //       uri: mongoConfig.mongo_url || 'mongodb+srv://taskbees:TaskBees%401@taskbees-notifications.d0vmc.mongodb.net/?retryWrites=true&w=majority&appName=taskbees-notifications',
    //       dbName: mongoConfig.mongo_database || 'taskbees-notifications',
    //     };
    //     }catch(error){
    //         console.log("the error stack is: " + error.stack);
    //     }
    //   },
    //   inject: [ConfigService],
    // }),
  ],
})
export class DatabaseModule {}
