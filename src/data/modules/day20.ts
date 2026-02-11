import { Module } from "@/lib/schemas";

export const day20: Module = {
    id: 20,
    title: "Phase 2: The Household Audit",
    summary: "Capstone: Integrating the 10-day practice of Stoic Household leadership.",
    isLocked: true,
    audioUrl: "https://lh3.googleusercontent.com/notebooklm/ANHLwAxMSFDwNUC8qaGFsZSRKEvosThutJ5eB99zIeAAbQ7BnuEzOBnXXSnotS2XPGy-BVhOW7MDuos5uRXfk3fBjrZRFEKly4dMvSq1BVoelcKO2M1lEQuSvHstKIradIUfFVAlQi3ban89qFvEtHp54z7DmGi19w=m140-dv",
    readTime: 10,
    badge: "users",
    content: {
        full_lesson_content: `🏛️ THE FOUNDATION

🚩 **The Relational Inspection**

You have completed Phase 2 of the Stoic Dad journey. You have moved from the **Fortress of Self** to the **Stoic Household**. 🏠🛡️

In the last 10 days, you learned that your character does not exist in a vacuum. It is tested and proved through your relationships with those you love most. A man who is calm in the woods is merely tranquil; a man who is calm during a toddler's meltdown is a Stoic.

In Phase 2, you mastered:
1.  **The Sympatheia Bond**: Using mirror neurons to lead your partner toward peace instead of amplifying their stress.
2.  **Service-Based Justice**: Realizing that 'Fairness' in a home is measured by who contributes most to the character of everyone else.
3.  **The Mirror Rule**: Discovering that your children are recording your actions, not your lectures.
4.  **Socratic Leadership**: Moving from a Dictator who gives commands to a Mentor who builds minds.

✨ **The Stoic Dad is the thermostat of the home, not the thermometer. He sets the temperature; he doesn't just record the heat. 🌡️🛡️**

🧠 THE BIOLOGICAL OVERRIDE

🧬 **The Systems Override**

Families operate as "Closed-Loop Systems." When one person’s cortisol rises, it naturally triggers cortisol in everyone else. 🧠🚨 Most homes are a series of chain reactions—each person reflecting the stress of the person next to them.

Phase 2 was about breaking those chain reactions. By practicing the **Cool Down Protocol** and the **Circle Expansion**, you have been acting as a "Circuit Breaker" in your home.

This Capstone is designed to audit the health of your "System." Are you still being "Hijacked" by the moods of others, or are you successfully broadcasting your own Citadel? ✅

⚔️ THE HOUSEHOLD AUDIT

Review the health of your "Second Circle" with total honesty.`,
        scripts: `📜 THE PHASE 2 COMMANDMENTS

1.  **Lead by Example**: Live the virtues you demand.
2.  **Question over Command**: Build minds, not obedience.
3.  **Praise the Effort**: Value character over results.
4.  **Expand the Circle**: Their joy is your joy.`,
        audit: [
            "🏆 LEADERSHIP CHECK: Did you raise your voice at any member of your household in the last 48 hours? If so, have you apologized and audited the 'Mirror Hijack'? 🤝",
            "🛡️ INTEGRITY CHECK: What is one thing you 'Lectured' your children about today that you also did yourself? (The Mirror Rule). 👁️",
            "🧠 SOCRATIC CHECK: Can you remember a moment this week where you asked a question instead of giving a command? How did the child's response differ? 💭"
        ],
        challenge: `🏁 THE 24-HOUR HARMONY PROTOCOL

For the next 24 hours, perform the ultimate test of Phase 2:

1️⃣ **The Service Sprint:** Perform 3 small acts of service for your partner without being asked and without mentioning them. 🧼☕
2️⃣ **The 100% Process Praise:** Do not praise a single 'Result' (grades, clean rooms, winning). Praise only the 'Virtue' (patience, effort, kindness). 🏹
3️⃣ **The 60-Second Listen:** When your partner or child speaks, wait 60 seconds after they finish before responding. Just listen. 🤫
4️⃣ **The Phase 2 Review:** Sit with your partner tonight for 5 minutes. Ask them: 'In what ways have you noticed me being more composed lately?' Listen to the feedback without defending yourself. ⚖️`,
        questions: [
            {
                question: "Which Stoic concept describes the natural expansion of our care from self to others?",
                options: [
                    "Oikeiôsis",
                    "Phantasia",
                    "Askesis",
                    "Memento Mori"
                ],
                correctAnswer: 0,
                explanation: "Oikeiôsis is the process of making the concerns of others our own."
            },
            {
                question: "What is the 'Mirror Rule' in Stoic Parenting?",
                options: [
                    "Checking your appearance before leaving the house",
                    "Never demanding a virtue from your child that you are not currently modeling",
                    "Making the child look at themselves when they cry",
                    "Copying every annoying thing the child does"
                ],
                correctAnswer: 1,
                explanation: "We lead through example (The Mirror) rather than just precepts (words)."
            }
        ]
    }
};
