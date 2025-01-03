/* eslint-disable */
export default async () => {
    const t = {
        [".pnpm/@nestjs+common@10.4.15_prqteaxeztlh7hcpcoxjb3p2le/node_modules/@nestjs/common/enums/http-status.enum"]: await import(".pnpm/@nestjs+common@10.4.15_prqteaxeztlh7hcpcoxjb3p2le/node_modules/@nestjs/common/enums/http-status.enum"),
        ["./auth/entities/menu.entity"]: await import("./auth/entities/menu.entity"),
        ["./auth/entities/login.entity"]: await import("./auth/entities/login.entity"),
        ["./auth/entities/user-info.entity"]: await import("./auth/entities/user-info.entity")
    };
    return { "@nestjs/swagger": { "models": [[import("./common/entities/format-response.entity"), { "FormatResponseEntity": { statusCode: { required: false, description: "\u72B6\u6001\u7801", default: 200, enum: t[".pnpm/@nestjs+common@10.4.15_prqteaxeztlh7hcpcoxjb3p2le/node_modules/@nestjs/common/enums/http-status.enum"].HttpStatus }, data: { required: false, description: "\u8FD4\u56DE\u6570\u636E" }, message: { required: false, type: () => String, description: "\u8FD4\u56DE\u4FE1\u606F", default: "success" } }, "NullResponseEntity": { data: { required: false, description: "\u8FD4\u56DE\u6570\u636E" } } }], [import("./user/entities/user-permission-info.entity"), { "UserPermissionInfoEntity": { username: { required: true, type: () => String, description: "\u7528\u6237\u540D" }, nickname: { required: true, type: () => String, description: "\u6635\u79F0" }, avatar: { required: true, type: () => String, description: "\u5934\u50CF" }, role_names: { required: true, type: () => String, description: "\u89D2\u8272" }, id: { required: true, type: () => Number, description: "\u6743\u9650id" }, pid: { required: true, type: () => Number, description: "\u7236\u6743\u9650id" }, name: { required: true, type: () => String, description: "\u6743\u9650\u540D\u79F0" }, path: { required: true, type: () => String, description: "\u6743\u9650\u8DEF\u5F84" }, permission: { required: true, type: () => String, description: "\u6743\u9650\u6807\u8BC6" }, type: { required: true, type: () => Object, description: "\u6743\u9650\u7C7B\u578B" }, component: { required: true, type: () => String, description: "\u7EC4\u4EF6\u8DEF\u5F84" }, cache: { required: true, type: () => Boolean, description: "\u662F\u5426\u7F13\u5B58" }, hidden: { required: true, type: () => Boolean, description: "\u662F\u5426\u9690\u85CF" }, icon: { required: true, type: () => String, description: "\u56FE\u6807" }, redirect: { required: true, type: () => String, description: "\u91CD\u5B9A\u5411\u5730\u5740" }, props: { required: true, type: () => Boolean, description: "\u8DEF\u7531\u5C5E\u6027" }, sort: { required: true, type: () => Number, description: "\u6392\u5E8F" } } }], [import("./permission/entities/permission.entity"), { "PermissionEntity": { id: { required: true, type: () => Number, description: "\u6743\u9650id" }, type: { required: true, type: () => Object, description: "\u6743\u9650\u7C7B\u578B" }, name: { required: true, type: () => String, description: "\u6743\u9650\u540D\u79F0" }, permission: { required: true, type: () => String, description: "\u6743\u9650\u6807\u8BC6" }, icon: { required: true, type: () => String, description: "\u56FE\u6807" }, path: { required: true, type: () => String, description: "\u6743\u9650\u8DEF\u5F84" }, component: { required: true, type: () => String, description: "\u7EC4\u4EF6\u8DEF\u5F84" }, sort: { required: true, type: () => Number, description: "\u6392\u5E8F" }, redirect: { required: true, type: () => String, description: "\u91CD\u5B9A\u5411\u5730\u5740" }, disabled: { required: true, type: () => Boolean, description: "\u662F\u5426\u7981\u7528" }, hidden: { required: true, type: () => Boolean, description: "\u662F\u5426\u9690\u85CF", default: false }, cache: { required: true, type: () => Boolean, description: "\u662F\u5426\u7F13\u5B58", default: false }, props: { required: true, type: () => Boolean, description: "\u8DEF\u7531\u5C5E\u6027", default: false }, createdAt: { required: true, type: () => String, description: "\u521B\u5EFA\u65F6\u95F4(UTC)" }, updatedAt: { required: true, type: () => String, description: "\u66F4\u65B0\u65F6\u95F4(UTC)" }, pid: { required: true, type: () => Number, description: "\u7236\u6743\u9650id" } } }], [import("./auth/entities/menu.entity"), { "MenuEntity": { children: { required: false, type: () => [t["./auth/entities/menu.entity"].MenuEntity], description: "\u5B50\u83DC\u5355" } } }], [import("./auth/entities/user-info.entity"), { "UserInfoEntity": { nickname: { required: true, type: () => String, description: "\u6635\u79F0" }, username: { required: true, type: () => String, description: "\u7528\u6237\u540D" }, avatar: { required: false, type: () => String, description: "\u7528\u6237\u5934\u50CF" }, roles: { required: false, type: () => [String], description: "\u7528\u6237\u89D2\u8272" }, permissions: { required: false, type: () => [String], description: "\u7528\u6237\u6743\u9650" }, menus: { required: false, type: () => [t["./auth/entities/menu.entity"].MenuEntity], description: "\u7528\u6237\u53EF\u8BBF\u95EE\u83DC\u5355" } } }], [import("./auth/entities/login.entity"), { "LoginEntity": { accessToken: { required: true, type: () => String, description: "\u8BBF\u95EE\u4EE4\u724C" }, refreshToken: { required: true, type: () => String, description: "\u5237\u65B0\u4EE4\u724C" } } }], [import("./auth/dto/login.dto"), { "LoginDto": { username: { required: true, type: () => String, description: "\u7528\u6237\u540D" }, password: { required: true, type: () => String, description: "\u5BC6\u7801" }, captcha: { required: true, type: () => String, description: "\u9A8C\u8BC1\u7801", pattern: "/^[a-zA-Z0-9]{4}$/" } } }], [import("./auth/dto/refresh-token.dto"), { "RefreshTokenDto": { refreshToken: { required: true, type: () => String, description: "\u5237\u65B0\u4EE4\u724C" } } }], [import("./auth/entities/captcha.entity"), { "CaptchaEntity": { captcha: { required: true, type: () => String, description: "base64 \u683C\u5F0F\u9A8C\u8BC1\u7801", default: "data:image/svg+xml;base64,***" } } }], [import("./auth/dto/password.dto"), { "PasswordDto": { oldPassword: { required: true, type: () => String, description: "\u539F\u5BC6\u7801" }, newPassword: { required: true, type: () => String, description: "\u65B0\u5BC6\u7801" } } }], [import("./user/entities/user.entity"), { "UserEntity": { id: { required: true, type: () => String, description: "\u7528\u6237ID" }, username: { required: true, type: () => String, description: "\u7528\u6237\u540D" }, disabled: { required: true, type: () => Boolean, description: "\u662F\u5426\u7981\u7528" }, createdAt: { required: true, type: () => String, description: "\u521B\u5EFA\u65F6\u95F4(UTC)" }, updatedAt: { required: true, type: () => String, description: "\u66F4\u65B0\u65F6\u95F4(UTC)" } } }]], "controllers": [[import("./auth/auth.controller"), { "AuthController": { "getCaptcha": {}, "login": { type: t["./auth/entities/login.entity"].LoginEntity }, "logout": {}, "refreshToken": { type: t["./auth/entities/login.entity"].LoginEntity }, "getUserInfo": { type: t["./auth/entities/user-info.entity"].UserInfoEntity } } }], [import("./app.controller"), { "AppController": { "getHello": { type: String }, "getName": { type: String } } }]] } };
};