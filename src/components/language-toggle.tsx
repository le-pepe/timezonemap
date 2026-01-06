import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {type Language, translations } from "@/lib/i18n"

interface LanguageToggleProps {
    language: Language;
    setLanguage: (lang: Language) => void;
}

export function LanguageToggle({ language, setLanguage }: LanguageToggleProps) {
    const t = translations[language];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="cursor-pointer">
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => setLanguage('es')}
                    className="cursor-pointer"
                >
                    {t.language.spanish}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage('en')}
                    className="cursor-pointer"
                >
                    {t.language.english}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}