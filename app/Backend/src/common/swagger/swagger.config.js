import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Tutor Support System API",
        version: "1.0",
        description: "Cinema"
    },

    servers: [
        {
            url: "http://localhost:3069",
        }
    ],

    tags: [
        {
            name: "Auth",
            description: "Các APIs liên quan đến người dùng"
        },
        {
            name: "Admin",
            description: "Các APIs dành cho quản trị hệ thống"
        }

    ],

    "components": {
        "securitySchemes": {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
        }
    }


}

const options = {
    definition: swaggerDefinition,
    apis: ["../../routers/*.js", "./src/controllers/*.js"] // which contain Swagger comment
}

const swaggerSpec = swaggerJSDoc(options)

export function setupSwagger(app){
    app.use("/swagger/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}