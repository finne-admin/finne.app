'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { AjustesAvatar } from '@/components/settings/AjustesAvatar'
import { Loader2, Pencil, Plus, Clock, X, Bell } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface UserProfile {
  email: string;
  first_name?: string;
  last_name?: string;
}

interface LoadingStates {
  userInfo: boolean;
  saveProfile: boolean;
  notifications: boolean;
}

interface NotificationPreferences {
  active: boolean;
  times: string[];
  isCustomized: boolean;
  allow_weekend_notifications?: boolean;
}

export default function SettingsPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [userRole, setUserRole] = useState<string | null>(null)

  // Loading States
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    userInfo: true,
    saveProfile: false,
    notifications: true
  })

  // Profile States
  const [profile, setProfile] = useState<UserProfile>({
    email: '',
    first_name: '',
    last_name: '',
  })

  // Muscle Groups States (placeholder UI local)
  const [muscleGroups, setMuscleGroups] = useState({
    upperBody: false,
    lowerBody: true,
    fullBody: false,
    core: true,
  })

  // UI States
  const [isEditingName, setIsEditingName] = useState(false)

  // Notification States
  const [defaultTimes, setDefaultTimes] = useState<string[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    active: false,
    times: [],
    isCustomized: false
  })
  const [isAddTimeOpen, setIsAddTimeOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<number | null>(null)
  const [newHour, setNewHour] = useState('9')
  const [newMinute, setNewMinute] = useState('0')

  const [isEditingTime, setIsEditingTime] = useState<number | null>(null);
  const [editHour, setEditHour] = useState('');
  const [editMinute, setEditMinute] = useState('');

  const format12Hour = (time: string) => {
    const [hour, minute] = time.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const hour12 = hourNum % 12 || 12
    return `${hour12}:${minute} ${ampm}`
  }

  const isValidNewTime = () => {
    const newTimeStr = `${newHour.padStart(2, '0')}:${newMinute.padStart(2, '0')}`

    if (preferences.times.includes(newTimeStr)) return false

    return preferences.times.every(existingTime => {
      const [existingHour, existingMinute] = existingTime.split(':').map(Number)
      const existingMinutes = existingHour * 60 + existingMinute
      const newMinutes = parseInt(newHour) * 60 + parseInt(newMinute)
      return Math.abs(existingMinutes - newMinutes) >= 15
    })
  }

  const isValidEditedTime = (newTime: string, skipIndex: number) => {
    return preferences.times.every((existingTime, index) => {
      if (index === skipIndex) return true

      const [existingHour, existingMinute] = existingTime.split(':').map(Number)
      const [nH, nM] = newTime.split(':').map(Number)

      const existingMinutes = existingHour * 60 + existingMinute
      const newMinutes = nH * 60 + nM

      return Math.abs(existingMinutes - newMinutes) >= 15
    })
  }

  // ======= Guardado inmediato =======

  const savePreferences = async (newPrefs: NotificationPreferences) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user?.id,
          active: newPrefs.active,
          times: newPrefs.times,
          allow_weekend_notifications: newPrefs.allow_weekend_notifications ?? true,
        })

      if (error) throw error

      // ya hacemos optimista antes en cada handler, aquí solo confirmamos estado
      setPreferences(newPrefs)
    toast.success('Preferencias de notificación guardadas', { duration: 1500 })
    } catch (error) {
      console.error('Error al guardar preferencias:', error)
      toast.error('Error al guardar preferencias')
    }
  }

  const handleAddTime = async () => {
    const newTimeStr = `${newHour.padStart(2, '0')}:${newMinute.padStart(2, '0')}`
    if (!isValidNewTime()) return

    const updatedPreferences = {
      ...preferences,
      times: [...preferences.times, newTimeStr].sort(),
      active: true,
      isCustomized: true,
    }

    // Optimista
    setPreferences(updatedPreferences)

    // Persiste
    await savePreferences(updatedPreferences)

    setIsAddTimeOpen(false)
  }

  const handleStartEditing = (index: number, time: string) => {
    const [hour, minute] = time.split(':')
    setEditHour(hour)
    setEditMinute(minute)
    setIsEditingTime(index)
  }

  const handleSaveEditedTime = async (index: number) => {
    const newTimeStr = `${editHour}:${editMinute}`

    if (!isValidEditedTime(newTimeStr, index)) {
      toast.error('Los horarios deben estar separados al menos 15 minutos entre sí')
      return
    }

    const updatedTimes = [...preferences.times]
    updatedTimes[index] = newTimeStr

    const updatedPreferences = {
      ...preferences,
      times: updatedTimes.sort(),
      active: true,
      isCustomized: true,
    }

    // Optimista
    setPreferences(updatedPreferences)

    // Persiste
    await savePreferences(updatedPreferences)

    setIsEditingTime(null)
    setEditHour('')
    setEditMinute('')
  }

  const handleDeleteTime = async (index: number) => {
    const updatedTimes = preferences.times.filter((_, i) => i !== index)
    const updatedPreferences = {
      ...preferences,
      times: updatedTimes,
      active: updatedTimes.length > 0 ? true : false,
      isCustomized: true,
    }

    // Optimista
    setPreferences(updatedPreferences)

    // Persiste
    await savePreferences(updatedPreferences)
  }

  // ======= Perfil =======

  async function handleSave() {
    setLoadingStates(prev => ({ ...prev, saveProfile: true }))
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profile.first_name,
          last_name: profile.last_name,
        }
      })
      if (error) throw error
      setIsEditingName(false)
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, saveProfile: false }))
    }
  }

  function handleEditToggle() {
    setIsEditingName(prev => !prev)
  }

  function handleChangePassword() {
    router.push('/reset-password')
  }

  // ======= Effects: usuario =======

  useEffect(() => {
    async function getUserData() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error

        if (user) {
          setProfile({
            email: user.email ?? '',
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || ''
          })

          // Obtener rol desde tabla "users"
          const { data: userData, error: roleError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

          if (roleError) {
            console.warn('No se pudo obtener el rol del usuario:', roleError)
          } else {
            setUserRole(userData?.role ?? null)
          }
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error)
      } finally {
        setLoadingStates(prev => ({ ...prev, userInfo: false }))
      }
    }

    getUserData()
  }, [supabase])

  // ======= Effects: notificaciones =======

  useEffect(() => {
    async function fetchNotificationData() {
      try {
        // Default times
        const { data: defaultData, error: defaultError } = await supabase
          .from('default_notification_times')
          .select('times')
          .single()

        if (defaultError) throw defaultError

        // User preferences
        const { data: { user } } = await supabase.auth.getUser()
        const { data: prefData, error: prefError } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user?.id)
          .single()

        if (defaultData) {
          setDefaultTimes(defaultData.times)
        }

        if (prefData) {
          setPreferences({
            active: prefData.active,
            times: prefData.times || [],
            isCustomized: prefData.active,
            allow_weekend_notifications: prefData.allow_weekend_notifications ?? true,
          })
        } else {
          // Si no hay preferencias, usar por defecto
          setPreferences({
            active: false,
            times: defaultData.times || [],
            isCustomized: false
          })
        }
      } catch (error) {
        console.error('Error al cargar configuración de notificaciones:', error)
        toast.error('Error al cargar configuración de notificaciones')
      } finally {
        setLoadingStates(prev => ({ ...prev, notifications: false }))
      }
    }

    fetchNotificationData()
  }, [supabase])

  // ======= Render =======

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Personal Info Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Información Personal</h2>
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {loadingStates.userInfo ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="text-sm font-medium text-gray-600">
                      Nombre
                    </label>
                    <Input
                      id="first_name"
                      value={profile.first_name}
                      disabled={!isEditingName}
                      onChange={(e) => setProfile((prev) => ({
                        ...prev,
                        first_name: e.target.value
                      }))}
                      className="w-full transition-colors text-gray-900"
                      placeholder="Introduce tu nombre"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="last_name" className="text-sm font-medium text-gray-600">
                      Apellidos
                    </label>
                    <Input
                      id="last_name"
                      value={profile.last_name}
                      disabled={!isEditingName}
                      onChange={(e) => setProfile((prev) => ({
                        ...prev,
                        last_name: e.target.value
                      }))}
                      className="w-full transition-colors text-gray-900"
                      placeholder="Introduce tus apellidos"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              {loadingStates.userInfo ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-600">
                      Correo electrónico
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full bg-gray-50 text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-600">
                      Contraseña
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        className="w-full bg-gray-50"
                        disabled
                      />
                      <Button
                        variant="default"
                        onClick={handleChangePassword}
                        className="w-full sm:w-auto whitespace-nowrap"
                      >
                        Cambiar Contraseña
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {isEditingName ? (
              <>
                <Button
                  variant="default"
                  onClick={handleSave}
                  disabled={loadingStates.saveProfile}
                  className="w-full sm:w-auto"
                >
                  {loadingStates.saveProfile ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </span>
                  ) : (
                    'Guardar Cambios'
                  )}
                </Button>
                <Button
                  variant="delete"
                  onClick={() => setIsEditingName(false)}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                onClick={handleEditToggle}
                className="w-full sm:w-auto"
              >
                Editar Nombre
              </Button>
            )}
          </div>
          <AjustesAvatar />
        </div>
      </section>

      {/* Exercise Preferences Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Preferencias de Ejercicio</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2 text-gray-900">Grupo Muscular</h3>
          <p className="text-sm text-gray-500 mb-6">
            Selecciona los grupos musculares preferidos para enfocarte durante los ejercicios.
          </p>
          <div className="space-y-4 text-gray-900">
            <div className="flex items-center justify-between">
              <label htmlFor="upperBody" className="text-sm">
                Parte Superior
              </label>
              <Switch
                id="upperBody"
                checked={muscleGroups.upperBody}
                onCheckedChange={(checked) =>
                  setMuscleGroups((prev) => ({ ...prev, upperBody: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="lowerBody" className="text-sm">
                Parte Inferior
              </label>
              <Switch
                id="lowerBody"
                checked={muscleGroups.lowerBody}
                onCheckedChange={(checked) =>
                  setMuscleGroups((prev) => ({ ...prev, lowerBody: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="fullBody" className="text-sm">
                Cuerpo Completo
              </label>
              <Switch
                id="fullBody"
                checked={muscleGroups.fullBody}
                onCheckedChange={(checked) =>
                  setMuscleGroups((prev) => ({ ...prev, fullBody: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="core" className="text-sm">
                Core
              </label>
              <Switch
                id="core"
                checked={muscleGroups.core}
                onCheckedChange={(checked) =>
                  setMuscleGroups((prev) => ({ ...prev, core: checked }))
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Notification Settings Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Configuración de Notificaciones</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white py-2 px-4 rounded-lg shadow-sm">
              <label htmlFor="weekendNotifications" className="text-sm text-gray-900 whitespace-nowrap">
                Permitir notificaciones en fines de semana
              </label>
              <Switch
                id="weekendNotifications"
                checked={preferences.allow_weekend_notifications ?? true}
                onCheckedChange={async (checked) => {
                  const updatedPreferences = {
                    ...preferences,
                    allow_weekend_notifications: checked
                  }
                  setPreferences(updatedPreferences) // optimista
                  await savePreferences(updatedPreferences)
                }}
              />
            </div>
          </div>
         {/*  <Button
            id="test-notification-btn"
            variant="edit"
            onClick={() => {
              if (Notification.permission === 'default') {
                Notification.requestPermission()
              }

              if (Notification.permission === 'granted') {
                new Notification('Test Notification', {
                  body: 'This is a test push notification from the app.',
                  icon: '/icon.png'
                })
              } else {
                toast.error('Enable browser notifications to test this feature.')
              }
            }}
            className="flex items-center gap-2 transition duration-200"
          >
            <Bell className="h-4 w-4" />
            Notificar ( stn )
          </Button> */}
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          {loadingStates.notifications ? (
            <div className="space-y-4">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="h-20 bg-gray-50 rounded-lg p-4"
                  >
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Horarios de Recordatorio de Ejercicios
                </h3>
                <p className="text-sm text-gray-500">
                  Añade, edita o elimina horarios. Los cambios se guardan automáticamente.
                  Deben estar separados al menos 15 minutos.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {preferences.times.map((time, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 relative group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-[#8BC5B5] bg-opacity-20">
                          <Clock className="h-5 w-5 text-[#8BC5B5]" />
                        </div>

                        {isEditingTime === index ? (
                          <div className="flex-1">
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                value={editHour}
                                onChange={(e) => setEditHour(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') void handleSaveEditedTime(index) }}
                                onBlur={() => void handleSaveEditedTime(index)}
                                className="w-full rounded-md border border-gray-200 p-2 text-sm focus:ring-[#8BC5B5] focus:border-[#8BC5B5] text-gray-900"
                                autoFocus
                              >
                                {Array.from({ length: 24 }, (_, i) => (
                                  <option key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={editMinute}
                                onChange={(e) => setEditMinute(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') void handleSaveEditedTime(index) }}
                                onBlur={() => void handleSaveEditedTime(index)}
                                className="w-full rounded-md border border-gray-200 p-2 text-sm focus:ring-[#8BC5B5] focus:border-[#8BC5B5] text-gray-900"
                              >
                                {[0, 15, 30, 45].map((minute) => (
                                  <option key={minute} value={minute.toString().padStart(2, '0')}>
                                    {minute.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setIsEditingTime(null)
                                  setEditHour('')
                                  setEditMinute('')
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => void handleSaveEditedTime(index)}
                                className="bg-[#8BC5B5] hover:bg-[#7AB4A4] text-white"
                              >
                                Guardar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium text-gray-900">
                              {format12Hour(time)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Recordatorio de Ejercicio
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Acciones siempre visibles en modo card (cuando no se está editando esa card) */}
                      {isEditingTime !== index && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEditing(index, time)}
                            className="text-gray-500 hover:text-[#8BC5B5]"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteDialogOpen(index)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Botón Añadir siempre visible */}
                  <button
                    onClick={() => setIsAddTimeOpen(true)}
                    className="h-full min-h-[120px] rounded-lg border-2 border-dashed border-gray-200 hover:border-[#8BC5B5] flex items-center justify-center text-gray-500 hover:text-[#8BC5B5] transition-colors"
                  >
                    <Plus className="h-6 w-6 mr-2" />
                    Añadir Horario
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add Time Dialog */}
        <Dialog open={isAddTimeOpen} onOpenChange={setIsAddTimeOpen}>
          <DialogContent className="sm:max-w-[400px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Añadir Horario de Ejercicio</DialogTitle>
              <DialogDescription className="text-gray-700">
                Elige un horario para tu recordatorio de ejercicio. Los horarios deben estar separados al menos 15 minutos entre sí.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Hora
                  </label>
                  <select
                    value={newHour}
                    onChange={(e) => setNewHour(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-gray-900"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Minuto
                  </label>
                  <select
                    value={newMinute}
                    onChange={(e) => setNewMinute(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-gray-900"
                  >
                    {[0, 15, 30, 45].map((minute) => (
                      <option key={minute} value={minute}>
                        {minute.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="cancel"
                onClick={() => setIsAddTimeOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => void handleAddTime()}
                disabled={!isValidNewTime()}
              >
                Añadir Horario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen !== null} onOpenChange={() => setDeleteDialogOpen(null)}>
          <AlertDialogContent className="sm:max-w-[400px] bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600">
                Eliminar Horario de Ejercicio
              </AlertDialogTitle>
              <AlertDialogDescription>
                {deleteDialogOpen !== null && preferences.times[deleteDialogOpen] && (
                  <div className="space-y-3">
                    <p className="text-gray-900">
                      ¿Estás seguro de que quieres eliminar este recordatorio de ejercicio?
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="font-medium text-gray-900">
                        {format12Hour(preferences.times[deleteDialogOpen])}
                      </p>
                      <p className="text-sm text-gray-500">
                        Esta acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteDialogOpen(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteDialogOpen !== null) {
                    void handleDeleteTime(deleteDialogOpen)
                    setDeleteDialogOpen(null)
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Eliminar Horario
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  )
}
