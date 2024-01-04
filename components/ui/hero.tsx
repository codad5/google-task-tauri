import { getLatestVersionDataFOrThisPlatform } from '@/libs/helper'
import Image from 'next/image'
import DownloadButton from './downloadButton'

export default async function Hero() {
    const platform_data = await getLatestVersionDataFOrThisPlatform()
    console.log(platform_data)
    return (
        <section className="w-full h-full p-8">
            <div className="w-full p-8 grid place-items-center">
                <Image
                src="/google-task.png"
                alt="Google Tasks Logo"
                width={200}
                height={200}
                />
            </div>
            <div className="w-full p-2 grid place-items-center space-y-2">
                <h1 className="text-4xl font-bold">Google Tasks</h1>
                <p className="text-xl">Google Tasks Desktop App for Windows, Mac & Linux</p>
            </div>
            <div className="w-full p-2 grid place-items-center space-y-2">
                <DownloadButton />
            </div>
        </section>
    )
}