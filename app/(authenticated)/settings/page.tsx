'use client'

import {useEffect, useState} from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {Loader2, Pencil, Plus, Clock, X} from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {useRouter} from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
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
}

export default function SettingsPage() {
    const supabase = createClientComponentClient()
    const router = useRouter()



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

    // Muscle Groups States
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
    const [isEditing, setIsEditing] = useState(false)
    const [isAddTimeOpen, setIsAddTimeOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<number | null>(null)
    const [newHour, setNewHour] = useState('9')
    const [newMinute, setNewMinute] = useState('0')
    const [originalPreferences, setOriginalPreferences] = useState(preferences)

    const format12Hour = (time: string) => {
        const [hour, minute] = time.split(':')
        const hourNum = parseInt(hour)
        const ampm = hourNum >= 12 ? 'PM' : 'AM'
        const hour12 = hourNum % 12 || 12
        return `${hour12}:${minute} ${ampm}`
    }

    const isValidNewTime = () => {
        const newTimeStr = `${newHour.padStart(2, '0')}:${newMinute.padStart(2, '0')}`

        // Check if time already exists
        if (preferences.times.includes(newTimeStr)) return false

        // Check 15-minute gap with existing times
        return preferences.times.every(existingTime => {
            const [existingHour, existingMinute] = existingTime.split(':').map(Number)
            const existingMinutes = existingHour * 60 + existingMinute
            const newMinutes = parseInt(newHour) * 60 + parseInt(newMinute)
            return Math.abs(existingMinutes - newMinutes) >= 15
        })
    }

    const handleAddTime = () => {
        const newTimeStr = `${newHour.padStart(2, '0')}:${newMinute.padStart(2, '0')}`
        if (!isValidNewTime()) return

        setPreferences(prev => ({
            ...prev,
            times: [...prev.times, newTimeStr].sort(),
            active: true
        }))
        setIsAddTimeOpen(false)
    }

    const [isEditingTime, setIsEditingTime] = useState<number | null>(null);
    const [editHour, setEditHour] = useState('');
    const [editMinute, setEditMinute] = useState('');

    const handleStartEditing = (index: number, time: string) => {
        const [hour, minute] = time.split(':');
        setEditHour(hour);
        setEditMinute(minute);
        setIsEditingTime(index);
    };

    const handleSaveEditedTime = (index: number) => {
        const newTimeStr = `${editHour}:${editMinute}`;

        // Validate new time
        if (!isValidEditedTime(newTimeStr, index)) {
            toast.error('Time must be at least 15 minutes apart from other reminders');
            return;
        }

        const updatedTimes = [...preferences.times];
        updatedTimes[index] = newTimeStr;

        setPreferences(prev => ({
            ...prev,
            times: updatedTimes.sort(),
            active: true
        }));

        setIsEditingTime(null);
        setEditHour('');
        setEditMinute('');
    };

    const isValidEditedTime = (newTime: string, skipIndex: number) => {
        return preferences.times.every((existingTime, index) => {
            if (index === skipIndex) return true;

            const [existingHour, existingMinute] = existingTime.split(':').map(Number);
            const [newHour, newMinute] = newTime.split(':').map(Number);

            const existingMinutes = existingHour * 60 + existingMinute;
            const newMinutes = newHour * 60 + newMinute;

            return Math.abs(existingMinutes - newMinutes) >= 15;
        });
    };

    const handleSaveTimes = async () => {
        try {
            await savePreferences(preferences)
            setIsEditing(false)
            setOriginalPreferences(preferences)
            toast.success('Exercise times saved successfully')
        } catch (error) {
            console.error('Error saving times:', error)
            toast.error('Failed to save exercise times')
        }
    }

    // Fetch user data
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
                }
            } catch (error) {
                console.error('Error getting user:', error)
            } finally {
                setLoadingStates(prev => ({ ...prev, userInfo: false }))
            }
        }

        getUserData()
    }, [supabase])

    // Fetch notification settings
    useEffect(() => {
        async function fetchNotificationData() {
            try {
                // Get default times
                const { data: defaultData, error: defaultError } = await supabase
                    .from('default_notification_times')
                    .select('times')
                    .single()

                if (defaultError) throw defaultError

                // Get user preferences
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
                        isCustomized: prefData.active
                    })
                } else {
                    // If no preferences exist, use default times
                    setPreferences({
                        active: false,
                        times: defaultData.times || [],
                        isCustomized: false
                    })
                }
            } catch (error) {
                console.error('Error fetching notification settings:', error)
                toast.error('Failed to load notification settings')
            } finally {
                setLoadingStates(prev => ({ ...prev, notifications: false }))
            }
        }

        fetchNotificationData()
    }, [supabase])

    // Profile Functions
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
            console.error('Error updating user:', error)
        } finally {
            setLoadingStates(prev => ({ ...prev, saveProfile: false }))
        }
    }

    function handleEditToggle() {
        setIsEditingName((prev) => !prev)
    }

    function handleChangePassword() {
        router.push('/reset-password')
    }

    // Notification Functions
    const savePreferences = async (newPrefs: NotificationPreferences) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            const { error } = await supabase
                .from('notification_preferences')
                .upsert({
                    user_id: user?.id,
                    active: newPrefs.active,
                    times: newPrefs.times,
                })

            if (error) throw error

            setPreferences(newPrefs)
            toast.success('Notification preferences saved')
        } catch (error) {
            console.error('Error saving preferences:', error)
            toast.error('Failed to save preferences')
        }
    }

    const handleDeleteTime = async (index: number) => {
        const updatedTimes = preferences.times.filter((_, i) => i !== index)
        const updatedPreferences = {
            ...preferences,
            times: updatedTimes,
            isCustomized: true
        }

        await savePreferences(updatedPreferences)
    }
