
import Map from "@components/TimeZoneMap.tsx";
import {useEffect, useState, useMemo} from "react";
import {DateTime} from "luxon";
import {ThemeProvider} from "@components/theme-provider.tsx";
import {ModeToggle} from "@components/mode-toggle.tsx";
import {LanguageToggle} from "@components/language-toggle.tsx";
import {type Language, translations, getInitialLanguage} from "@/lib/i18n";
import citiesToTimeZoneMap from "@components/citiesToTimeZoneMap";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Heart, Github } from "lucide-react";
import { cn } from "@/lib/utils";

export default function App() {
    const [language, setLanguage] = useState<Language>(getInitialLanguage);
    const [selectedTimezone, setSelectedTimezone] = useState<{
        city: string;
        timezone: string;
    } | null>(null);
    const [currentTime, setCurrentTime] = useState(() => DateTime.local());
    const [customTime, setCustomTime] = useState<string>('12:00');
    const [sourceTimezone, setSourceTimezone] = useState<string>('');
    const [open, setOpen] = useState(false);

    const t = translations[language];

    // Obtener lista de zonas horarias únicas y ordenadas
    const timezoneOptions = useMemo(() => {
        const zones = Object.keys(citiesToTimeZoneMap).sort();
        return zones;
    }, []);

    // Establecer zona horaria de origen por defecto
    useEffect(() => {
        if (!sourceTimezone && timezoneOptions.length > 0) {
            // Intentar detectar la zona horaria local del usuario
            const localZone = DateTime.local().zoneName;
            if (timezoneOptions.includes(localZone)) {
                setSourceTimezone(localZone);
            } else {
                // Si no se encuentra, usar la primera de la lista
                setSourceTimezone(timezoneOptions[0]);
            }
        }
    }, [timezoneOptions, sourceTimezone]);

    // Guardar idioma en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    // Actualizar el tiempo cada segundo
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(DateTime.local());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Calcular las horas - siempre muestra hora local y UTC
    const getTimeInfo = () => {
        const myTime = currentTime;
        const utcTime = DateTime.utc();

        const baseInfo = {
            myTime: myTime.toFormat('HH:mm:ss'),
            utcTime: utcTime.toFormat('HH:mm:ss'),
        };

        if (selectedTimezone?.timezone) {
            const selectedTime = DateTime.now().setZone(selectedTimezone.city);
            return {
                ...baseInfo,
                selectedZone: selectedTimezone.city,
                selectedTime: selectedTime.toFormat('HH:mm:ss')
            };
        }

        return baseInfo;
    };

    // Convertir hora personalizada desde zona de origen a zona de destino
    const getConvertedCustomTime = () => {
        if (!selectedTimezone?.city || !customTime || !sourceTimezone) return null;

        // Parsear la hora seleccionada
        const [hours, minutes] = customTime.split(':').map(Number);

        // Crear fecha/hora en la zona de origen
        const sourceDateTime = DateTime.now()
            .setZone(sourceTimezone)
            .set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });

        // Convertir a la zona de destino
        const convertedTime = sourceDateTime.setZone(selectedTimezone.city);

        return convertedTime.toFormat('HH:mm:ss');
    };

    const timeInfo = getTimeInfo();
    const convertedCustomTime = getConvertedCustomTime();

    return (
        <ThemeProvider defaultTheme="dark" storageKey="timezonemap-theme">
            <div className="flex flex-col min-h-screen">
                {/* Navbar */}
                <nav className="flex justify-between items-center p-4 border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold">
                            {t.nav.title}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <LanguageToggle language={language} setLanguage={setLanguage} />
                        <ModeToggle language={language} />
                    </div>
                </nav>

                {/* Contenido principal */}
                <main className="flex-1">
                    <div className="container mx-auto p-4">
                        <div className="flex flex-col lg:flex-row gap-6 items-start">
                            {/* Columna izquierda - Mapa */}
                            <div className="w-full lg:flex-1 border-2 rounded-lg p-4 bg-card">
                                <Map
                                    selectedTimezone={selectedTimezone}
                                    setSelectedTimezone={setSelectedTimezone}
                                />
                            </div>

                            {/* Columna derecha - Cards de información */}
                            <div className="w-full lg:w-80 space-y-6">
                                {/* Card 1: Información de tiempo actual */}
                                <div className="border-2 rounded-lg p-6 bg-card">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t.timeInfo.myLocalTime}</p>
                                            <p className="text-xl font-mono font-semibold">{timeInfo.myTime}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-muted-foreground">{t.timeInfo.utc}</p>
                                            <p className="text-xl font-mono font-semibold">{timeInfo.utcTime}</p>
                                        </div>

                                        {'selectedZone' in timeInfo && timeInfo.selectedZone ? (
                                            <>
                                                <div className="border-t pt-4 mt-4">
                                                    <p className="text-sm text-muted-foreground">{t.timeInfo.selectedZone}</p>
                                                    <p className="text-base font-semibold">{timeInfo.selectedZone}</p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-muted-foreground">{t.timeInfo.timeInZone}</p>
                                                    <p className="text-xl font-mono font-semibold">{timeInfo.selectedTime}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="border-t pt-4 mt-4 text-center">
                                                <p className="text-sm text-muted-foreground">{t.timeInfo.clickOnMap}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card 2: Convertidor de hora personalizada */}
                                <div className="border-2 rounded-lg p-6 bg-card">
                                    <h3 className="text-lg font-semibold mb-4">{t.timeInfo.customTime}</h3>

                                    <div className="space-y-4">
                                        {/* Combobox de zona horaria de origen con búsqueda */}
                                        <div>
                                            <label className="text-sm text-muted-foreground block mb-2">{t.timeInfo.fromZone}</label>
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="w-full justify-between"
                                                    >
                                                        <span className="truncate">
                                                            {sourceTimezone || (language === 'es' ? 'Selecciona una zona horaria...' : 'Select a timezone...')}
                                                        </span>
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder={language === 'es' ? 'Buscar zona horaria...' : 'Search timezone...'}
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                {language === 'es' ? 'No se encontraron resultados.' : 'No results found.'}
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {timezoneOptions.map((zone) => (
                                                                    <CommandItem
                                                                        key={zone}
                                                                        value={zone}
                                                                        onSelect={(currentValue) => {
                                                                            setSourceTimezone(currentValue === sourceTimezone ? "" : currentValue)
                                                                            setOpen(false)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                sourceTimezone === zone ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {zone}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        {/* Input de hora */}
                                        <div>
                                            <label className="text-sm text-muted-foreground block mb-2">{t.timeInfo.selectTime}</label>
                                            <input
                                                type="time"
                                                value={customTime}
                                                onChange={(e) => setCustomTime(e.target.value)}
                                                className="w-full h-9 px-3 py-2 border border-input rounded-md bg-background text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            />
                                        </div>

                                        {/* Resultado de la conversión */}
                                        {selectedTimezone?.city ? (
                                            <div className="border-t pt-4">
                                                <p className="text-sm text-muted-foreground mb-1">{t.timeInfo.convertedTime}</p>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {selectedTimezone.city}
                                                </p>
                                                <p className="text-2xl font-mono font-bold">
                                                    {convertedCustomTime}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="border-t pt-4 text-center">
                                                <p className="text-sm text-muted-foreground">
                                                    {t.timeInfo.selectZoneFirst}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t mt-auto">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-muted-foreground text-center sm:text-left">
                                {t.footer.madeWith}{' '}
                                <Heart className="inline h-4 w-4 text-red-500 fill-red-500" />{' '}
                                {t.footer.by}{' '}
                                <a
                                    href="https://github.com/le-pepe"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold hover:underline"
                                >
                                    LePepe
                                </a>
                            </p>
                            <a
                                href="https://github.com/le-pepe/timezonemap"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Github className="h-4 w-4" />
                                {t.footer.sourceCode}
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </ThemeProvider>
    );
}