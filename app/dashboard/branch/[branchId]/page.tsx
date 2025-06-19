"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, Heart, UserPlus, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { T, useLanguage } from "@/contexts/LanguageContext"

// Sample branch data
const branchData = [
	{
		branchId: 1,
		name: "Springfield Branch",
		location: "Springfield",
		orphans: 45,
		inventory: 120,
		fundraisers: 5,
		volunteers: 12,
	},
	{
		branchId: 2,
		name: "Downtown Branch",
		location: "Downtown",
		orphans: 38,
		inventory: 95,
		fundraisers: 3,
		volunteers: 9,
	},
	{
		branchId: 3,
		name: "Riverside Branch",
		location: "Riverside",
		orphans: 42,
		inventory: 110,
		fundraisers: 4,
		volunteers: 8,
	},
	{
		branchId: 4,
		name: "Hillside Branch",
		location: "Hillside",
		orphans: 31,
		inventory: 85,
		fundraisers: 2,
		volunteers: 7,
	},
]

export default function BranchViewPage() {
	const params = useParams()
	const router = useRouter()
	const { user } = useAuth()
	const { t } = useLanguage()
	const [branch, setBranch] = useState<any>(null)
	const branchId = Number(params.branchId)

	useEffect(() => {
		// In a real app, this would be an API call to fetch branch data
		const foundBranch = branchData.find((b) => b.branchId === branchId)
		if (foundBranch) {
			setBranch(foundBranch)
		} else {
			router.push("/dashboard/superadmin/branches")
		}
	}, [branchId, router])

	// Ensure superadmin access only
	useEffect(() => {
		if (user?.role !== "super_admin") {
			router.push("/login")
		}
	}, [user, router])

	if (!branch) {
		return <div className="p-8 text-center"><T k="branch.loading" /></div>
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{branch.name}</h1>
					<p className="text-muted-foreground">
						{t("branch.viewOnlyAccess")}
					</p>
				</div>
				<Button variant="outline" onClick={() => router.push("/dashboard/superadmin/branches")}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					<T k="branch.backToBranches" />
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card
					className="cursor-pointer hover:bg-gray-50"
					onClick={() => router.push(`/dashboard/branch/${branchId}/orphans`)}
				>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium"><T k="branch.orphans" /></CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{branch.orphans}</div>
						<p className="text-xs text-muted-foreground"><T k="branch.clickToView" /></p>
					</CardContent>
				</Card>
				<Card
					className="cursor-pointer hover:bg-gray-50"
					onClick={() => router.push(`/dashboard/branch/${branchId}/inventory`)}
				>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium"><T k="branch.inventory" /></CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{branch.inventory}</div>
						<p className="text-xs text-muted-foreground"><T k="branch.clickToView" /></p>
					</CardContent>
				</Card>
				<Card
					className="cursor-pointer hover:bg-gray-50"
					onClick={() => router.push(`/dashboard/branch/${branchId}/fundraisers`)}
				>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium"><T k="branch.fundraisers" /></CardTitle>
						<Heart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{branch.fundraisers}</div>
						<p className="text-xs text-muted-foreground"><T k="branch.clickToView" /></p>
					</CardContent>
				</Card>
				<Card
					className="cursor-pointer hover:bg-gray-50"
					onClick={() => router.push(`/dashboard/branch/${branchId}/volunteers`)}
				>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium"><T k="branch.volunteers" /></CardTitle>
						<UserPlus className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{branch.volunteers}</div>
						<p className="text-xs text-muted-foreground"><T k="branch.clickToView" /></p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle><T k="branch.performance" /></CardTitle>            <CardDescription>{t("branch.keyMetrics")}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium"><T k="branch.orphanCapacity" /></p>
									<span className="text-xs text-muted-foreground">{branch.orphans}/50 <T k="branch.orphansLabel" /></span>
								</div>
								<div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
									<div
										className="h-full bg-blue-500 rounded-full"
										style={{ width: `${(branch.orphans / 50) * 100}%` }}
									></div>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium"><T k="branch.inventoryStatus" /></p>
									<span className="text-xs text-muted-foreground">{branch.inventory}/150 <T k="branch.itemsLabel" /></span>
								</div>
								<div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
									<div
										className="h-full bg-green-500 rounded-full"
										style={{ width: `${(branch.inventory / 150) * 100}%` }}
									></div>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium"><T k="branch.fundraisingProgress" /></p>
									<span className="text-xs text-muted-foreground">{branch.fundraisers}/10 <T k="branch.campaignsLabel" /></span>
								</div>
								<div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
									<div
										className="h-full bg-blue-500 rounded-full"
										style={{ width: `${(branch.fundraisers / 10) * 100}%` }}
									></div>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium"><T k="branch.volunteerEngagement" /></p>
									<span className="text-xs text-muted-foreground">{branch.volunteers}/15 <T k="branch.volunteersLabel" /></span>
								</div>
								<div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
									<div
										className="h-full bg-purple-500 rounded-full"
										style={{ width: `${(branch.volunteers / 15) * 100}%` }}
									></div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle><T k="branch.details" /></CardTitle>
						<CardDescription><T k="branch.information" /></CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<p className="text-sm font-medium"><T k="branch.name" /></p>
								<p className="text-sm">{branch.name}</p>
							</div>
							<div>
								<p className="text-sm font-medium"><T k="branch.location" /></p>
								<p className="text-sm">{branch.location}</p>
							</div>
							<div>
								<p className="text-sm font-medium"><T k="branch.status" /></p>
								<p className="text-sm text-green-600"><T k="branch.active" /></p>
							</div>
							<div>
								<p className="text-sm font-medium"><T k="branch.lastUpdated" /></p>
								<p className="text-sm">2023-05-10</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
