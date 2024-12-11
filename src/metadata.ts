/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [[import("./cat/dto/create-cat.dto"), { "CreateCatDto": { name: { required: true, type: () => String, description: "\u540D\u5B57" }, age: { required: true, type: () => Number, description: "\u5E74\u9F84", minimum: 1 }, sex: { required: false, type: () => String, description: "\u6027\u522B" } } }], [import("./cat/dto/update-cat.dto"), { "UpdateCatDto": {} }], [import("./cat/entities/cat.entity"), { "Cat": {} }]], "controllers": [[import("./app.controller"), { "AppController": { "getHello": { type: String }, "users": {} } }], [import("./cat/cat.controller"), { "CatController": { "create": { type: String }, "findAll": { type: String }, "findOne": { type: String }, "update": { type: String }, "remove": { type: String } } }], [import("./auth/auth.controller"), { "AuthController": { "login": { description: "\u7528\u6237\u767B\u9646", type: Object }, "jwtLogin": { type: Object }, "jwtRefresh": { type: Object } } }]] } };
};