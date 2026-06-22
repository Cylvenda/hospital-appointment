"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Notification01Icon } from "@hugeicons/core-free-icons"

export default function NotificationsPage() {
    return (
        <motion.div
            className="mx-auto w-full max-w-6xl space-y-8 p-4 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <HugeiconsIcon icon={Notification01Icon} className="w-8 h-8 text-primary" />
                        Notifications
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        View critical alerts and system notifications.
                    </p>
                </div>
            </div>

            <Card className="shadow-sm border-muted/40">
                <CardHeader className="bg-muted/10 pb-4 border-b border-muted/20">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                        Alert Center
                    </CardTitle>
                    <CardDescription>
                        Stay updated with priority results
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-12 text-center text-muted-foreground">
                    <p>No new notifications</p>
                </CardContent>
            </Card>
        </motion.div>
    )
}
