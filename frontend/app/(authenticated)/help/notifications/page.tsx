"use client"

import { useState, useEffect } from "react"
import {
    AlertCircle,
    Bell,
    Monitor,
    Power,
    Copy,
    Check,
    ChevronUp,
    ChevronDown
} from "lucide-react"

export default function NotificationsHelpPage() {
    // State for tracking completed steps
    const [completedSteps, setCompletedSteps] = useState<number[]>([])
    // State for tracking expanded sections (for mobile)
    const [expandedSections, setExpandedSections] = useState<number[]>([1, 2, 3, 4])
    // State for copy button feedback
    const [copiedText, setCopiedText] = useState<string | null>(null)
    // State for dark mode
    const [darkMode, setDarkMode] = useState(false)

    // Toggle completed status of a step
    const toggleCompleted = (stepNumber: number) => {
        if (completedSteps.includes(stepNumber)) {
            setCompletedSteps(completedSteps.filter((step) => step !== stepNumber))
        } else {
            setCompletedSteps([...completedSteps, stepNumber])
        }
    }

    // Toggle expanded status of a section (for mobile)
    const toggleExpanded = (sectionNumber: number) => {
        if (expandedSections.includes(sectionNumber)) {
            setExpandedSections(expandedSections.filter((section) => section !== sectionNumber))
        } else {
            setExpandedSections([...expandedSections, sectionNumber])
        }
    }

    // Copy text to clipboard
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopiedText(label)
                setTimeout(() => setCopiedText(null), 2000)
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err)
            })
    }

    return (
        <div
            className={`transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
        >
            <div className="container max-w-4xl py-8 px-4 sm:px-6 lg:px-8 mx-auto">
                {/* Page title and introduction */}
                <header className="mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-2 mb-3">
                        <AlertCircle
                            className={`h-6 w-6 sm:h-7 sm:w-7 ${darkMode ? "text-amber-400" : "text-amber-500"}`}
                            aria-hidden="true"
                        />
                        <span>Solución de Problemas con las Notificaciones</span>
                    </h1>
                    <p className={`text-base sm:text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Si no estás recibiendo las notificaciones de FINNE, sigue estos pasos para asegurarte de que todo esté
                        configurado correctamente.
                    </p>

                    {/* Progress indicator */}
                    <div className="mt-6 mb-2">
                        <p className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Progreso: {completedSteps.length}/4 pasos completados
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(completedSteps.length / 4) * 100}%` }}
                                aria-label={`${completedSteps.length} de 4 pasos completados`}
                            ></div>
                        </div>
                    </div>
                </header>

                {/* Main content - Troubleshooting sections */}
                <div className="space-y-6 md:space-y-8">
                    {/* Section 1 */}
                    <section
                        id="section-1"
                        className={`rounded-xl shadow-sm border transition-all duration-300 ${
                            completedSteps.includes(1)
                                ? darkMode
                                    ? "bg-gray-800/50 border-green-800"
                                    : "bg-white/80 border-green-200"
                                : darkMode
                                    ? "bg-gray-800 border-gray-700"
                                    : "bg-white border-gray-100"
                        }`}
                    >
                        {/* Section header */}
                        <div
                            className={`p-4 sm:p-6 flex items-start justify-between gap-4 ${
                                expandedSections.includes(1) ? "" : "border-b border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    <button
                                        onClick={() => toggleCompleted(1)}
                                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                            completedSteps.includes(1)
                                                ? "bg-green-500 text-white"
                                                : darkMode
                                                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                    : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                                        }`}
                                        aria-label={completedSteps.includes(1) ? "Marcar como no completado" : "Marcar como completado"}
                                        title={completedSteps.includes(1) ? "Marcar como no completado" : "Marcar como completado"}
                                    >
                                        {completedSteps.includes(1) && <Check className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold flex items-center flex-wrap gap-2">
                                        <Bell
                                            className={`h-5 w-5 sm:h-6 sm:w-6 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                                            aria-hidden="true"
                                        />
                                        <span>1. Activar Notificaciones en Google Chrome</span>
                                    </h2>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleExpanded(1)}
                                    className={`p-1.5 rounded-full md:hidden ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
                                    aria-expanded={expandedSections.includes(1)}
                                    aria-controls="content-section-1"
                                    aria-label={expandedSections.includes(1) ? "Contraer sección" : "Expandir sección"}
                                >
                                    {expandedSections.includes(1) ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Section content */}
                        <div
                            id="content-section-1"
                            className={`transition-all duration-300 overflow-hidden ${
                                expandedSections.includes(1)
                                    ? "max-h-[1000px] opacity-100"
                                    : "max-h-0 opacity-0 md:max-h-[1000px] md:opacity-100"
                            }`}
                        >
                            <div className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
                                <div>
                                    <h3 className="font-medium mb-2 text-base sm:text-lg">
                                        Abre Google Chrome y accede a Configuración:
                                    </h3>
                                    <ul className="list-disc pl-5 sm:pl-6 space-y-1.5">
                                        <li>
                                            Haz clic en los tres puntos (arriba a la derecha) y selecciona <strong>Configuración</strong>.
                                        </li>
                                        <li>
                                            Ve a <strong>Privacidad y Seguridad</strong> &gt; <strong>Configuración de sitios</strong>.
                                        </li>
                                        <li>
                                            Desplázate hasta <strong>Notificaciones</strong>.
                                        </li>
                                        <li>Asegúrate de que las notificaciones estén activadas.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2 text-base sm:text-lg">Busca www.finne.app en la lista:</h3>
                                    <ul className="list-disc pl-5 sm:pl-6 space-y-1.5">
                                        <li>
                                            Si no aparece, haz clic en <strong>Añadir</strong> y escribe{" "}
                                            <code className="relative px-[0.3rem] py-[0.2rem] font-mono text-sm rounded bg-gray-100">
                                                https://www.finne.app
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard("https://www.finne.app", "URL")}
                                                className={`ml-1.5 inline-flex items-center text-xs font-medium ${
                                                    darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                                                }`}
                                                aria-label="Copiar URL"
                                                title="Copiar URL"
                                            >
                                                {copiedText === "URL" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                            </button>
                                        </li>
                                        <li>
                                            Si aparece bloqueada, haz clic en los tres puntos y selecciona <strong>Permitir</strong>.
                                        </li>
                                    </ul>
                                </div>

                                <div
                                    className={`p-4 rounded-lg flex items-start gap-3 ${
                                        darkMode ? "bg-blue-900/30 text-blue-100" : "bg-blue-50 text-blue-800"
                                    }`}
                                >
                                    <span className={`font-bold text-lg ${darkMode ? "text-blue-300" : "text-blue-600"}`}>✅</span>
                                    <div>
                                        <p>
                                            <span className="font-semibold">Consejo:</span> Asegúrate de que Chrome esté actualizado para
                                            evitar errores. Puedes verificar si hay actualizaciones en <strong>Configuración</strong> &gt;{" "}
                                            <strong>Acerca de Chrome</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section
                        id="section-2"
                        className={`rounded-xl shadow-sm border transition-all duration-300 ${
                            completedSteps.includes(2)
                                ? darkMode
                                    ? "bg-gray-800/50 border-green-800"
                                    : "bg-white/80 border-green-200"
                                : darkMode
                                    ? "bg-gray-800 border-gray-700"
                                    : "bg-white border-gray-100"
                        }`}
                    >
                        {/* Section header */}
                        <div
                            className={`p-4 sm:p-6 flex items-start justify-between gap-4 ${
                                expandedSections.includes(2) ? "" : "border-b border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    <button
                                        onClick={() => toggleCompleted(2)}
                                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                            completedSteps.includes(2)
                                                ? "bg-green-500 text-white"
                                                : darkMode
                                                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                    : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                                        }`}
                                        aria-label={completedSteps.includes(2) ? "Marcar como no completado" : "Marcar como completado"}
                                        title={completedSteps.includes(2) ? "Marcar como no completado" : "Marcar como completado"}
                                    >
                                        {completedSteps.includes(2) && <Check className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold flex items-center flex-wrap gap-2">
                                        <Monitor
                                            className={`h-5 w-5 sm:h-6 sm:w-6 ${darkMode ? "text-purple-400" : "text-purple-500"}`}
                                            aria-hidden="true"
                                        />
                                        <span>2. Desactivar el Modo Focus (Asistente de Concentración)</span>
                                    </h2>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleExpanded(2)}
                                    className={`p-1.5 rounded-full md:hidden ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
                                    aria-expanded={expandedSections.includes(2)}
                                    aria-controls="content-section-2"
                                    aria-label={expandedSections.includes(2) ? "Contraer sección" : "Expandir sección"}
                                >
                                    {expandedSections.includes(2) ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Section content */}
                        <div
                            id="content-section-2"
                            className={`transition-all duration-300 overflow-hidden ${
                                expandedSections.includes(2)
                                    ? "max-h-[1000px] opacity-100"
                                    : "max-h-0 opacity-0 md:max-h-[1000px] md:opacity-100"
                            }`}
                        >
                            <div className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
                                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5">
                                    <li>
                                        Abre el <strong>Menú de Inicio</strong> y busca <strong>Asistente de concentración</strong>.
                                    </li>
                                    <li>
                                        Selecciona la opción <strong>Asistente de concentración</strong>.
                                    </li>
                                    <li>
                                        Elige <strong>Desactivado</strong> para permitir todas las notificaciones.
                                    </li>
                                </ul>

                                <div
                                    className={`p-4 rounded-lg flex items-start gap-3 ${
                                        darkMode ? "bg-blue-900/30 text-blue-100" : "bg-blue-50 text-blue-800"
                                    }`}
                                >
                                    <span className={`font-bold text-lg ${darkMode ? "text-blue-300" : "text-blue-600"}`}>✅</span>
                                    <div>
                                        <p>
                                            <span className="font-semibold">Consejo:</span> Puedes ajustar las excepciones si deseas recibir
                                            solo ciertas notificaciones. Agrega FINNE a la lista de aplicaciones prioritarias.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section
                        id="section-3"
                        className={`rounded-xl shadow-sm border transition-all duration-300 ${
                            completedSteps.includes(3)
                                ? darkMode
                                    ? "bg-gray-800/50 border-green-800"
                                    : "bg-white/80 border-green-200"
                                : darkMode
                                    ? "bg-gray-800 border-gray-700"
                                    : "bg-white border-gray-100"
                        }`}
                    >
                        {/* Section header */}
                        <div
                            className={`p-4 sm:p-6 flex items-start justify-between gap-4 ${
                                expandedSections.includes(3) ? "" : "border-b border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    <button
                                        onClick={() => toggleCompleted(3)}
                                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                            completedSteps.includes(3)
                                                ? "bg-green-500 text-white"
                                                : darkMode
                                                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                    : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                                        }`}
                                        aria-label={completedSteps.includes(3) ? "Marcar como no completado" : "Marcar como completado"}
                                        title={completedSteps.includes(3) ? "Marcar como no completado" : "Marcar como completado"}
                                    >
                                        {completedSteps.includes(3) && <Check className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold flex items-center flex-wrap gap-2">
                                        <Power
                                            className={`h-5 w-5 sm:h-6 sm:w-6 ${darkMode ? "text-green-400" : "text-green-500"}`}
                                            aria-hidden="true"
                                        />
                                        <span>3. Iniciar Chrome Automáticamente</span>
                                    </h2>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleExpanded(3)}
                                    className={`p-1.5 rounded-full md:hidden ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
                                    aria-expanded={expandedSections.includes(3)}
                                    aria-controls="content-section-3"
                                    aria-label={expandedSections.includes(3) ? "Contraer sección" : "Expandir sección"}
                                >
                                    {expandedSections.includes(3) ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Section content */}
                        <div
                            id="content-section-3"
                            className={`transition-all duration-300 overflow-hidden ${
                                expandedSections.includes(3)
                                    ? "max-h-[1000px] opacity-100"
                                    : "max-h-0 opacity-0 md:max-h-[1000px] md:opacity-100"
                            }`}
                        >
                            <div className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
                                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5">
                                    <li>
                                        Presiona{" "}
                                        <kbd
                                            className={`px-2 py-1 text-xs font-semibold rounded ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                                        >
                                            Win + R
                                        </kbd>
                                        , escribe{" "}
                                        <code
                                            className={`relative px-[0.3rem] py-[0.2rem] font-mono text-sm rounded ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                                        >
                                            shell:startup
                                        </code>{" "}
                                        y pulsa Enter.
                                        <button
                                            onClick={() => copyToClipboard("shell:startup", "Comando")}
                                            className={`ml-1.5 inline-flex items-center text-xs font-medium ${
                                                darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                                            }`}
                                            aria-label="Copiar comando"
                                            title="Copiar comando"
                                        >
                                            {copiedText === "Comando" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                        </button>
                                    </li>
                                    <li>
                                        En la carpeta que se abre, haz clic derecho y selecciona <strong>Nuevo</strong> &gt;{" "}
                                        <strong>Acceso directo</strong>.
                                    </li>
                                    <li>
                                        Escribe la ruta de Google Chrome (normalmente{" "}
                                        <code
                                            className={`relative px-[0.3rem] py-[0.2rem] font-mono text-sm rounded ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                                        >
                                            C:\Program Files\Google\Chrome\Application\chrome.exe
                                        </code>
                                        ) y haz clic en <strong>Siguiente</strong>.
                                        <button
                                            onClick={() =>
                                                copyToClipboard("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "Ruta")
                                            }
                                            className={`ml-1.5 inline-flex items-center text-xs font-medium ${
                                                darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                                            }`}
                                            aria-label="Copiar ruta"
                                            title="Copiar ruta"
                                        >
                                            {copiedText === "Ruta" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                        </button>
                                    </li>
                                    <li>
                                        Nombra el acceso directo como <strong>Google Chrome</strong> y haz clic en{" "}
                                        <strong>Finalizar</strong>.
                                    </li>
                                </ul>

                                <div
                                    className={`p-4 rounded-lg flex items-start gap-3 ${
                                        darkMode ? "bg-blue-900/30 text-blue-100" : "bg-blue-50 text-blue-800"
                                    }`}
                                >
                                    <span className={`font-bold text-lg ${darkMode ? "text-blue-300" : "text-blue-600"}`}>✅</span>
                                    <div>
                                        <p>
                                            <span className="font-semibold">Consejo:</span> Esto permite que Chrome se abra al iniciar el
                                            sistema, asegurando que las notificaciones de FINNE se activen inmediatamente. Para un inicio más
                                            rápido, puedes añadir el parámetro{" "}
                                            <code
                                                className={`relative px-[0.3rem] py-[0.2rem] font-mono text-sm rounded ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                                            >
                                                --start-minimized
                                            </code>{" "}
                                            al final de la ruta.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section
                        id="section-4"
                        className={`rounded-xl shadow-sm border transition-all duration-300 ${
                            completedSteps.includes(4)
                                ? darkMode
                                    ? "bg-gray-800/50 border-green-800"
                                    : "bg-white/80 border-green-200"
                                : darkMode
                                    ? "bg-gray-800 border-gray-700"
                                    : "bg-white border-gray-100"
                        }`}
                    >
                        {/* Section header */}
                        <div
                            className={`p-4 sm:p-6 flex items-start justify-between gap-4 ${
                                expandedSections.includes(4) ? "" : "border-b border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    <button
                                        onClick={() => toggleCompleted(4)}
                                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                            completedSteps.includes(4)
                                                ? "bg-green-500 text-white"
                                                : darkMode
                                                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                    : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                                        }`}
                                        aria-label={completedSteps.includes(4) ? "Marcar como no completado" : "Marcar como completado"}
                                        title={completedSteps.includes(4) ? "Marcar como no completado" : "Marcar como completado"}
                                    >
                                        {completedSteps.includes(4) && <Check className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold flex items-center flex-wrap gap-2">
                                        <AlertCircle
                                            className={`h-5 w-5 sm:h-6 sm:w-6 ${darkMode ? "text-amber-400" : "text-amber-500"}`}
                                            aria-hidden="true"
                                        />
                                        <span>4. Otras Soluciones Comunes</span>
                                    </h2>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleExpanded(4)}
                                    className={`p-1.5 rounded-full md:hidden ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
                                    aria-expanded={expandedSections.includes(4)}
                                    aria-controls="content-section-4"
                                    aria-label={expandedSections.includes(4) ? "Contraer sección" : "Expandir sección"}
                                >
                                    {expandedSections.includes(4) ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Section content */}
                        <div
                            id="content-section-4"
                            className={`transition-all duration-300 overflow-hidden ${
                                expandedSections.includes(4)
                                    ? "max-h-[1000px] opacity-100"
                                    : "max-h-0 opacity-0 md:max-h-[1000px] md:opacity-100"
                            }`}
                        >
                            <div className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
                                <ul className="list-disc pl-5 sm:pl-6 space-y-2">
                                    <li>
                                        <span className="font-medium">Revisar Permisos en el Navegador:</span> Asegúrate de que el navegador
                                        tenga permisos para mostrar notificaciones. Verifica también que no estés en modo incógnito, ya que
                                        este modo bloquea las notificaciones.
                                    </li>
                                    <li>
                                        <span className="font-medium">Comprobar Notificaciones del Sistema:</span> Ve a{" "}
                                        <strong>Configuración</strong> &gt;
                                        <strong>Sistema</strong> &gt; <strong>Notificaciones</strong> y verifica que estén activadas.
                                        Asegúrate de que Chrome aparezca en la lista de aplicaciones permitidas.
                                    </li>
                                    <li>
                                        <span className="font-medium">Limpiar Caché y Cookies:</span> Borra la caché de Chrome para resolver
                                        posibles conflictos. Puedes hacerlo en <strong>Configuración</strong> &gt;{" "}
                                        <strong>Privacidad y seguridad</strong> &gt; <strong>Borrar datos de navegación</strong>.
                                    </li>
                                    <li>
                                        <span className="font-medium">Revisar Extensiones:</span> Algunas extensiones pueden bloquear las
                                        notificaciones. Desactiva las que no necesites o prueba en modo incógnito para verificar si alguna
                                        extensión está causando el problema.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer with completion status */}
                <footer className={`mt-10 pt-6 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {completedSteps.length === 4 ? (
                                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-green-500" />
                  ¡Has completado todos los pasos! Si sigues teniendo problemas, contacta con soporte.
                </span>
                            ) : (
                                `Has completado ${completedSteps.length} de 4 pasos. Continúa con los pasos restantes.`
                            )}
                        </p>

                        <div className="print:hidden">
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className={`text-sm font-medium ${
                                    darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                                } transition-colors`}
                            >
                                Volver arriba
                            </button>
                        </div>
                    </div>

                    {/* Print-only footer */}
                    <div className="hidden print:block mt-8 text-sm text-gray-500">
                        <p>Documento impreso desde FINNE - www.finne.app</p>
                        <p>Fecha de impresión: {new Date().toLocaleDateString()}</p>
                    </div>
                </footer>
            </div>
        </div>
    )
}

