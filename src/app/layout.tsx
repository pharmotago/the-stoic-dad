import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ClientLayout } from "@/components/ClientLayout";
import { StoicChat } from "@/components/StoicChat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "The Stoic Dad",
    description: "Daily parenting challenges for the modern Stoic.",
    manifest: "/manifest.json",
    metadataBase: new URL('https://thestoicdad.com'),
    themeColor: [
        { media: '(prefers-color-scheme: dark)', color: '#020617' },
    ],
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
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
            },
        ],
        locale: "en_US",
        type: "website",
    },
};

import { SoundProvider } from "@/lib/sound";



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(inter.className, "antialiased font-sans")}>
                <ErrorBoundary>
                    <SoundProvider>
                        <ClientLayout>
                            {children}
                        </ClientLayout>
                        <StoicChat />
                    </SoundProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
