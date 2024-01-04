import Image from 'next/image'
import Link from 'next/link'
import Nav from './nav'


export default function Header() {
    return (
        <div className="flex flex-row justify-between items-center w-full h-16 p-8">
            {/* logo */}
            <div className="space-x-2">
                <Link href="/" className="flex flex-row justify-between items-center space-x-2">
                <div className="w-8 h-8">
                    <Image
                    src="/google-task.png"
                    alt="Google Tasks Logo"
                    width={32}
                    height={32}
                    />
                </div>
                <div className="text-xl font-bold">
                    Google Tasks
                    </div>
                </Link>
            </div>
            <Nav />
        </div>
    )
}