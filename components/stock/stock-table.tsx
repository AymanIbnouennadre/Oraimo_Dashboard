"use client"

import * as React from "react"
import { MoreHorizontal, Pencil, Trash2, Eye, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { StockMovement } from "@/lib/types"

type Props = {
  movements: StockMovement[]
  onEdit: (movement: StockMovement) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export function StockTable({ movements, onEdit, onDelete, onAdd }: Props) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Stock Movements</CardTitle>

        {/* bouton d’ajout (hors menu) */}
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <Plus className="h-4 w-4" />
          Add Movement
        </button>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[220px]">Product</TableHead>
              <TableHead className="w-[110px]">Type</TableHead>
              <TableHead className="w-[110px] text-right">Quantity</TableHead>
              <TableHead className="w-[120px] text-right">Points</TableHead>
              <TableHead className="min-w-[160px]">User</TableHead>
              <TableHead className="min-w-[180px]">Date</TableHead>
              <TableHead className="min-w-[130px]">Detection ID</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {movements.map((m) => (
              <TableRow key={m.id} className="hover:bg-accent/40">
                <TableCell className="font-medium">{m.product_name}</TableCell>

                <TableCell>
                  <span
                    className={[
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      m.type === "IN"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                    ].join(" ")}
                  >
                    {m.type === "IN" ? (
                      <>
                        {/* point statut */}
                        <span className="size-1.5 rounded-full bg-current" />
                        IN
                      </>
                    ) : (
                      <>
                        <span className="size-1.5 rounded-full bg-current" />
                        OUT
                      </>
                    )}
                  </span>
                </TableCell>

                <TableCell className="text-right">{m.quantity}</TableCell>
                <TableCell className="text-right">{m.points?.toLocaleString?.() ?? m.points}</TableCell>
                <TableCell>{m.user_name}</TableCell>
                <TableCell>
                  {m.date ? new Date(m.date).toLocaleString() : "-"}
                </TableCell>

                <TableCell>
                  {m.detection_id ? (
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs">
                      {m.detection_id}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">–</span>
                  )}
                </TableCell>

                {/* Actions (3 points) */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    {/* ✅ PAS de asChild : le trigger rend un <button> natif qui supporte ref */}
                    <DropdownMenuTrigger
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                      aria-label="Row actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40 z-50">
                      <DropdownMenuItem
                        onClick={() => onEdit(m)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View / Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(m.id)}
                        className="flex items-center gap-2 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {movements.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  No movements match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
