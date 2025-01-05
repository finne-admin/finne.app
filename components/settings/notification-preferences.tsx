'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import OneSignal from 'react-onesignal'
// MUI Components
import {
    Switch,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Typography,
    IconButton
} from '@mui/material'
// MUI Icons
import {
    Delete as DeleteIcon,
    NotificationsOff as NotificationsOffIcon,
    Add as AddIcon
} from '@mui/icons-material'

interface NotificationPreference {
    id: string;
    user_id: string;
    onesignal_player_id: string | null;
    notification_frequency: '2_hours' | '4_hours' | '8_hours' | 'custom' | null;
    custom_times: string[];
    is_enabled: boolean;
}

const FREQUENCY_OPTIONS = [
    { value: '2_hours', label: 'Cada 2 horas' },
    { value: '4_hours', label: 'Cada 4 horas' },
    { value: '8_hours', label: 'Cada 8 horas' },
    { value: 'custom', label: 'Personalizado' }
] as const;

export function NotificationSettings() {
    const supabase = createClientComponentClient()
    const [isLoading, setIsLoading] = useState(true)
    const [preferences, setPreferences] = useState<NotificationPreference | null>(null)
    const [newCustomTime, setNewCustomTime] = useState('12:00')
    const [isAddingTime, setIsAddingTime] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

    useEffect(() => {
        loadPreferences()
    }, [])

    const showNotification = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity })
    }

    async function loadPreferences() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: prefs, error } = await supabase
                .from('user_notification_preferences')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (error && error.code !== 'PGRST116') throw error

            if (prefs) {
                setPreferences(prefs)
            } else {
                const playerId = await OneSignal.getUserId()
                const { data: newPrefs, error: createError } = await supabase
                    .from('user_notification_preferences')
                    .insert({
                        user_id: user.id,
                        onesignal_player_id: playerId,
                        notification_frequency: '4_hours',
                        custom_times: [],
                        is_enabled: true
                    })
                    .select()
                    .single()

                if (createError) throw createError
                setPreferences(newPrefs)
            }
        } catch (error) {
            console.error('Error cargando preferencias:', error)
            showNotification('No se pudieron cargar las preferencias', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleToggleNotifications(event: React.ChangeEvent<HTMLInputElement>) {
        const enabled = event.target.checked
        try {
            if (!preferences) return

            if (enabled) {
                await OneSignal.showNativePrompt()
                const permission = await OneSignal.getNotificationPermission()
                if (permission !== 'granted') {
                    showNotification('Necesitas permitir las notificaciones en tu navegador', 'error')
                    return
                }
            }

            const playerId = await OneSignal.getUserId()
            const { error } = await supabase
                .from('user_notification_preferences')
                .update({
                    is_enabled: enabled,
                    onesignal_player_id: playerId
                })
                .eq('id', preferences.id)

            if (error) throw error

            setPreferences(prev => prev ? { ...prev, is_enabled: enabled } : null)

            if (enabled) {
                await OneSignal.sendTag('notification_frequency', preferences.notification_frequency)
                if (preferences.custom_times.length > 0) {
                    await OneSignal.sendTag('custom_times', preferences.custom_times.join(','))
                }
            } else {
                await OneSignal.deleteTags(['notification_frequency', 'custom_times'])
            }

            showNotification(
                enabled ? 'Notificaciones activadas' : 'Notificaciones desactivadas',
                'success'
            )
        } catch (error) {
            console.error('Error actualizando notificaciones:', error)
            showNotification('Error al actualizar las notificaciones', 'error')
        }
    }

    async function handleFrequencyChange(event: any) {
        const frequency = event.target.value
        try {
            if (!preferences) return

            const { error } = await supabase
                .from('user_notification_preferences')
                .update({
                    notification_frequency: frequency,
                    custom_times: frequency === 'custom' ? preferences.custom_times : []
                })
                .eq('id', preferences.id)

            if (error) throw error

            setPreferences(prev =>
                prev ? {
                    ...prev,
                    notification_frequency: frequency
                } : null
            )

            await OneSignal.sendTag('notification_frequency', frequency)
            showNotification('Frecuencia actualizada correctamente', 'success')
        } catch (error) {
            console.error('Error actualizando frecuencia:', error)
            showNotification('Error al actualizar la frecuencia', 'error')
        }
    }

    async function handleAddCustomTime() {
        try {
            if (!preferences) return

            const newCustomTimes = [...preferences.custom_times, newCustomTime].sort()

            const { error } = await supabase
                .from('user_notification_preferences')
                .update({
                    custom_times: newCustomTimes
                })
                .eq('id', preferences.id)

            if (error) throw error

            setPreferences(prev =>
                prev ? { ...prev, custom_times: newCustomTimes } : null
            )

            await OneSignal.sendTag('custom_times', newCustomTimes.join(','))
            setIsAddingTime(false)
            showNotification(`Recordatorio añadido para las ${newCustomTime}`, 'success')
        } catch (error) {
            console.error('Error añadiendo horario:', error)
            showNotification('Error al añadir el horario', 'error')
        }
    }

    async function handleRemoveCustomTime(timeToRemove: string) {
        try {
            if (!preferences) return

            const newCustomTimes = preferences.custom_times.filter(time => time !== timeToRemove)

            const { error } = await supabase
                .from('user_notification_preferences')
                .update({
                    custom_times: newCustomTimes
                })
                .eq('id', preferences.id)

            if (error) throw error

            setPreferences(prev =>
                prev ? { ...prev, custom_times: newCustomTimes } : null
            )

            if (newCustomTimes.length > 0) {
                await OneSignal.sendTag('custom_times', newCustomTimes.join(','))
            } else {
                await OneSignal.deleteTag('custom_times')
            }

            showNotification(`Recordatorio eliminado`, 'success')
        } catch (error) {
            console.error('Error eliminando horario:', error)
            showNotification('Error al eliminar el horario', 'error')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <CircularProgress />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Typography variant="h5" component="h2">
                        Notificaciones
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Configura cuándo quieres recibir recordatorios de ejercicio
                    </Typography>
                </div>
                <Switch
                    checked={preferences?.is_enabled ?? false}
                    onChange={handleToggleNotifications}
                    color="primary"
                />
            </div>

            {preferences?.is_enabled ? (
                <Card>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <Typography variant="h6">Frecuencia</Typography>
                            <FormControl fullWidth>
                                <InputLabel>Selecciona la frecuencia</InputLabel>
                                <Select
                                    value={preferences.notification_frequency ?? ''}
                                    onChange={handleFrequencyChange}
                                    label="Selecciona la frecuencia"
                                >
                                    {FREQUENCY_OPTIONS.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {preferences.notification_frequency === 'custom' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Typography variant="h6">Horarios personalizados</Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => setIsAddingTime(true)}
                                        startIcon={<AddIcon />}
                                    >
                                        Añadir horario
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {preferences.custom_times.length === 0 ? (
                                        <Typography color="text.secondary" align="center">
                                            No hay horarios configurados. Añade tu primer recordatorio.
                                        </Typography>
                                    ) : (
                                        preferences.custom_times.map(time => (
                                            <div
                                                key={time}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <Typography>{time}</Typography>
                                                <IconButton
                                                    onClick={() => handleRemoveCustomTime(time)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Alert severity="info" icon={<NotificationsOffIcon />}>
                    Activa las notificaciones para recibir recordatorios de ejercicio.
                </Alert>
            )}

            {/* Add Time Dialog */}
            <Dialog open={isAddingTime} onClose={() => setIsAddingTime(false)}>
                <DialogTitle>Añadir nuevo horario</DialogTitle>
                <DialogContent>
                    <input
                        type="time"
                        value={newCustomTime}
                        onChange={(e) => setNewCustomTime(e.target.value)}
                        className="w-full p-2 border rounded-md mt-4"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsAddingTime(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleAddCustomTime} variant="contained">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default NotificationSettings;