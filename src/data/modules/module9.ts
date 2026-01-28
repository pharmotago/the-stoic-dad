import { Module } from "@/lib/schemas";

export const module9: Module = {
    id: 9,
    title: "The Legacy of Wisdom",
    summary: "Refining the lens through which you see the world.",
    isLocked: true,
    badge: "key",
    readTime: 8,
    content: {
        full_lesson_content: "Wisdom (Phronesis) is the foundational virtue. It is the ability to distinguish between what is good, what is bad, and what is indifferent. It is the 'ruling faculty' of the mind.\n\nA wise father does not just react; he assesses. When your child breaks a window, is it 'bad'? To a wise father, it is an 'indifferent' event—a physical reality. What is 'good' or 'bad' is how the father responds. A calm, teaching moment is good. A reactive, rage-filled moment is bad.\n\nYour legacy is not the money you leave behind, but the lens you leave in your children's eyes. If you leave them with the lens of Stoic Wisdom, they can survive any storm.\n\n**Final Lesson:** You cannot control the world your children inherit, but you can control the character they bring to it.",
        questions: [
            {
                question: "In Stoic Wisdom, what is truly 'good' or 'bad'?",
                options: [
                    "External events like traffic or weather",
                    "How much money you have",
                    "Your character and how you choose to respond to events",
                    "The opinions of other people"
                ],
                correctAnswer: 2,
                explanation: "Stoics believe only our character and our choices (our 'Prohairesis') are truly good or bad."
            }
        ],
        challenge: "Write a letter to your child (to be given now or later) about the most important virtue you hope they master."
    }
};
