"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"

interface InviteEmployeesDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function InviteEmployeesDialog({ isOpen, onClose }: Readonly<InviteEmployeesDialogProps>) {

    type EmailWithRole = {
    email: string
    role: "user" | "admin"
    }

    const [emailInput, setEmailInput] = React.useState("")
    const [emailList, setEmailList] = React.useState<EmailWithRole[]>([])
    const [inviteLoading, setInviteLoading] = React.useState(false)
    const [inviteError, setInviteError] = React.useState("")
    const [inviteSuccess, setInviteSuccess] = React.useState("")

    function handleAddEmail() {
        setInviteError("")
        setInviteSuccess("")

        const trimmed = emailInput.trim()
        if (!trimmed) return

        const emailRegex = /\S+@\S+\.\S+/
        if (!emailRegex.test(trimmed)) {
            setInviteError("Invalid email format.")
            return
        }

        setEmailList((prev) => [...prev, { email: trimmed, role: "user" }])
        setEmailInput("")
    }

    function handleRemoveEmail(index: number) {
        setInviteError("")
        setInviteSuccess("")
        setEmailList((prev) => prev.filter((_, i) => i !== index))
    }

    function toggleRole(index: number) {
        setEmailList((prev) =>
            prev.map((item, i) =>
            i === index ? { ...item, role: item.role === "user" ? "admin" : "user" } : item
            )
        )
    }


    async function handleInviteAll() {
        setInviteLoading(true)
        setInviteError("")
        setInviteSuccess("")

        try {
            if (!emailList.length) {
                setInviteError("No emails to invite.")
                return
            }

            for (const { email, role } of emailList) {
            const response = await fetch('/api/admin/invite', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, role }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to send invite')
            }
            }

            setInviteSuccess(`Invitaciones enviadas a ${emailList.length} email(s).`)
            setEmailList([])
            setTimeout(() => {
                setInviteSuccess("")
                onClose()
            }, 2000)
        } catch (error) {
            console.error("Error sending invites:", error)
            setInviteError(error instanceof Error ? error.message : "Failed to send invites. Please try again.")
        } finally {
            setInviteLoading(false)
        }
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-100"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                                    Invitar Empleados
                                </Dialog.Title>

                                {inviteError && (
                                    <p className="mt-2 text-sm text-red-600">{inviteError}</p>
                                )}
                                {inviteSuccess && (
                                    <p className="mt-2 text-sm text-green-600">{inviteSuccess}</p>
                                )}

                                <div className="mt-4">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Email de invitación
                                    </label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="john.doe@example.com"
                                            value={emailInput}
                                            onChange={(e) => setEmailInput(e.target.value)}
                                            className="text-[color:#4F7C6B]"
                                        />
                                        <Button onClick={handleAddEmail}>Añadir</Button>
                                    </div>

                                    {emailList.length > 0 && (
                                        <ul className="mt-4 space-y-2">
                                            {emailList.map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center justify-between p-2 border rounded-md"
                                            >
                                                <span className="text-sm text-[color:#4F7C6B]">{item.email}</span>
                                                <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleRole(index)}
                                                    title={`Invite as ${item.role === 'user' ? 'Admin' : 'User'}`}
                                                    className="text-[color:#4F7C6B] hover:text-[color:#3A5B4D] focus:outline-none"
                                                >
                                                    {item.role === "admin" ? "A" : "U"}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveEmail(index)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                                </div>
                                            </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <Button variant="secondary" onClick={onClose}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        className="bg-[#8BC5B5] hover:bg-[#7AB4A4] text-white"
                                        onClick={handleInviteAll}
                                        disabled={inviteLoading || emailList.length === 0}
                                    >
                                        {inviteLoading ? "Enviando..." : "Enviar Invitaciones"}
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}