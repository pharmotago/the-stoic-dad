import path from 'path';
import { fileURLToPath } from 'url';
import EvolutionEngine from '../../shared-ui/scripts/evolution-engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const engine = new EvolutionEngine({
    projectName: 'The Stoic Dad',
    pagePath: path.join(__dirname, '../src/app/page.tsx'),
    headlines: [
        { main: "Stop The Dad Rage. <br />\n                                <span className=\"text-amber-500\">Start Leading.</span>", sub: "The 5-Day Stoic Protocol for fathers who want to control their temper and build an unbreakable legacy." },
        { main: "Master Your Temper. <br />\n                                <span className=\"text-emerald-500\">Build Your Legacy.</span>", sub: "Ancient Stoic strategies applied to modern fatherhood. Reclaim your calm in 5 days." },
        { main: "Be The Father <br />\n                                <span className=\"text-blue-500\">Your Kids Deserve.</span>", sub: "Don't let anger define your parenting. Learn the Stoic art of emotional control." },
        { main: "Chaos Is Inevitable. <br />\n                                <span className=\"text-red-500\">Rage Is Optional.</span>", sub: "The tactical guide to remaining calm when your house is on fire (metaphorically)." },
        { main: "Forge Your Character. <br />\n                                <span className=\"text-amber-400\">Quiet Your Mind.</span>", sub: "The path to becoming a legendary father starts with internal mastery." },
        { main: "The Stoic Dad. <br />\n                                <span className=\"text-indigo-400\">A Pillar Of Strength.</span>", sub: "How to stay solid as a rock when everyone else is losing their heads." },
        { main: "Control What You Can. <br />\n                                <span className=\"text-emerald-400\">Let Go Of The Rest.</span>", sub: "A framework for fatherhood without the unnecessary stress and burnout." },
        { main: "Patience Is Power. <br />\n                                <span className=\"text-orange-400\">Rage Is Weakness.</span>", sub: "Flip the script on fatherhood. Lead with virtue, not volume." },
        { main: "Ancient Wisdom. <br />\n                                <span className=\"text-yellow-500\">Modern Fatherhood.</span>", sub: "The timeless principles of Stoicism, re-engineered for today's dad." },
        { main: "Your Children's Hero. <br />\n                                <span className=\"text-cyan-400\">Your Own Master.</span>", sub: "Learn to govern yourself, so you can lead your family with grace." },
        { main: "Temperance Is Key. <br />\n                                <span className=\"text-purple-400\">The Stoic Path.</span>", sub: "Finding the middle ground in a world of parenting extremes." },
        { main: "Strength In Silence. <br />\n                                <span className=\"text-slate-400\">Power In Calm.</span>", sub: "The quiet revolution in conscious parenting starts here." }
    ],
    adjectives: ["Stoic", "Legendary", "Unshakable", "Virtuous", "Conscious", "Tactical", "Ancient", "Modern", "Powerful", "Patient"],
    nouns: ["Father", "Leader", "Protagonist", "Mentor", "Legacy-Builder", "Pillar", "Rock", "Guide", "Ancestor", "Master"],
    colors: ["text-amber-500", "text-emerald-500", "text-blue-500", "text-red-500", "text-indigo-400", "text-cyan-400", "text-orange-400", "text-yellow-400", "text-purple-400", "text-rose-400"]
});

// CLI Routing
/* global process */
if (process.argv.includes('--batch')) {
    const countIndex = process.argv.indexOf('--batch') + 1;
    const count = parseInt(process.argv[countIndex]) || 10;
    engine.runBatch(count);
} else if (process.argv.includes('--daemon')) {
    engine.startDaemon();
} else {
    engine.evolve();
}
