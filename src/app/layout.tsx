import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { StoicChat } from "@/components/StoicChat";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: [
        { media: '(prefers-color-scheme: dark)', color: '#020617' },
    ],
};

export const metadata: Metadata = {
    title: "The Stoic Dad | Daily Stoic Challenges for Modern Fathers",
    description: "Forge your legacy with daily Stoic parenting challenges. A neuroscience-backed protocol for the modern patriarch to master patience, wisdom, and resilience.",
    icons: {
        icon: '/favicon.png',
        apple: '/icon-192.png',
    },
    manifest: "/manifest.json",
    metadataBase: new URL('https://thestoicdad.com'),
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Stoic Dad',
    },
    openGraph: {
        title: "The Stoic Dad",
        description: "Master your reactions, guide your family. Unlock one ancient lesson at a time.",
        url: "https://thestoicdad.com",
        siteName: "The Stoic Dad",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "The Stoic Dad - The Unshakable Patriarch",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: 'summary_large_image',
        title: "The Stoic Dad",
        description: "Daily parenting challenges for the modern Stoic.",
        images: ['/og-image.jpg'],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "The Stoic Dad",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    },
    "description": "Daily parenting challenges for the modern Stoic.",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250"
    }
};

import { SoundProvider } from "@/lib/sound";
import { GoogleAdSense } from "@/components/GoogleAdSense";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={cn(inter.className, "antialiased font-sans")}>
                <link rel="stylesheet" href="/styles/globals.css" />
                <GoogleAdSense />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <SoundProvider>
                    {/* Marketing Tracking Placeholders */}
                    {/* Meta Pixel Code Placeholder */}
                    {/* Google Tag Manager Placeholder */}
                    {children}
                    <StoicChat />
                </SoundProvider>
                <Analytics />
            </body>
        </html>
    );
}

