import { definePrompt, generate, renderPrompt } from "@genkit-ai/ai";
import { configureGenkit } from "@genkit-ai/core";
import { gemini15Flash } from "@genkit-ai/googleai";
import * as z from "zod";
import { firebase } from "@genkit-ai/firebase";
import { googleAI } from "@genkit-ai/googleai";
import { defineFlow, startFlowsServer } from "@genkit-ai/flow";
import { dotprompt } from '@genkit-ai/dotprompt';
import { story_types } from './genres.json' 
import contentAttributes from './content_atributes_by_age.json'; // Import JSON file
import interactionHook from './interaction_hook.json'; // Import interaction hook JSON


configureGenkit({
    plugins: [
        dotprompt(),
        firebase(),
        googleAI({
            apiVersion: "v1beta"
        }

        ),
    ],
    logLevel: "debug",
    enableTracingAndMetrics: true,
});
const supportedLanguages = z.enum(["spanish", "english", "portuguese"]);
const supportedAudiences = z.enum(["kids", "teenagers", "adults"]);
const supportedGenres = z.enum([ 'adventure', 'discovery', 'travel','novel', 'mystery',          'fantasy', 'science fiction',  'historical fiction', 'horror',           'romance', 'coming of age',    'thriller', 'comedy',           'dystopian', 'mythology',        'biography', 'folktale',         'supernatural', 'urban fantasy',    'espionage', 'post-apocalyptic', 'psychological drama', 'sports',           'legal drama' ]);
console.log(supportedGenres);
const age = 10; // Define the fixed age variable
// Filter characteristics based on age
const filteredAttributes = contentAttributes.find(attr => {
    return age >= attr.age_from && (attr.age_to === null || age <= attr.age_to);
})?.characteristics || [];

// Define variables
const user_name = "John";
const educational_content = `
Quantum mechanics is a fundamental theory in physics that describes nature at the smallest scales of energy levels of atoms and subatomic particles. It explains phenomena that classical mechanics cannot, such as the dual particle-wave nature of light and matter, and the behavior of particles at the quantum level. Understanding quantum mechanics is crucial for advancements in fields like quantum computing, cryptography, and various technological innovations.
`;

export const startStoryBookPrompt = definePrompt({
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
        
        const systemPrompt = `
        You are a learning tool for an audience of ${input.audience}. Your task is to generate a storybook for educational purposes that combines the logic of a game with the richness of education.    
        The game aspect is provided by the interactive content at the end of each chapter. The educational aspect is delivered through the narrative of the book, which harmoniously integrates educational content into a brilliantly written story.    
        This story should always include the user as the main character and protagonist, referred to by their name.    
        The content should be provided in markdown format and use language expressions appropriate for the specified audience. The storybook should be an engaging, informative, gamified experience.    
        Never use violent, harmful, or aggressive content.    
        The language used should be clear, age-appropriate, and educational.`;
        const userPrompt = `Write an index page for a storybook in the genre of ${input.genre}, with ${input.numChapters} chapters about ${input.topic}. 
        Take into account that this genre has the following characteristics: ${story_types.find(st => st.type === input.genre)?.characterization}
        This storybook is intended for a person who is ${age} years old, so the content should follow these guidelines: ${filteredAttributes.join(", ")}. 
        The main character of the story is ${user_name}, who will embark on a fascinating journey of learning. 
        Integrate the following educational content into the chapters: ${educational_content}`;

        return {
            messages: [{
                role: 'system', content: [
                    { text: systemPrompt }]
            }, {
                role: 'user', content: [
                    { text: userPrompt }]
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
    }
);

export const generateChapterPrompt = definePrompt({
    name: "generateChapterPrompt",
    inputSchema: z.object({
        audience: supportedAudiences,
        indexContent: z.string(),
        chapter: z.number(),
        language: supportedLanguages
    }),

}, async (input) => {

    // Select a random interactive element
    const randomElement = interactionHook.interactive_elements[Math.floor(Math.random() * interactionHook.interactive_elements.length)];
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
                { text: systemPrompt }]
        }, {
            role: 'user', content: [
                { text: userPrompt }]
        }],
        config: { temperature: 0.9 },
    };
});

export const storyBookFlow = defineFlow(
    {
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
    },
    async ({ numChapters, audience, topic, language, genre }) => {
        const startingPrompt = await renderPrompt({
            prompt: startStoryBookPrompt,
            input: { numChapters, topic, audience, language, genre },
            model: gemini15Flash
        });

        let result = await generate(startingPrompt);

        let response = {
            topic: topic,
            indexContent: result.text(),
            audience,
            language,
            numChapters

        }
        return response;
    }
);

export const generateChapterBookFlow = defineFlow(
    {
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
    },
    async ({ chapter, indexContent, audience, language }) => {
        const chapterPrompt = await renderPrompt({
            prompt: generateChapterPrompt,
            input: { indexContent, chapter, audience, language },
            model: gemini15Flash
        });

        let result = await generate(chapterPrompt);
        let response = {
            chapter,
            text: result.text(),
            title: 'title'
        }



        return response;
    }
);


async function* chapterNumbersGenerator(limit: number) {
    let i = 1;
    while (i <= limit) {
        yield i++;
    }
}


startFlowsServer({
    cors: {
        origin: '*',
    }
});