// Sample Data
    const favoriteExercises = [
        {
            title: 'Seated Leg Lifts',
            category: 'Core',
            duration: '30 Seconds',
        },
        {
            title: 'Neck Stretches',
            category: 'Stretching',
            duration: '30 Seconds',
        },
        {
            title: 'Desk Push-ups',
            category: 'Strength',
            duration: '40 Seconds',
        },
    ]

    return (
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
            {/* Personal Info Section */}
            <section>
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Personal Info</h2>
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
                                            First Name
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
                                            placeholder="Enter first name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="last_name" className="text-sm font-medium text-gray-600">
                                            Last Name
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
                                            placeholder="Enter last name"
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
                                            Email
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
                                            Password
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
                                                Change Password
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
                                           <Loader2 className="h-4 w-4 animate-spin"/>
                                           Saving...
                                       </span>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                                <Button
                                    variant="delete"
                                    onClick={() => setIsEditingName(false)}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="default"
                                onClick={handleEditToggle}
                                className="w-full sm:w-auto"
                            >
                                Edit Name
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Exercise Preferences Section */}
            <section>
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Exercise Preferences</h2>
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Muscle Group */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-2 text-gray-900">Muscle Group</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Select their preferred muscle groups to focus on during exercises.
                        </p>
                        <div className="space-y-4 text-gray-900">
                            <div className="flex items-center justify-between">
                                <label htmlFor="upperBody" className="text-sm">
                                    Upper Body
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
                                    Lower Body
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
                                    Full Body
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

                    {/* Favorite Exercises List */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-6 text-gray-900">Favorite Exercises List</h3>
                        <div className="overflow-x-auto sm:overflow-visible">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Exercise Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {favoriteExercises.map((exercise) => (
                                        <TableRow key={exercise.title}>
                                            <TableCell>{exercise.title}</TableCell>
                                            <TableCell>{exercise.category}</TableCell>
                                            <TableCell>{exercise.duration}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    Remove
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Notification Settings Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Notification Settings</h2>
                    {!isEditing && (
                        <Button
                            variant="edit"
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit Times
                        </Button>
                    )}
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    {loadingStates.notifications ? (
                        <div className="space-y-4">
                            {/* Header Skeleton */}
                            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"/>

                            {/* Time Slots Skeleton */}
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {[1, 2, 3].map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-20 bg-gray-50 rounded-lg p-4"
                                    >
                                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"/>
                                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Exercise Reminder Times
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {isEditing
                                        ? "Add or remove times when you'd like to be reminded to exercise. Times must be at least 15 minutes apart."
                                        : preferences.active
                                            ? "Your custom exercise reminder times are set."
                                            : "Using default reminder times set by your administrator."
                                    }
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
                                                {isEditing && isEditingTime === index ? (
                                                    // Editing Mode UI
                                                    <div className="flex-1">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <select
                                                                value={editHour}
                                                                onChange={(e) => setEditHour(e.target.value)}
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
                                                                    setIsEditingTime(null);
                                                                    setEditHour('');
                                                                    setEditMinute('');
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleSaveEditedTime(index)}
                                                                className="bg-[#8BC5B5] hover:bg-[#7AB4A4] text-white"
                                                            >
                                                                Save
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Display Mode UI
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {format12Hour(time)}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Exercise Reminder
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action buttons - Only show when in edit mode and not currently editing this specific time */}
                                            {isEditing && isEditingTime !== index && (
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
                                    {isEditing && (
                                        <button
                                            onClick={() => setIsAddTimeOpen(true)}
                                            className="h-full min-h-[120px] rounded-lg border-2 border-dashed border-gray-200 hover:border-[#8BC5B5] flex items-center justify-center text-gray-500 hover:text-[#8BC5B5] transition-colors"
                                        >
                                            <Plus className="h-6 w-6 mr-2" />
                                            Add Time
                                        </button>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <Button
                                            variant="cancel"
                                            onClick={() => {
                                                setIsEditing(false)
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSaveTimes}
                                            className="bg-[#8BC5B5] hover:bg-[#7AB4A4]"
                                        >
                                            Save Times
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Add Time Dialog */}
                <Dialog open={isAddTimeOpen} onOpenChange={setIsAddTimeOpen}>
                    <DialogContent className="sm:max-w-[400px] bg-white">
                        <DialogHeader>
                            <DialogTitle className={"text-gray-900"}>Add Exercise Time</DialogTitle>
                            <DialogDescription className={"text-gray-700"}>
                                Choose a time for your exercise reminder. Times must be at least 15 minutes apart.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Hour
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
                                        Minute
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
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddTime}
                                disabled={!isValidNewTime()}
                            >
                                Add Time
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen !== null} onOpenChange={() => setDeleteDialogOpen(null)}>
                    <AlertDialogContent className="sm:max-w-[400px] bg-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-600">
                                Remove Exercise Time
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {deleteDialogOpen !== null && preferences.times[deleteDialogOpen] && (
                                    <div className="space-y-3">
                                        <p className={"text-gray-900"}>
                                            Are you sure you want to remove this exercise reminder?
                                        </p>
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            <p className="font-medium text-gray-900">
                                                {format12Hour(preferences.times[deleteDialogOpen])}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteDialogOpen(null)}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (deleteDialogOpen !== null) {
                                        handleDeleteTime(deleteDialogOpen)
                                        setDeleteDialogOpen(null)
                                    }
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Remove Time
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </section>
        </div>
    );
}
