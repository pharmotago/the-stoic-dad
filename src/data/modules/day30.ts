import { Module } from "@/lib/schemas";

export const day30: Module = {
    id: 30,
    title: "The Final Exam",
    summary: "The Judgment Simulation: Test your readiness for the chaos of life.",
    isLocked: true,
    readTime: 12,
    badge: "trophy",
    content: {
        full_lesson_content: `🏛️ THE FOUNDATION

🏁 The Final Ascent

You have walked the path of the Stoic Dad from the *Dichotomy of Control* to the *Legacy of Wisdom*. You have learned the neuroscience of "The Red Mist" and the ancient art of "The View From Above." 🔭

Now, we move from "Theory" to "Simulation." This assessment is not about memorizing definitions; it is about your ability to maintain your *Hegemonikon* (Ruling Faculty) when the world is burning around you. 🛡️

This exam covers the four Cardinal Virtues:
1.  **Courage (Andreia)**: Choosing the hard right over the easy wrong.
2.  **Temperance (Sophrosyne)**: Mastering your impulses and your attention.
3.  **Justice (Dikaiosyne)**: Leading through service and fairness.
4.  **Wisdom (Phronesis)**: Discerning the essential from the indifferent.

Answer not with what you "should" do, but with what you would *actually* do in the heat of the moment. There are no winners here, only men who are either awake or asleep. 🥋

🧠 THE BIOLOGICAL OVERRIDE

🧠 Integrating theCEO

During this exam, your brain will simulate the stress of these scenarios. 🧠 Your pulse may rise. You may feel defensive. This is the test. Use your Prefrontal Cortex to observe these feelings and then choose the Stoic path anyway.

Integrate your "Cold Logic" (Stoic principles) with your "Warm Empathy" (Dad's love). The ultimate Stoic Dad is not a robot; he is a man of intense affection who refuses to let his emotions drive the car. ✅

⚔️ THE JUDGMENT SIMULATION

Complete the Audit below to receive your Operational Readiness Assessment.`,
        scripts: `📜 THE STOIC OATH

Repeat this before you re-enter the "Battlefield" of your home:

🗣️ "I am the Rock. I grounded the Lightning. I love my Fate. I am the Master of my Attention. I lead through Service, not Status. I am a Stoic Dad."`,
        audit: [
            "🏆 COURAGE: What is the 'Hard Conversation' or discipline you have been avoiding because it's uncomfortable? What is one action you will take today? 🛡️",
            "⚖️ JUSTICE: Have you apologized to your children or partner for a 'Mirror Hijack' (reflecting their stress) recently? 🤝",
            "🛡️ TEMPERANCE: Can you commit to 48 hours of 'The Fridge Vault' (Phone-free evenings) starting tonight? 📵",
            "🧠 WISDOM: What 'Crisis' in your home is actually just a 'Speck of Dust' in the eyes of eternity? 🔭",
            "🔥 AMOR FATI: If your entire weekend plan falls apart, can you sincerely say 'I love this' and find the adventure? ❤️"
        ],
        challenge: `🏁 THE FINAL CHALLENGE: LIFE ITSELF

Congratulations. You have completed the curriculum. But the true exam begins the moment you turn off this screen. 📱

Your children are watching. Your partner is depending on you. The universe is throwing obstacles.

Go be the Rock. Go be the Stoic Dad. ⛰️`,
        questions: [
            {
                question: "Which virtue involves discerning the essential from the indifferent?",
                options: [
                    "Justice",
                    "Wisdom (Phronesis)",
                    "Temperance",
                    "Courage"
                ],
                correctAnswer: 1,
                explanation: "Wisdom is the ability to see things as they are and prioritize correctly."
            },
            {
                question: "What is the primary goal of the 'Stoic Dad' approach?",
                options: [
                    "To become emotional and distant",
                    "To suppress all feelings and never smile",
                    "To maintain the 'Ruling Faculty' (Logic) while acting with deep Empathy",
                    "To control every action of the children"
                ],
                correctAnswer: 2,
                explanation: "The goal is to maintain character and logic to lead the family through chaos with love."
            }
        ]
    }
};
