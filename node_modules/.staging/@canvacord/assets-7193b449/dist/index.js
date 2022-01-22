"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class AssetManager {
    constructor(dir) {
        this.dir = dir;
        this.loaded = false;
        this.data = {};
    }
    load() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield fs_1.promises.readdir(this.dir);
            for (const file of files) {
                const name = ((_a = file.split(".").shift()) !== null && _a !== void 0 ? _a : file).toUpperCase();
                this.data[name] = `${this.dir}/${file}`;
            }
            this.loaded = true;
        });
    }
    clear() {
        this.data = {};
        this.loaded = false;
    }
    get(name) {
        return this.data[name];
    }
    set(name, data) {
        return this.data[name.toUpperCase()] = data;
    }
    get size() {
        return Object.keys(this.data).length;
    }
}
module.exports = {
    font: new AssetManager(path_1.default.join(__dirname, "..", "data", "fonts")),
    image: new AssetManager(path_1.default.join(__dirname, "..", "data", "images")),
    utils: {
        AssetManager
    }
};
