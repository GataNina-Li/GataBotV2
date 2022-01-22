"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
const axios_1 = __importDefault(require("axios"));
const random_useragent_1 = __importDefault(require("random-useragent"));
const Core_1 = require("./utils/Core");
const lists = {
    "id": "https://brainly.co.id",
    "us": "https://brainly.com",
    "es": "https://brainly.lat",
    "pt": "https://brainly.com.br",
    "ru": "https://znanija.com",
    "ro": "https://brainly.ro",
    "tr": "https://eodev.com",
    "ph": "https://brainly.ph",
    "pl": "https://brainly.pl",
    "hi": "https://brainly.in"
};
const countryCode = Object.keys(lists);
const BrainlyError_1 = __importDefault(require("./utils/BrainlyError"));
const format_graphql = `query SearchQuery($query: String!, $first: Int!, $after: ID) {\n	questionSearch(query: $query, first: $first, after: $after) {\n	edges {\n	  node {\ncontent\n		attachments{\nurl\n}\n		answers {\n			nodes {\ncontent\n				attachments{\nurl\n}\n}\n}\n}\n}\n}\n}\n`;
/**
 * @param {String} query Pertanyaan yang akan ditanyakan
 * @param {Integer} count Jumlah data yang akan ditampilkan
 * @param {Languages} lang Bahasa yang akan dipilih
 */
const Brainly = async (query, count, lang) => {
    let language = "";
    Core_1._required(query);
    Core_1._required(count);
    if (lang)
        language = lang;
    else
        language = "id";
    if (!countryCode.includes(language.toLowerCase()))
        throw new BrainlyError_1.default("LANGUAGE_DOESNT_EXIST", language.toLowerCase());
    const service = {
        method: "POST",
        url: `https://brainly.co.id/graphql/${language.toLowerCase()}`,
        headers: {
            'host': 'brainly.co.id',
            "content-type": "application/json; charset=utf-8",
            "user-agent": random_useragent_1.default.getRandom(o => o.browserName === "Chrome")
        },
        data: {
            "operationName": "SearchQuery",
            "variables": {
                "query": query,
                "after": null,
                "first": count
            },
            "query": format_graphql
        }
    };
    const response = await axios_1.default(service);
    let question_list = response.data.data.questionSearch.edges;
    if (question_list.length) {
        let final_data = [];
        question_list.forEach(question => {
            let jawaban = [];
            let answers = question.node.answers.nodes;
            if (answers.length) {
                answers.forEach((answer) => {
                    jawaban.push({
                        text: Core_1.clean(answer.content),
                        media: (answer.attachments.length) ? answer.attachments.map((file) => file.url) : []
                    });
                });
            }
            final_data.push({
                "pertanyaan": Core_1.clean(question.node.content),
                "jawaban": jawaban,
                "questionMedia": (question.node.attachments.length) ? question.node.attachments.map((file) => file.url) : [],
            });
        });
        return {
            'success': true,
            'length': final_data.length,
            'headers': response.headers,
            'message': 'Request Success',
            'data': final_data
        };
    }
    else {
        return {
            'success': true,
            'length': 0,
            'headers': response.headers,
            'message': 'Data not found',
            'data': []
        };
    }
};
exports.default = Brainly;
