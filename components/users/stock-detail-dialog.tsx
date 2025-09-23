"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { toast } from "react-toastify";
import { getCookie } from "@/components/auth/auth-provider";

interface StockDetailDialogProps {
  userId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StockDetailDialog({ userId, open, onOpenChange }: StockDetailDialogProps) {
  const [loading, setLoading] = useState(false);
  const [totalStock, setTotalStock] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [stockDetails, setStockDetails] = useState<any[]>([]);

  useEffect(() => {
    if (userId && open) {
      setLoading(true);
      console.log("Fetching stock details for userId:", userId);
      const token = getCookie("oraimo_token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      Promise.all([
        fetch(`http://localhost:8080/api/history-stock/users/${userId}/stock/total`, { headers })
          .then((res) => {
            console.log("Total stock response status:", res.status);
            return res.ok ? res.json() : Promise.reject("Failed to fetch total stock");
          }),
        fetch(`http://localhost:8080/api/history-stock/users/${userId}/points`, { headers })
          .then((res) => {
            console.log("Total points response status:", res.status);
            return res.ok ? res.json() : Promise.reject("Failed to fetch total points");
          }),
        fetch(`http://localhost:8080/api/history-stock/users/${userId}/stock/by-product`, { headers })
          .then((res) => {
            console.log("Stock by product response status:", res.status);
            return res.ok ? res.json() : Promise.reject("Failed to fetch stock details");
          }),
      ])
        .then(([stockResponse, pointsResponse, stockDetailsResponse]) => {
          console.log("Total stock response:", stockResponse);
          console.log("Total points response:", pointsResponse);
          console.log("Stock details response:", stockDetailsResponse);
          setTotalStock(stockResponse?.totalStock || 0);
          setTotalPoints(pointsResponse?.totalPoints || 0);
          setStockDetails(Array.isArray(stockDetailsResponse) ? stockDetailsResponse : []);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to load stock details. Please try again.");
          setTotalStock(0);
          setTotalPoints(0);
          setStockDetails([]);
        })
        .finally(() => setLoading(false));
    }
  }, [userId, open]);

  if (!userId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Stock Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <LoadingOverlay show={true} />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{totalStock}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{totalPoints}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Stock by Product</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Model</TableHead>
                      <TableHead>Available Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockDetails.map((detail: any) => (
                      <TableRow key={detail.productId}>
                        <TableCell>{detail.productModel}</TableCell>
                        <TableCell>{detail.availableStock}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}