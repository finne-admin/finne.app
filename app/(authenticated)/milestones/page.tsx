'use client'

import { Award, Flame, Clock, Dumbbell, Star } from 'lucide-react'
import { MilestoneCard } from '@/components/ui/milestone-card'
import { Progress } from '@/components/ui/progress'

export default function TrackingMilestonesPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Achieved Milestones Section */}
            <section>
                <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-gray-900">Logros Conseguidos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <MilestoneCard
                        icon={
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Award className="w-6 h-6 text-yellow-600" />
                            </div>
                        }
                        title="10 Sesiones Completadas"
                        description="¡Has completado 10 sesiones de ejercicio! ¡Sigue así!"
                    />
                    <MilestoneCard
                        icon={
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                                <Flame className="w-6 h-6 text-orange-600" />
                            </div>
                        }
                        title="Racha de 7 Días"
                        description="Has hecho ejercicio durante 7 días consecutivos. ¡Esfuerzo fantástico!"
                    />
                    <MilestoneCard
                        icon={
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                        }
                        title="100 Minutos de Ejercicio"
                        description="Has dedicado 100 minutos a tu salud. ¡Trabajo increíble!"
                    />
                    <MilestoneCard
                        icon={
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <Dumbbell className="w-6 h-6 text-purple-600" />
                            </div>
                        }
                        title="Primera Sesión de Fuerza Core"
                        description="Has completado tu primera sesión de fuerza core. ¡Sigue construyendo!"
                    />
                    <MilestoneCard
                        icon={
                            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                                <Star className="w-6 h-6 text-pink-600" />
                            </div>
                        }
                        title="5 Ejercicios Favoritos"
                        description="Has guardado 5 ejercicios como favoritos. ¡Sigue explorando!"
                    />
                </div>
            </section>

            {/* Next Milestone Section */}
            <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-gray-900">Próximo Logro</h2>
                <div>
                    <p className="text-gray-600 mb-4 text-sm lg:text-base">
                        5 sesiones más para alcanzar 20 ejercicios en total.
                    </p>
                    <Progress value={75} className="h-4 sm:h-6" />
                    <p className="text-right text-sm text-gray-500 mt-2">75%</p>
                </div>
            </section>
        </div>
    )
}