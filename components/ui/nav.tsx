import { FaGithub } from "react-icons/fa";
import DownloadButton from "./downloadButton";

export default function Nav() {
    const paths = [
        {
            path: '/privacy-policy',
            name: 'Privacy Policy'
            
        },
        {
            path: 'term-of-service',
            name: 'Term of Service'
        },
        {
            path: 'https://github.com/codad5/google-task-tauri',
            name: 'Source Code',
            icon: FaGithub,  // for the icon 
            blank: true // to open in new tab
        
        }
    ];
    return (
        <>
            {/* the navigations */}
            <nav className="">
                <ul className="flex justify-evenly items-center space-x-3">
                    <li>
                        <DownloadButton />
                    </li>
                    {
                        paths.map((path, index) => (
                            <li key={index}>
                                <a href={path.path} className="flex flex-row justify-between items-center space-x-2 underline tex-sm" target={path.blank ? '_blank' : '_self'}>
                                    {
                                        path.icon ?
                                            (
                                                <button className="grid place-items-center p-1 border-2 border-white rounded-full">
                                                    <path.icon />
                                                </button>
                                            ) : 
                                            <div className="text-xl font-bold">
                                                {path.name}
                                            </div>
                                    }
                                   
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </nav>  
        </>
    )
}