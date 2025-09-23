import { StockHistory } from '@/lib/types'
import usersData from '@/lib/mocks/users.json'
import productsData from '@/lib/mocks/products.json'

// Types pour les données mock
interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  status: string
  storeTiers: string
  role: string
  created: string
}

interface Product {
  id: number
  classLabel: string
  model: string
  marketingName: string
  category: string
  retailPrice: number
  finalCustomerPrice: number
  image: string
  seuil: number
  pointsGold: number
  pointsSilver: number
  pointsBronze: number
  createdAt: string
}

// Fonctions utilitaires pour résoudre les noms
export function getUserFullName(userId: number): string {
  const user = (usersData as User[]).find(u => u.id === userId)
  return user ? `${user.firstName} ${user.lastName}` : `Utilisateur ${userId}`
}

export function getProductMarketingName(productId: number): string {
  const product = (productsData as Product[]).find(p => p.id === productId)
  return product?.marketingName || `Produit ${productId}`
}

// Fonction pour enrichir les données d'historique stock avec les noms
export function enrichStockHistory(stockHistory: StockHistory[]): StockHistory[] {
  return stockHistory.map(item => ({
    ...item,
    userName: getUserFullName(item.userId),
    productMarketingName: getProductMarketingName(item.productId)
  }))
}

// Fonction pour enrichir un seul élément d'historique
export function enrichSingleStockHistory(item: StockHistory): StockHistory {
  return {
    ...item,
    userName: getUserFullName(item.userId),
    productMarketingName: getProductMarketingName(item.productId)
  }
}