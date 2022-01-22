export interface Jawaban {
    text: string;
    media: string[] | [];
}

export interface FinalData {
    pertanyaan: string;
    jawaban: Jawaban[],
    questionMedia: string[] | [];
}

export type Languages = "id" | "us" | "es" | "pt" | "ru" | "ro" | "tr" | "ph" | "pl" | "hi";

export interface Answers {
    content: string;
    attachments: { url: string; }[];
}

export interface QuestionList {
    node: {
        answers: {
            nodes: Answers[]
        },
        content: string;
        attachments: { url: string; }[]
    }
}