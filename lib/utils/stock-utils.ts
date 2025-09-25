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

export function getProductImage(productId: number): string {
  const product = (productsData as Product[]).find(p => p.id === productId)
  const image = product?.image || '/placeholder.jpg'
  return image.startsWith('/') ? image : `/${image}`
}

export function getProductRetailPrice(productId: number): number | undefined {
  const product = (productsData as Product[]).find(p => p.id === productId)
  return product?.retailPrice
}

export function getProductFinalCustomerPrice(productId: number): number | undefined {
  const product = (productsData as Product[]).find(p => p.id === productId)
  return product?.finalCustomerPrice
}

export function getProductPoints(productId: number, tier: string): number {
  const product = (productsData as Product[]).find(p => p.id === productId)
  if (!product) return 0
  
  switch (tier?.toLowerCase()) {
    case 'gold':
      return product.pointsGold
    case 'silver':
      return product.pointsSilver
    case 'bronze':
      return product.pointsBronze
    default:
      return product.pointsBronze // Default to bronze
  }
}

// Fonction pour enrichir les données d'historique stock avec les noms
export function enrichStockHistory(stockHistory: StockHistory[]): StockHistory[] {
  return stockHistory.map(item => ({
    ...item,
    userName: getUserFullName(item.userId),
    productMarketingName: getProductMarketingName(item.productId),
    productImage: getProductImage(item.productId),
    productRetailPrice: getProductRetailPrice(item.productId),
    productFinalCustomerPrice: getProductFinalCustomerPrice(item.productId),
    productPoints: getProductPoints(item.productId, 'gold') // Default to gold, can be updated based on user tier
  }))
}

// Fonction pour enrichir un seul élément d'historique
export function enrichSingleStockHistory(item: StockHistory): StockHistory {
  return {
    ...item,
    userName: getUserFullName(item.userId),
    productMarketingName: getProductMarketingName(item.productId),
    productImage: getProductImage(item.productId),
    productRetailPrice: getProductRetailPrice(item.productId),
    productFinalCustomerPrice: getProductFinalCustomerPrice(item.productId),
    productPoints: getProductPoints(item.productId, 'gold')
  }
}