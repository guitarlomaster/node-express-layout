# Node.js layout

This project is for backend. It used node.js, express and typescript. Built with MVC pattern. 

## Start application

### At first

    npm install

### Development

    npm run dev
    
### Build

    npm run build
    
### Start built app
    
    npm start
    
### Migrations

This action is only needed to make changes in already existing database.

    npm run migrate

## Database & ORM

Sequelize plugin is used here as database ORM.

Sequelize documentation: https://sequelize.org/.

Quick start guide: https://metanit.com/web/nodejs/9.1.php

#### Creating migrations

This example describes migration witch adds a column to a table.

 - add a column to a model witch located in `src/app/core/models/`:
```
...
public table() {
    model = User.getDB().define("user", {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        new_column: {
            type: BOOLEAN,
            defaultValue: false
        }
    });
}
...
```

 - create migration file in `migrations/` folder witch format `DD.MM.YYYY-table-action`:
 
```
migrations
    |- ...
    |- 28.11.2020-users-add-new_column-column.js
    |- ...
```

 - describe migration in the file:
 
```
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("users", "new_column", {
           type: Sequelize.BOOLEAN,
           defaultValue: false
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("users", "new_column")
    }
};
```

 - do `npm run migrate`.

## Model

Models are located in ***src/app/core/models/*** folder. Every model class must be extended from `Model` class, witch is in ***src/kernel/mvc/*** folder.
After model file and class is created you should place the model class instance to `modelsRegistry` array witch is in the same folder as your new model.

Inside model class there `public table(): void;` must be placed. Also `public relations(): void` could be overwritten.
 - database table should be defined via `define` function of sequelize plugin inside `table` method. Execution result of the function should be defined in a variable outside the class in the same file.
 - relations should be defined in `relations` method.
 
Model example is in ***src/app/core/models/User.ts*** file.

## Router

To declare routing urls and handlers (Controllers) there `Routes` class is used. `Routes` are extended from `Router`,
witch is located in ***src/kernel/mvc/*** folder.

Routes example is in `register` method in `Routes` class in ***src/app/core/router/Routes.ts*** file.

## Controller

Controllers are located in ***src/app/core/controllers/*** folder. Requests there can be validated and handled.
