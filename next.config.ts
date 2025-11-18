import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove widget de desenvolvimento Next.js
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  
  // Ignorar erros durante build (compatibilidade Vercel)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuração de imagens para principais provedores
  images: {
    remotePatterns: [
      // Unsplash - Banco de imagens gratuitas
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.com',
      },
      
      // Vercel Blob
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      
      // Pexels - Banco de imagens gratuitas
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      
      // Pixabay - Banco de imagens gratuitas
      {
        protocol: 'https',
        hostname: 'pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      
      // GitHub (avatares, imagens de repos)
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      
      // Para desenvolvimento local
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    
    // Formatos de imagem suportados
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuração experimental para melhor performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default nextConfig;
