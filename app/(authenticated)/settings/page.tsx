'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Pencil, Trash2 } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export default function SettingsPage() {
    const [muscleGroups, setMuscleGroups] = useState({
        upperBody: false,
        lowerBody: true,
        fullBody: false,
        core: true,
    })

    const [reminderIntervals, setReminderIntervals] = useState({
        twoHours: true,
        fourHours: false,
        eightHours: true,
        daily: false,
    })

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

    const customReminders = [
        'Remind me to exercise at 10:00 AM',
        'Remind me to exercise at 02:00 PM',
        'Remind me to exercise at 07:00 PM',
    ]

    return (
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
            {/* Personal Info Section */}
            <section>
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Personal Info</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm text-gray-600">Name</label>
                            <Input id="name" defaultValue="John"/>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm text-gray-600">Email</label>
                            <Input id="email" type="email" defaultValue="abc@gmail.com"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm text-gray-600">Password</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Input
                                id="password"
                                type="password"
                                defaultValue="12345!@#$"
                                className="bg-gray-50"
                                disabled
                            />
                            <Button variant="default" className="w-full sm:w-auto">
                                Change Password
                            </Button>
                        </div>
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
                                    aria-label="Toggle upper body exercises"
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

                            {/* Card-based layout for small screens */}
                            <div className="sm:hidden space-y-4">
                                {favoriteExercises.map((exercise) => (
                                    <div key={exercise.title} className="bg-white rounded-lg shadow-sm p-4">
                                        <h4 className="text-md font-medium">{exercise.title}</h4>
                                        <p className="text-sm text-gray-600">Category: {exercise.category}</p>
                                        <p className="text-sm text-gray-600">Duration: {exercise.duration}</p>
                                        <div className="flex justify-end mt-2">
                                            <Button variant="ghost" size="sm"
                                                    className="text-red-500 hover:text-red-600">
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Notification Settings Section */}
            <section>
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Notification Settings</h2>
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Reminder */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-2 text-gray-900">Reminder</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Choose how often you want to receive notifications.
                        </p>
                        <div className="space-y-4 text-gray-900">
                            <div className="flex items-center justify-between">
                                <label htmlFor="twoHours" className="text-sm">
                                    Every 2 hours
                                </label>
                                <Switch
                                    id="twoHours"
                                    checked={reminderIntervals.twoHours}
                                    onCheckedChange={(checked) =>
                                        setReminderIntervals((prev) => ({
                                            ...prev,
                                            twoHours: checked,
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="fourHours" className="text-sm">
                                    Every 4 hours
                                </label>
                                <Switch
                                    id="fourHours"
                                    checked={reminderIntervals.fourHours}
                                    onCheckedChange={(checked) =>
                                        setReminderIntervals((prev) => ({
                                            ...prev,
                                            fourHours: checked,
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="eightHours" className="text-sm">
                                    Every 8 hours
                                </label>
                                <Switch
                                    id="eightHours"
                                    checked={reminderIntervals.eightHours}
                                    onCheckedChange={(checked) =>
                                        setReminderIntervals((prev) => ({
                                            ...prev,
                                            eightHours: checked,
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="daily" className="text-sm">
                                    Daily
                                </label>
                                <Switch
                                    id="daily"
                                    checked={reminderIntervals.daily}
                                    onCheckedChange={(checked) =>
                                        setReminderIntervals((prev) => ({ ...prev, daily: checked }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Custom Time Reminder */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                            <h3 className="text-lg font-medium text-gray-900">Custom Time Reminder</h3>
                            <Button className="bg-[#8BC5B5] hover:bg-[#7AB4A4] w-full sm:w-auto">
                                Add New Reminder
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {customReminders.map((reminder, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2"
                                >
                                    <span className="text-sm text-gray-900">{reminder}</span>
                                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                                        <Button variant="edit" size="sm">
                                            <Pencil className="h-4 w-4 mr-2"/>
                                            Edit
                                        </Button>
                                        <Button variant="colorRed" size="sm">
                                            <Trash2 className="h-4 w-4 mr-2"/>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}