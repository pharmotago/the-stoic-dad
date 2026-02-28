import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { referrer, email } = await req.json();

        // In a real app, this would update the database and reward the referrer
        console.log(`Referral captured: ${referrer} referred ${email}`);

        return NextResponse.json({
            success: true,
            message: 'Referral tracked successfully. Rewards will be processed.'
        });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

