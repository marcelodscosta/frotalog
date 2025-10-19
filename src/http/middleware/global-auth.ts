import { FastifyRequest, FastifyReply } from 'fastify'
import { authMiddleware } from './auth'
import { PUBLIC_ROUTES } from './public-routes'

export async function globalAuthMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const route = `${request.method} ${request.routerPath}`
  
  // Debug: log da rota para verificar
  console.log('Checking route:', route)
  
  // Verificar se a rota é pública
  const isPublicRoute = PUBLIC_ROUTES.some(publicRoute => {
    console.log('Comparing with public route:', publicRoute)
    // Converter rota pública para regex para comparar com parâmetros dinâmicos
    const publicRouteRegex = publicRoute.replace(/:\w+/g, '[^/]+')
    const routeRegex = new RegExp(`^${publicRouteRegex}$`)
    const matches = routeRegex.test(route)
    console.log('Matches:', matches)
    return matches
  })

  console.log('Is public route:', isPublicRoute)

  // Se for rota pública, não aplicar autenticação
  if (isPublicRoute) {
    return
  }

  // Aplicar middleware de autenticação para rotas protegidas
  await authMiddleware(request, reply)
}
