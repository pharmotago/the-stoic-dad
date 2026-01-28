import { Module } from "@/lib/schemas";

export const module7: Module = {
    id: 7,
    title: "The Temperate Father",
    summary: "Mastering the middle path between indulgence and austerity.",
    isLocked: true,
    badge: "balance",
    readTime: 6,
    content: {
        full_lesson_content: "Temperance (Sophrosyne) is not about deprivation; it is about self-mastery. For a father, temperance means governing one's own desires and impulses so that you can provide a stable foundation for your children.\n\nStoicism teaches that wealth, comfort, and pleasure are 'preferred indifferents.' They are good to have, but we must not be slaves to them. If you cannot say no to a second drink, late-night scrolling, or a luxury you don't need, how can you teach your child the discipline they will need for their own lives?\n\nA father who lacks temperance sends a clear message: 'My immediate desires are more important than my long-term duties.'\n\n**Practice:** Identify one area of over-indulgence in your life this week. Cut it by half. Observe the clarity that follows.",
        questions: [
            {
                question: "What is the primary goal of Stoic Temperance?",
                options: [
                    "Avoiding all forms of pleasure",
                    "Self-mastery and governing impulses",
                    "Becoming wealthy through saving",
                    "Living in total isolation"
                ],
                correctAnswer: 1,
                explanation: "Temperance is about mastering your own desires so they don't master you."
            }
        ],
        challenge: "Identify one habit (caffeine, sugar, screens) and practice total abstinence for 24 hours. Reflect on the 'itch' and how you master it."
    }
};
