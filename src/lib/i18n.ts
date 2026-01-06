export type Language = 'es' | 'en';

export const translations = {
    es: {
        nav: {
            title: 'Mapa de zonas horarias'
        },
        timeInfo: {
            myLocalTime: 'Mi hora local:',
            utc: 'UTC:',
            selectedZone: 'Zona seleccionada:',
            timeInZone: 'Hora en zona:',
            clickOnMap: 'Haz clic en una zona del mapa',
            customTime: 'Convertir hora personalizada:',
            selectTime: 'Selecciona una hora:',
            fromZone: 'Desde zona horaria:',
            convertedTime: 'Hora convertida:',
            selectZoneFirst: 'Selecciona una zona horaria de destino en el mapa'
        },
        theme: {
            light: 'Claro',
            dark: 'Oscuro',
            system: 'Sistema'
        },
        language: {
            spanish: 'Español',
            english: 'English'
        },
        footer: {
            madeWith: 'Hecho con',
            by: 'por',
            sourceCode: 'Código fuente'
        }
    },
    en: {
        nav: {
            title: 'Time Zone Map'
        },
        timeInfo: {
            myLocalTime: 'My local time:',
            utc: 'UTC:',
            selectedZone: 'Selected zone:',
            timeInZone: 'Time in zone:',
            clickOnMap: 'Click on a map area',
            customTime: 'Convert custom time:',
            selectTime: 'Select a time:',
            fromZone: 'From time zone:',
            convertedTime: 'Converted time:',
            selectZoneFirst: 'Select a destination time zone on the map'
        },
        theme: {
            light: 'Light',
            dark: 'Dark',
            system: 'System'
        },
        language: {
            spanish: 'Español',
            english: 'English'
        },
        footer: {
            madeWith: 'Made with',
            by: 'by',
            sourceCode: 'Source Code'
        }
    }
} as const;

export function getInitialLanguage(): Language {
    const stored = localStorage.getItem('language') as Language | null;
    if (stored && (stored === 'es' || stored === 'en')) return stored;

    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'es' ? 'es' : 'en';
}