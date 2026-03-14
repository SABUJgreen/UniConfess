import type { Metadata } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Providers from '../components/Providers'
import { AuthProvider } from '../context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'

const sans = Manrope({ subsets: ['latin'], variable: '--font-sans' })
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
    title: 'UniConfess | College Confessions & Q&A',
    description: 'Anonymous college confessions, doubts, gossips, and placement discussions.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${sans.variable} ${display.variable} min-h-screen antialiased flex flex-col relative`}>
                {/* Background layer */}
                <div className="fixed inset-0 -z-10 bg-background">
                    <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_15%_0%,rgba(139,92,246,0.12),transparent_55%),radial-gradient(700px_circle_at_85%_0%,rgba(34,211,238,0.06),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_100%,rgba(139,92,246,0.06),transparent_60%)]" />
                </div>
                <Providers>
                    <AuthProvider>
                        <Navbar />
                        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
                            {children}
                        </main>
                        <Toaster
                            position="bottom-right"
                            toastOptions={{
                                className: 'bg-card text-foreground border border-white/10 shadow-xl shadow-black/40 text-sm font-medium',
                                style: {
                                    background: 'var(--color-card)',
                                    color: 'var(--color-foreground)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }
                            }}
                        />
                    </AuthProvider>
                </Providers>
            </body>
        </html>
    )
}
