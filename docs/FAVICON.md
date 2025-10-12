# 🎨 Favicon e Ícones do Projeto

## Arquivos Criados

### 1. `/public/favicon.svg`
**Favicon principal em SVG** - Escalável e moderno
- Círculo com gradiente roxo → rosa
- Escudo branco simbolizando segurança
- Triângulo de alerta rosa dentro do escudo
- Ponto de exclamação para chamar atenção
- Efeito de brilho sutil

### 2. `/public/apple-touch-icon.svg`
**Ícone para dispositivos iOS**
- 180x180px otimizado para Apple devices
- Bordas arredondadas (rx="40") conforme design iOS
- Mesmo conceito visual, mas maior e mais destacado
- Usado quando o site é adicionado à tela inicial do iPhone/iPad

### 3. `/public/site.webmanifest`
**Manifest para PWA (Progressive Web App)**
- Define nome e descrição do app
- Cores tema e background
- Referências aos ícones
- Permite instalação como app

### 4. `/public/favicon.ico` (existente)
**Favicon legado em formato ICO**
- Compatibilidade com navegadores antigos
- Next.js gerencia automaticamente

## 🎨 Design Conceitual

### Cores
- **Gradiente**: Roxo (#A855F7) → Rosa (#EC4899)
- **Escudo**: Branco (#FFFFFF) com 95% opacidade
- **Alerta**: Rosa (#EC4899)

### Simbolismo
1. **Escudo**: Representa segurança e proteção
2. **Triângulo de Alerta**: Perigo/cuidado
3. **Exclamação**: Atenção importante
4. **Gradiente Vibrante**: Atrativo e moderno, alinhado com a UI do projeto

## 📱 Compatibilidade

### Navegadores Desktop
- ✅ Chrome/Edge (SVG)
- ✅ Firefox (SVG)
- ✅ Safari (SVG)
- ✅ Todos os navegadores (ICO fallback)

### Dispositivos Móveis
- ✅ iOS Safari (apple-touch-icon)
- ✅ Android Chrome (via manifest)
- ✅ PWA support completo

## 🔧 Implementação no Código

No arquivo `/src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.svg',
  },
}
```

## 🚀 Melhorias Futuras

Se quiser criar versões PNG para melhor compatibilidade:

1. **favicon-16x16.png** - Para navegadores antigos
2. **favicon-32x32.png** - Tamanho padrão
3. **favicon-192x192.png** - Android Chrome
4. **favicon-512x512.png** - PWA splash screen

### Como gerar (se tiver ImageMagick):
```bash
# Instalar ImageMagick
sudo apt-get install imagemagick

# Converter SVG para PNG
convert public/favicon.svg -resize 32x32 public/favicon-32x32.png
convert public/favicon.svg -resize 192x192 public/favicon-192x192.png
convert public/favicon.svg -resize 512x512 public/favicon-512x512.png
```

### Ou usar ferramentas online:
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

## 📝 Notas

- SVG é preferível por ser escalável e menor em tamanho
- O Next.js otimiza automaticamente os favicons
- O manifest permite que o site seja instalado como PWA
- Cores alinhadas com o design system do projeto (roxo/rosa/branco)

---

**Projeto**: Sorteio Relâmpago - ENTEC 2025  
**Instituição**: UNIUBE - Campus Aeroporto
