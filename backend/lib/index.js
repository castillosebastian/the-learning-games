"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChapterBookFlow = exports.storyBookFlow = exports.generateChapterPrompt = exports.startStoryBookPrompt = void 0;
const ai_1 = require("@genkit-ai/ai");
const core_1 = require("@genkit-ai/core");
const googleai_1 = require("@genkit-ai/googleai");
const z = __importStar(require("zod"));
const firebase_1 = require("@genkit-ai/firebase");
const googleai_2 = require("@genkit-ai/googleai");
const flow_1 = require("@genkit-ai/flow");
const dotprompt_1 = require("@genkit-ai/dotprompt");
const genres_json_1 = require("./genres.json");
const content_atributes_by_age_json_1 = __importDefault(require("./content_atributes_by_age.json")); // Import JSON file
const interaction_hook_json_1 = __importDefault(require("./interaction_hook.json")); // Import interaction hook JSON
(0, core_1.configureGenkit)({
    plugins: [
        (0, dotprompt_1.dotprompt)(),
        (0, firebase_1.firebase)(),
        (0, googleai_2.googleAI)({
            apiVersion: "v1beta"
        }),
    ],
    logLevel: "debug",
    enableTracingAndMetrics: true,
});
const supportedLanguages = z.enum(["spanish", "english", "portuguese"]);
const supportedAudiences = z.enum(["kids", "teenagers", "adults"]);
const supportedGenres = z.enum(['adventure', 'discovery', 'travel', 'novel', 'mystery', 'fantasy', 'science fiction', 'historical fiction', 'horror', 'romance', 'coming of age', 'thriller', 'comedy', 'dystopian', 'mythology', 'biography', 'folktale', 'supernatural', 'urban fantasy', 'espionage', 'post-apocalyptic', 'psychological drama', 'sports', 'legal drama']);
console.log(supportedGenres);
const age = 10; // Define the fixed age variable
// Filter characteristics based on age
const filteredAttributes = ((_a = content_atributes_by_age_json_1.default.find(attr => {
    return age >= attr.age_from && (attr.age_to === null || age <= attr.age_to);
})) === null || _a === void 0 ? void 0 : _a.characteristics) || [];
// Define variables
const user_name = "John";
const educational_content = `
Quantum mechanics is a fundamental theory in physics that describes nature at the smallest scales of energy levels of atoms and subatomic particles. It explains phenomena that classical mechanics cannot, such as the dual particle-wave nature of light and matter, and the behavior of particles at the quantum level. Understanding quantum mechanics is crucial for advancements in fields like quantum computing, cryptography, and various technological innovations.
`;
exports.startStoryBookPrompt = (0, ai_1.definePrompt)({
    name: 'startStoryBookPrompt',
    inputSchema: z.object({
        audience: z.enum(["kids", "teenagers", "adults"]),
        numChapters: z.number(),
        topic: z.string(),
        language: supportedLanguages,
        genre: supportedGenres,
    }),
}, 
// here 
async (input) => {
    var _a;
    const systemPrompt = `
        You are a learning tool for an audience of ${input.audience}. Your task is to generate a storybook for educational purposes that combines the logic of a game with the richness of education.    
        The game aspect is provided by the interactive content at the end of each chapter. The educational aspect is delivered through the narrative of the book, which harmoniously integrates educational content into a brilliantly written story.    
        This story should always include the user as the main character and protagonist, referred to by their name.    
        The content should be provided in markdown format and use language expressions appropriate for the specified audience. The storybook should be an engaging, informative, gamified experience.    
        Never use violent, harmful, or aggressive content.    
        The language used should be clear, age-appropriate, and educational.`;
    const userPrompt = `Write an index page for a storybook in the genre of ${input.genre}, with ${input.numChapters} chapters about ${input.topic}. 
        Take into account that this genre has the following characteristics: ${(_a = genres_json_1.story_types.find(st => st.type === input.genre)) === null || _a === void 0 ? void 0 : _a.characterization}
        This storybook is intended for a person who is ${age} years old, so the content should follow these guidelines: ${filteredAttributes.join(", ")}. 
        The main character of the story is ${user_name}, who will embark on a fascinating journey of learning. 
        Integrate the following educational content into the chapters: ${educational_content}`;
    return {
        messages: [{
                role: 'system', content: [
                    { text: systemPrompt }
                ]
            }, {
                role: 'user', content: [
                    { text: userPrompt }
                ]
            }],
        config: { temperature: 0.9 },
        output: {
            schema: z.object({
                topic: z.string(),
                title: z.string(),
                indexContent: z.string(),
            })
        }
    };
});
exports.generateChapterPrompt = (0, ai_1.definePrompt)({
    name: "generateChapterPrompt",
    inputSchema: z.object({
        audience: supportedAudiences,
        indexContent: z.string(),
        chapter: z.number(),
        language: supportedLanguages
    }),
}, async (input) => {
    // Select a random interactive element
    const randomElement = interaction_hook_json_1.default.interactive_elements[Math.floor(Math.random() * interaction_hook_json_1.default.interactive_elements.length)];
    const interactiveContent = `${randomElement.type}: ${randomElement.characterization}. Example: ${randomElement.example}`;
    const systemPrompt = `
    You are a learning tool for an audience of ${input.audience}. Your task is to generate a storybook for educational purposes that combines the logic of a game with the richness of education.    
    The game aspect is provided by the interactive content at the end of each chapter. The educational aspect is delivered through the narrative of the book, which harmoniously integrates educational content into a brilliantly written story.    
    This story should always include the user as the main character and protagonist, referred to by their name.    
    The content should be provided in markdown format and use language expressions appropriate for the specified audience. The storybook should be an engaging, informative, gamified experience.    
    Never use violent, harmful, or aggressive content.    
    The language used should be clear, age-appropriate, and educational.    
    Here is the index content for reference: ${input.indexContent}. Use this index content as a guide to ensure the story flows logically and covers the topics listed.
    `;
    const userPrompt = `
    Write a detailed 2-page chapter ${input.chapter}. Be elaborate in your descriptions and ensure the chapter is engaging and informative.
    The main character of the story is ${user_name}, who will embark on a fascinating journey. Integrate the following educational content into the chapter: ${educational_content}    
    Critically important: at the end of the chapter, include the following interactive content: ${interactiveContent}. This interactive element is meant to reinforce learning and keep the reader engaged. Make sure it is seamlessly integrated into the chapter and relevant to the content discussed.
    `;
    return {
        messages: [{
                role: 'system', content: [
                    { text: systemPrompt }
                ]
            }, {
                role: 'user', content: [
                    { text: userPrompt }
                ]
            }],
        config: { temperature: 0.9 },
    };
});
exports.storyBookFlow = (0, flow_1.defineFlow)({
    name: "storyBookFlow",
    inputSchema: z.object({
        audience: supportedAudiences,
        numChapters: z.number(),
        topic: z.string(),
        language: supportedLanguages,
        genre: supportedGenres,
    }),
    outputSchema: z.object({
        topic: z.string(),
        indexContent: z.string(),
        numChapters: z.number(),
        audience: supportedAudiences,
        language: supportedLanguages,
    })
}, async ({ numChapters, audience, topic, language, genre }) => {
    const startingPrompt = await (0, ai_1.renderPrompt)({
        prompt: exports.startStoryBookPrompt,
        input: { numChapters, topic, audience, language, genre },
        model: googleai_1.gemini15Flash
    });
    let result = await (0, ai_1.generate)(startingPrompt);
    let response = {
        topic: topic,
        indexContent: result.text(),
        audience,
        language,
        numChapters
    };
    return response;
});
exports.generateChapterBookFlow = (0, flow_1.defineFlow)({
    name: "generateChapterBookFlow",
    inputSchema: z.object({
        chapter: z.number(),
        audience: supportedAudiences,
        indexContent: z.string(),
        language: supportedLanguages,
    }),
    outputSchema: z.object({
        chapter: z.number(),
        title: z.string(),
        text: z.string(),
    })
}, async ({ chapter, indexContent, audience, language }) => {
    const chapterPrompt = await (0, ai_1.renderPrompt)({
        prompt: exports.generateChapterPrompt,
        input: { indexContent, chapter, audience, language },
        model: googleai_1.gemini15Flash
    });
    let result = await (0, ai_1.generate)(chapterPrompt);
    let response = {
        chapter,
        text: result.text(),
        title: 'title'
    };
    return response;
});
function chapterNumbersGenerator(limit) {
    return __asyncGenerator(this, arguments, function* chapterNumbersGenerator_1() {
        let i = 1;
        while (i <= limit) {
            yield yield __await(i++);
        }
    });
}
(0, flow_1.startFlowsServer)({
    cors: {
        origin: '*',
    }
});
//# sourceMappingURL=index.js.map