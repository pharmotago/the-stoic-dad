const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PAGE_PATH = path.join(__dirname, '../src/app/page.tsx');
const LOG_PATH = path.join(__dirname, '../evolution_log.txt');

// Evolution Bank - Expanded with 100+ unique variations for 1000x evolution
const HEADLINES = [
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
];

// Content Generation for 1000 Iterations
const ADJECTIVES = ["Stoic", "Legendary", "Unshakable", "Virtuous", "Conscious", "Tactical", "Ancient", "Modern", "Powerful", "Patient"];
const NOUNS = ["Father", "Leader", "Protagonist", "Mentor", "Legacy-Builder", "Pillar", "Rock", "Guide", "Ancestor", "Master"];
const COLORS = ["text-amber-500", "text-emerald-500", "text-blue-500", "text-red-500", "text-indigo-400", "text-cyan-400", "text-orange-400", "text-yellow-400", "text-purple-400", "text-rose-400"];

// Helpers
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    try {
        fs.appendFileSync(LOG_PATH, logMessage);
    } catch (e) {
        console.error("Could not write to log file");
    }
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateDynamicHeadline() {
    const adj = getRandomItem(ADJECTIVES);
    const noun = getRandomItem(NOUNS);
    const color = getRandomItem(COLORS);

    // Mix pre-coded headlines with dynamic ones for 1000x variety
    if (Math.random() > 0.5) return getRandomItem(HEADLINES);

    return {
        main: `${adj} ${noun}. <br />\n                                <span className=\"${color}\">Inner Peace.</span>`,
        sub: `Transform your family legacy through the ${adj.toLowerCase()} art of self-mastery and deep emotional discipline.`
    };
}

function evolve(skipBuild = false) {
    log('Starting Evolution Process...');

    try {
        if (!fs.existsSync(PAGE_PATH)) throw new Error(`File not found: ${PAGE_PATH}`);
        let content = fs.readFileSync(PAGE_PATH, 'utf8');

        const newHeadline = generateDynamicHeadline();

        const h1Regex = /<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-\[1.1\]">[\s\S]*?<\/h1>/;
        const newH1Html = `<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                                    ${newHeadline.main}
                                </h1>`;

        if (content.match(h1Regex)) {
            content = content.replace(h1Regex, newH1Html);
            log(`Mutated Headline to: ${newHeadline.main.replace(/<br \/>/g, ' ').replace(/\n\s+/g, ' ')}`);
        }

        const pRegex = /<p className="text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">[\s\S]*?<\/p>/;
        const newPHtml = `<p className="text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    ${newHeadline.sub}
                                </p>`;

        if (content.match(pRegex)) {
            content = content.replace(pRegex, newPHtml);
        }

        fs.writeFileSync(PAGE_PATH, content, 'utf8');
        log('Applied mutations to file.');

        if (!skipBuild) {
            log('Verifying build integrity...');
            execSync('npm run build', { stdio: 'ignore' });
            log('Build verified successfully.');
        }

        execSync('git add .');
        execSync('git commit -m "Auto-Evolution: Genetic Optimization Loop"');
        log('Changes committed.');

    } catch (error) {
        log(`CRITICAL ERROR: ${error.message}`);
        if (!process.argv.includes('--daemon') && !process.argv.includes('--batch')) {
            process.exit(1);
        }
    }
}

// Logic for batch runs
async function runBatch(count) {
    log(`🏃 Starting Batch Evolution: ${count} iterations.`);
    for (let i = 1; i <= count; i++) {
        log(`\n--- Cycle ${i}/${count} ---`);
        evolve(true); // Always skip build in batch mode for speed
    }

    log('\n🧬 Batch complete. Running final build verification...');
    try {
        execSync('npm run build', { stdio: 'inherit' });
        log('✅ Final build verified successfully.');
    } catch (e) {
        log('❌ Final build FAILED. Check history.');
    }
}

// CLI Routing
if (process.argv.includes('--batch')) {
    const countIndex = process.argv.indexOf('--batch') + 1;
    const count = parseInt(process.argv[countIndex]) || 10;
    runBatch(count);
} else if (process.argv.includes('--daemon')) {
    const INTERVAL = 6 * 60 * 60 * 1000;
    log(`Starting Auto-Evolution Daemon.`);
    evolve();
    setInterval(() => evolve(), INTERVAL);
    process.stdin.resume();
} else {
    evolve();
}
