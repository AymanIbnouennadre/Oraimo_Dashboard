import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Construire le chemin vers l'image dans le dossier images/ à la racine
    const imagePath = path.join(process.cwd(), 'images', ...params.path)
    
    // Vérifier que le fichier existe
    const imageBuffer = await fs.readFile(imagePath)
    
    // Déterminer le type de contenu basé sur l'extension
    const ext = path.extname(imagePath).toLowerCase()
    let contentType = 'image/jpeg' // par défaut
    
    switch (ext) {
      case '.png':
        contentType = 'image/png'
        break
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.webp':
        contentType = 'image/webp'
        break
      case '.svg':
        contentType = 'image/svg+xml'
        break
    }
    
    // Retourner l'image avec les bons headers
    return new NextResponse(imageBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache 1 an
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Image not found', { status: 404 })
  }
}