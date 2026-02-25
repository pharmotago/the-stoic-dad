import { Module } from "@/lib/schemas";
import { day1 } from "./modules/day1";
import { day2 } from "./modules/day2";
import { day3 } from "./modules/day3";
import { day4 } from "./modules/day4";
import { day5 } from "./modules/day5";
import { day6 } from "./modules/day6";
import { day7 } from "./modules/day7";
import { day8 } from "./modules/day8";
import { day9 } from "./modules/day9";
import { day10 } from "./modules/day10";
import { day11 } from "./modules/day11";
import { day12 } from "./modules/day12";
import { day13 } from "./modules/day13";
import { day14 } from "./modules/day14";
import { day15 } from "./modules/day15";
import { day16 } from "./modules/day16";
import { day17 } from "./modules/day17";
import { day18 } from "./modules/day18";
import { day19 } from "./modules/day19";
import { day20 } from "./modules/day20";
import { day21 } from "./modules/day21";
import { day22 } from "./modules/day22";
import { day23 } from "./modules/day23";
import { day24 } from "./modules/day24";
import { day25 } from "./modules/day25";
import { day26 } from "./modules/day26";
import { day27 } from "./modules/day27";
import { day28 } from "./modules/day28";
import { day29 } from "./modules/day29";
import { day30 } from "./modules/day30";
import { supabase } from "@/lib/supabase";

export const staticModules: Module[] = [
    day1,
    day2,
    day3,
    day4,
    day5,
    day6,
    day7,
    day8,
    day9,
    day10,
    day11,
    day12,
    day13,
    day14,
    day15,
    day16,
    day17,
    day18,
    day19,
    day20,
    day21,
    day22,
    day23,
    day24,
    day25,
    day26,
    day27,
    day28,
    day29,
    day30
];

export async function getAllModules(): Promise<Module[]> {
    try {
        const { data: dynamicModules, error } = await supabase
            .from('dynamic_modules')
            .select('*')
            .order('module_id', { ascending: true });

        if (error) {
            console.warn("Supabase dynamic_modules fetch error:", error.message);
            return staticModules;
        }

        if (!dynamicModules || dynamicModules.length === 0) {
            return staticModules;
        }

        const mappedDynamic: Module[] = dynamicModules.map((dm: any) => ({
            id: dm.module_id,
            title: dm.title,
            summary: dm.summary,
            isLocked: dm.is_locked ?? false,
            content: dm.content as any,
        }));

        // Filter out overlaps just in case
        const existingIds = new Set(staticModules.map(m => m.id));
        const uniqueDynamic = mappedDynamic.filter(dm => !existingIds.has(dm.id));

        return [...staticModules, ...uniqueDynamic];
    } catch (e) {
        console.error("Critical error fetching dynamic modules:", e);
        return staticModules;
    }
}

export default staticModules;
