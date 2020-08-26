import { User } from '../entity/User';
import { createConnection } from "typeorm";
import { Place } from '../entity/Place';
import { Professional } from '../entity/Professional';
import { Service } from '../entity/Service';
import { Agenda } from '../entity/Agenda';
import { ServiceProvider } from '../entity/ServiceProvider';
import { Promotion } from '../entity/Promotion';
import { News } from '../entity/News';
import { Points } from '../entity/Points';
import { Category } from '../entity/Category';
import { Products } from '../entity/Products';
import { Push } from '../entity/Push';
import { Notification } from '../entity/Notification';
import { Admin } from '../entity/Admin';
import { Plans } from '../entity/Plans';
import { Sale } from '../entity/Sales';

const cfg = require('../../ormconfig.json');

export default {
  createConnection: async () => {
    await createConnection(
      {
        type: cfg.type,
        host: cfg.host,
        port: cfg.port,
        username: cfg.username,
        password: cfg.password,
        database: cfg.database,
        synchronize: true,
        logging: false,
        entities: [
          User,
          Place,
          Professional,
          Service,
          Agenda,
          ServiceProvider,
          Promotion,
          News,
          Points,
          Category,
          Products,
          Push,
          Notification,
          Admin,
          Plans,
          Sale
        ]
      }
    );
    console.log('Database connected');
  }
}