import axios, { AxiosRequestConfig } from "axios";
import UserAgent from "random-useragent";
import { clean, _required } from "./utils/Core";
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
import BrainlyError from "./utils/BrainlyError";
import type { Jawaban, FinalData, Answers, QuestionList, Languages } from "./@typings";

const format_graphql = `query SearchQuery($query: String!, $first: Int!, $after: ID) {\n	questionSearch(query: $query, first: $first, after: $after) {\n	edges {\n	  node {\ncontent\n		attachments{\nurl\n}\n		answers {\n			nodes {\ncontent\n				attachments{\nurl\n}\n}\n}\n}\n}\n}\n}\n`;

/**
 * @param {String} query Pertanyaan yang akan ditanyakan
 * @param {Integer} count Jumlah data yang akan ditampilkan
 * @param {Languages} lang Bahasa yang akan dipilih
 */

const Brainly = async (query: string, count: number, lang?: Languages) => {
    let language = "";
    _required(query);
    _required(count);
    if (lang) language = lang;
    else language = "id";

    if (!countryCode.includes(language.toLowerCase())) throw new BrainlyError("LANGUAGE_DOESNT_EXIST", language.toLowerCase());
    const service: AxiosRequestConfig = {
        method: "POST",
        url: `https://brainly.co.id/graphql/${language.toLowerCase()}`,
		headers: {
			'host': 'brainly.co.id',
            "content-type": "application/json; charset=utf-8",
            "user-agent": UserAgent.getRandom(o => o.browserName === "Chrome")
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

    const response = await axios(service);
        let question_list = response.data.data.questionSearch.edges as QuestionList[];
        if (question_list.length) {
            let final_data: FinalData[] = [];
            question_list.forEach(question => {
                let jawaban: (Jawaban[]) = [];
                let answers = question.node.answers.nodes;
                if (answers.length) {
                    answers.forEach((answer: Answers) => {
                        jawaban.push({
                            text: clean(answer.content),
                            media: (answer.attachments.length) ? answer.attachments.map((file: { url: string }) => file.url) : []
                        });
                    });
                }

                final_data.push({
                    "pertanyaan": clean(question.node.content),
					"jawaban": jawaban,
					"questionMedia": (question.node.attachments.length) ? question.node.attachments.map((file: { url: string }) => file.url) : [],
                });
            });

            return {
                    'success': true,
                    'length': final_data.length,
                    'headers': response.headers,
                    'message': 'Request Success',
                    'data': final_data
            };
        } else {
            return {
				'success': true,
                'length': 0,
                'headers': response.headers,
				'message': 'Data not found',
				'data': []
			};
        }
};

export { Brainly as default }